"""GPU benchmark orchestration and metrics collection - REFACTORED."""

import time
from typing import Dict, Any, List, Optional
from datetime import datetime

from .config import BenchmarkConfig
from .storage import BaselineStorage
from .workloads import GPUStressWorker
from .metrics_sampler import GPUMetricsSampler


class GPUBenchmark:
    """GPU Benchmark with real-time monitoring and stress workload."""
    
    def __init__(self, db_path: str = './metrics.db'):
        self.running = False
        self.should_stop = False
        self.config: Optional[BenchmarkConfig] = None
        self.samples: List[Dict[str, Any]] = []
        self.stop_reason: Optional[str] = None
        self.start_time: Optional[float] = None
        self.progress = 0
        self.current_phase = ""
        self.results: Dict[str, Any] = {}
        self.baseline_storage = BaselineStorage(db_path)
        self.stress_worker: Optional[GPUStressWorker] = None
        self.iteration_times: List[float] = []
        self.completed_full = False
        self.db_path = db_path
        
        # Initialize metrics sampler
        self.metrics_sampler = GPUMetricsSampler()
    
    def get_gpu_info(self) -> Dict[str, Any]:
        """Get GPU information."""
        return self.metrics_sampler.get_gpu_info()
    
    def get_status(self) -> Dict[str, Any]:
        """Get current benchmark status."""
        render_fps = getattr(self, 'render_fps', 0.0)
        gpu_util = self.metrics_sampler.get_current_util() if hasattr(self, 'metrics_sampler') and self.metrics_sampler else 0
        return {
            'running': getattr(self, 'running', False),
            'progress': getattr(self, 'progress', 0),
            'phase': getattr(self, 'current_phase', 'Initializing'),
            'samples_count': len(getattr(self, 'samples', [])),
            'iterations': self.stress_worker.iterations if self.stress_worker else 0,
            'workload_type': self.stress_worker.workload_type if self.stress_worker else 'N/A',
            'latest_sample': self.samples[-1] if getattr(self, 'samples', []) else None,
            'fps': render_fps,
            'gpu_util': gpu_util,
        }
    
    def get_samples(self) -> list:
        """Get all collected samples for real-time graphing."""
        return getattr(self, 'samples', []).copy()
    
    def get_results(self) -> Dict[str, Any]:
        """Get benchmark results."""
        return self.results
    
    def stop(self):
        """Request benchmark to stop."""
        self.should_stop = True
        
    def run_stress_benchmark(self, visualize: bool = False):
        """Run the stress benchmark loop with optional visualization."""
        from .visualizer import create_visualizer
        
        self.running = True
        self.start_time = time.time()
        
        # Create visualizer if requested
        visualizer = create_visualizer(
            enabled=visualize,
            window_size=(1200, 800),
            max_render_particles=2000
        ) if visualize else None
        
        if visualize and not visualizer:
            print("[WARNING] Visualization requested but not available")
        
        # Start background GPU metrics collection
        self.metrics_sampler.start()
        
        sample_interval = self.config.sample_interval_ms / 1000.0
        last_sample_time = 0
        
        # FPS tracking independent of rendering
        frame_times = []
        max_frame_history = 10
        last_frame_time = time.time()
        
        # Auto-scaling
        last_scale_check = 0
        scale_interval = 2.0
        scale_count = 0
        max_scales = 15
        
        while True:
            elapsed = time.time() - self.start_time
            
            # Check duration
            if elapsed >= self.config.duration_seconds:
                print()  # New line after real-time metrics
                self.stop_reason = "Duration completed"
                self.completed_full = True
                break
            
            # Run one iteration of stress work
            iter_time = self.stress_worker.run_iteration()
            self.iteration_times.append(iter_time)
            
            # Sample GPU metrics for storage (at configured interval)
            if elapsed - last_sample_time >= sample_interval:
                sample = self.metrics_sampler.sample_metrics()
                sample['elapsed_sec'] = round(elapsed, 2)
                sample['iterations'] = self.stress_worker.iterations
                sample['last_iter_ms'] = round(iter_time, 2)
                self.samples.append(sample)
                last_sample_time = elapsed
            
            # Render visualization frame (every frame, no throttling)
            if visualizer and visualizer.running:
                # Calculate stable FPS from recent frame times
                now = time.time()
                frame_time = now - last_frame_time
                last_frame_time = now
                
                frame_times.append(frame_time)
                if len(frame_times) > max_frame_history:
                    frame_times.pop(0)
                
                avg_frame_time = sum(frame_times) / len(frame_times)
                render_fps = 1.0 / avg_frame_time if avg_frame_time > 0 else 0
                self.render_fps = render_fps
                
                # Update physics parameters from UI
                slider_values = visualizer.get_slider_values()
                self.stress_worker.update_physics_params(
                    gravity_strength=slider_values['gravity'],
                    small_ball_speed=slider_values['small_ball_speed'],
                    initial_balls=int(slider_values['initial_balls']),
                    max_balls_cap=int(slider_values['max_balls_cap']),
                    big_ball_count=int(slider_values.get('big_ball_count', 5)),
                    backend_multiplier=int(slider_values.get('backend_multiplier', 1))
                )
                
                self.stress_worker.update_split_enabled(visualizer.get_split_enabled())
                
                # Process spawn requests
                spawn_requests = visualizer.get_spawn_requests()
                for sim_x, sim_y, count in spawn_requests:
                    self.stress_worker.spawn_big_balls(sim_x, sim_y, count)
                
                # Get particle sample for rendering
                positions, masses, colors, glows = self.stress_worker.get_particle_sample(max_samples=2000)
                
                if positions is not None:
                    influence_boundaries = self.stress_worker.get_influence_boundaries(
                        gravity_strength=slider_values['gravity']
                    )
                    active_particles = int(self.stress_worker._active_count)
                    
                    # Get real-time GPU utilization from background thread
                    gpu_util = self.metrics_sampler.get_current_util()
                    
                    visualizer.render_frame(
                        positions=positions,
                        masses=masses,
                        colors=colors,
                        glows=glows,
                        influence_boundaries=influence_boundaries,
                        total_particles=self.stress_worker._initial_particle_count,
                        active_particles=active_particles,
                        fps=render_fps,
                        gpu_util=gpu_util,
                        elapsed_time=elapsed
                    )
            
            # Auto-scaling check
            if self.config.auto_scale and elapsed - last_scale_check >= scale_interval:
                current_sample = self.samples[-1] if self.samples else {}
                gpu_util_check = current_sample.get('utilization', 0)
                
                if scale_count < max_scales:
                    if gpu_util_check < 70:
                        print(f"[Auto-Scale] GPU util {gpu_util_check}% << target, scaling 2.0x...")
                        self.stress_worker.scale_workload(2.0)
                        scale_count += 1
                    elif gpu_util_check < 85:
                        print(f"[Auto-Scale] GPU util {gpu_util_check}% < target, scaling 1.5x...")
                        self.stress_worker.scale_workload(1.5)
                        scale_count += 1
                    elif gpu_util_check < 93:
                        print(f"[Auto-Scale] GPU util {gpu_util_check}% near target, scaling 1.2x...")
                        self.stress_worker.scale_workload(1.2)
                        scale_count += 1
                
                last_scale_check = elapsed
            
            # Check stop conditions
            if self.samples:
                latest_sample = self.samples[-1]
                stop = self.metrics_sampler.check_stop_conditions(latest_sample, self.config)
                if stop:
                    self.stop_reason = stop
                    break
            
            # Check if user stopped
            if self.should_stop or (visualizer and not visualizer.running):
                self.stop_reason = "User stopped" if self.should_stop else "Visualization closed"
                break
            
            # Update progress
            self.progress = int((elapsed / self.config.duration_seconds) * 100)
        
        # Cleanup
        if visualizer:
            visualizer.close()
        
        return self._calculate_results()
    
    def _calculate_results(self) -> Dict[str, Any]:
        """Calculate benchmark results from samples."""
        elapsed_sec = time.time() - self.start_time if self.start_time else 0
        
        if not self.samples:
            return {
                'error': 'No samples collected',
                'duration_actual_sec': round(elapsed_sec, 2),
                'stop_reason': self.stop_reason or 'Unknown'
            }
        
        valid_samples = [s for s in self.samples if 'error' not in s]
        
        if not valid_samples:
            return {
                'error': 'All samples had errors',
                'duration_actual_sec': round(elapsed_sec, 2),
                'stop_reason': self.stop_reason or 'Unknown'
            }
        
        def calc_stats(key: str) -> Dict[str, float]:
            values = [s.get(key, 0) for s in valid_samples]
            return {
                'min': round(min(values), 2),
                'max': round(max(values), 2),
                'avg': round(sum(values) / len(values), 2),
            }
        
        avg_iter_time = sum(self.iteration_times) / len(self.iteration_times) if self.iteration_times else 0
        
        results = {
            'duration_actual_sec': round(elapsed_sec, 2),
            'samples_collected': len(valid_samples),
            'stop_reason': self.stop_reason,
            'completed_full': self.completed_full,
            'workload_type': self.stress_worker.workload_type,
            'benchmark_type': self.config.benchmark_type,
            'iterations_completed': self.stress_worker.iterations,
            'avg_iteration_time_ms': round(avg_iter_time, 2),
            'iterations_per_second': round(1000 / avg_iter_time, 2) if avg_iter_time > 0 else 0,
            'utilization': calc_stats('utilization'),
            'memory_used_mb': calc_stats('memory_used_mb'),
            'temperature_c': calc_stats('temperature_c'),
            'power_w': calc_stats('power_w'),
        }
        
        perf_stats = self.stress_worker.get_performance_stats(elapsed_sec)
        results['performance'] = perf_stats
        
        # Calculate scores
        temp_range = results['temperature_c']['max'] - results['temperature_c']['min']
        stability_score = max(0, 100 - int(temp_range * 5))
        thermal_score = max(0, min(100, int((90 - results['temperature_c']['max']) * 5)))
        
        if self.config.benchmark_type == 'gemm':
            tflops = perf_stats.get('tflops', 0)
            perf_score = min(100, int(tflops * 10))
        elif self.config.benchmark_type == 'particle':
            sps = perf_stats.get('steps_per_second', 0)
            perf_score = min(100, int(sps / 100000))
        else:
            perf_score = min(100, int(results['iterations_completed'] / 10))
        
        results['scores'] = {
            'stability': stability_score,
            'thermal': thermal_score,
            'performance': perf_score,
            'overall': int((stability_score + thermal_score + perf_score) / 3)
        }
        
        return results
    
    def run(self, config: BenchmarkConfig, visualize: bool = False) -> Dict[str, Any]:
        """Run complete benchmark with configuration."""
        self.config = config
        self.samples = []
        self.iteration_times = []
        self.should_stop = False
        self.completed_full = False
        self.running = True
        self.progress = 0
        self.stop_reason = None
        
        # Initialize stress worker
        self.stress_worker = GPUStressWorker(
            benchmark_type=config.benchmark_type,
            config=config
        )
        
        try:
            gpu_info = self.get_gpu_info()
            
            self.results = {
                'timestamp': datetime.now().isoformat(),
                'config': {
                    'mode': config.mode,
                    'benchmark_type': config.benchmark_type,
                    'duration_seconds': config.duration_seconds,
                    'temp_limit_c': config.temp_limit_c,
                    'power_limit_w': config.power_limit_w,
                    'memory_limit_mb': config.memory_limit_mb,
                    'matrix_size': config.matrix_size if config.benchmark_type == 'gemm' else None,
                    'num_particles': config.num_particles if config.benchmark_type == 'particle' else None,
                },
                'gpu_info': gpu_info,
                'status': 'running',
            }
            
            # Get baseline
            if 'name' in gpu_info:
                baseline = self.baseline_storage.get_baseline(gpu_info['name'], config.benchmark_type)
                if baseline:
                    self.results['baseline'] = baseline
            
            results = self.run_stress_benchmark(visualize=visualize)
            self.results.update(results)
            self.results['status'] = 'completed'
            
            # Save as baseline if completed
            if self.completed_full and 'name' in gpu_info:
                self.baseline_storage.save_baseline(gpu_info['name'], config.benchmark_type, self.results)
                self.results['saved_as_baseline'] = True
            
        except KeyboardInterrupt:
            self.results['status'] = 'interrupted'
            self.results['error'] = 'Benchmark interrupted by user'
            self.stop_reason = 'User interrupted'
        except Exception as e:
            self.results['status'] = 'failed'
            self.results['error'] = str(e)
        finally:
            # Stop background metrics thread
            self.metrics_sampler.stop()
            
            # Ensure cleanup happens
            if self.stress_worker:
                try:
                    self.stress_worker.cleanup()
                except Exception:
                    pass
            self.running = False
            self.progress = 100
        
        return self.results
    
    def start(self, config: BenchmarkConfig, visualize: bool = False) -> None:
        """Start benchmark (alias for run() for backward compatibility)."""
        self.run(config, visualize)


# Global instance
_benchmark: Optional[GPUBenchmark] = None

def get_benchmark_instance() -> GPUBenchmark:
    """Get or create global benchmark instance."""
    global _benchmark
    if _benchmark is None:
        _benchmark = GPUBenchmark()
    return _benchmark
