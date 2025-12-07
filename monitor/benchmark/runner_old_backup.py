"""GPU benchmark orchestration and metrics collection."""

import time
import subprocess
from typing import Dict, Any, List, Optional
from datetime import datetime

from .config import BenchmarkConfig
from .storage import BaselineStorage
from .workloads import GPUStressWorker


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
        # GPU utilization smoothing buffer (keep last 5 samples)
        self.gpu_util_buffer: List[float] = []
        self.gpu_util_buffer_size = 5
        # Track consecutive nvidia-smi errors
        self.nvidia_smi_error_count = 0
        self.max_consecutive_errors = 5
        
    def get_gpu_info(self) -> Dict[str, Any]:
        """Get GPU information via nvidia-smi."""
        try:
            result = subprocess.run(
                ['nvidia-smi', '--query-gpu=name,memory.total,driver_version,pcie.link.gen.current,pcie.link.width.current',
                 '--format=csv,noheader,nounits'],
                capture_output=True, text=True, timeout=10
            )
            
            if result.returncode != 0:
                return {'error': 'nvidia-smi failed'}
            
            parts = [p.strip() for p in result.stdout.strip().split(',')]
            return {
                'name': parts[0],
                'memory_total_mb': float(parts[1]),
                'driver_version': parts[2],
                'pcie_gen': parts[3],
                'pcie_width': parts[4],
            }
        except Exception as e:
            return {'error': str(e)}
    
    def sample_metrics(self) -> Dict[str, Any]:
        """Collect a single sample of GPU metrics via nvidia-smi."""
        try:
            # Force no caching with explicit query and add process info
            result = subprocess.run(
                ['nvidia-smi', '--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw',
                 '--format=csv,noheader,nounits', '--loop-ms=0'],
                capture_output=True, text=True, timeout=5
            )
            
            if result.returncode != 0:
                self.nvidia_smi_error_count += 1
                return {'error': 'nvidia-smi failed', 'timestamp': time.time()}
            
            parts = [p.strip() for p in result.stdout.strip().split(',')]
            
            util_val = float(parts[0]) if parts[0] != '[N/A]' else 0
            
            # Reset error counter on success
            self.nvidia_smi_error_count = 0
            
            return {
                'timestamp': time.time(),
                'utilization': util_val,
                'memory_used_mb': float(parts[1]) if parts[1] != '[N/A]' else 0,
                'memory_total_mb': float(parts[2]) if parts[2] != '[N/A]' else 0,
                'temperature_c': float(parts[3]) if parts[3] != '[N/A]' else 0,
                'power_w': float(parts[4]) if parts[4] != '[N/A]' else 0,
            }
        except Exception as e:
            self.nvidia_smi_error_count += 1
            return {'error': str(e), 'timestamp': time.time()}
    
    def check_stop_conditions(self, sample: Dict[str, Any]) -> Optional[str]:
        """Check if any stop condition is met."""
        if self.should_stop:
            return "User stopped"
        
        # Don't stop on nvidia-smi errors - just continue with degraded monitoring
        # The simulation can run without nvidia-smi metrics
        
        if self.config.temp_limit_c > 0 and sample.get('temperature_c', 0) >= self.config.temp_limit_c:
            return f"Temperature limit reached ({sample['temperature_c']}C >= {self.config.temp_limit_c}C)"
        
        if self.config.power_limit_w > 0 and sample.get('power_w', 0) >= self.config.power_limit_w:
            return f"Power limit reached ({sample['power_w']}W >= {self.config.power_limit_w}W)"
        
        if self.config.memory_limit_mb > 0 and sample.get('memory_used_mb', 0) >= self.config.memory_limit_mb:
            return f"Memory limit reached ({sample['memory_used_mb']}MB >= {self.config.memory_limit_mb}MB)"
        
        return None
    
    def run_stress_benchmark(self, visualize: bool = False) -> Dict[str, Any]:
        """Run the stress benchmark with real GPU workload.
        
        Args:
            visualize: If True, show particle visualization window (particles only)
        """
        self.current_phase = "Running GPU Stress Test"
        self.samples = []
        self.iteration_times = []
        self.stress_worker.reset()
        self.start_time = time.time()
        self.completed_full = False
        
        # Initialize visualizer if requested
        visualizer = None
        if visualize and self.config.benchmark_type == "particle":
            try:
                from .visualizer import create_visualizer
                visualizer = create_visualizer(enabled=True)
                if visualizer:
                    print("[Visualizer] Particle visualization enabled")
                else:
                    print("[Visualizer] Could not initialize (pygame missing?)")
            except Exception as e:
                print(f"[Visualizer] Failed to initialize: {e}")

        
        sample_interval = self.config.sample_interval_ms / 1000.0
        last_sample_time = 0
        last_scale_check = 0
        scale_interval = 2.0
        scale_count = 0
        max_scales = 15
        
        # Decoupling visualization from simulation
        last_render_update_time = 0
        render_interval = 1 / 60.0  # Target 60 FPS for visualization
        render_fps = 0
        last_render_time = time.time()
        
        while True:
            elapsed = time.time() - self.start_time
            
            # Check duration
            if elapsed >= self.config.duration_seconds:
                self.stop_reason = "Duration completed"
                self.completed_full = True
                break
            
            # Run one iteration of stress work
            iter_time = self.stress_worker.run_iteration()
            self.iteration_times.append(iter_time)
            
            # Sample GPU metrics independently every 200ms for responsive display (reduced from 100ms)
            if elapsed - last_sample_time >= 0.2:  # 200ms = 5Hz sampling (less aggressive on nvidia-smi)
                sample = self.sample_metrics()
                
                # If nvidia-smi is failing, use dummy values and warn user once
                if 'error' in sample:
                    if self.nvidia_smi_error_count == 1:  # Only print warning on first error
                        print(f"[WARNING] nvidia-smi monitoring issues - GPU metrics may be inaccurate")
                    # Use last known good values or defaults
                    if self.gpu_util_buffer:
                        current_util = self.gpu_util_buffer[-1]
                    else:
                        current_util = 0
                    mem_used = 0
                    mem_total = 1
                else:
                    current_util = sample.get('utilization', 0)
                    mem_used = sample.get('memory_used_mb', 0)
                    mem_total = sample.get('memory_total_mb', 1)
                
                # Add to smoothing buffer
                self.gpu_util_buffer.append(current_util)
                if len(self.gpu_util_buffer) > self.gpu_util_buffer_size:
                    self.gpu_util_buffer.pop(0)
                
                # Add to samples for final report
                if elapsed - last_sample_time >= sample_interval:
                    sample['elapsed_sec'] = round(elapsed, 2)
                    sample['iterations'] = self.stress_worker.iterations
                    sample['last_iter_ms'] = round(iter_time, 2)
                    self.samples.append(sample)
                    last_sample_time = elapsed
            
            # Only render a frame periodically to avoid bottlenecking the GPU
            if visualizer and visualizer.running and (elapsed - last_render_update_time >= render_interval):
                last_render_update_time = elapsed

                # --- Start of Visualization Block ---
                # This block now runs much less frequently than the simulation loop
                
                # Update physics parameters from UI sliders
                slider_values = visualizer.get_slider_values()
                self.stress_worker.update_physics_params(
                    gravity_strength=slider_values['gravity'],
                    small_ball_speed=slider_values['small_ball_speed'],
                    initial_balls=int(slider_values['initial_balls']),
                    max_balls_cap=int(slider_values['max_balls_cap']),
                    backend_multiplier=int(slider_values.get('backend_multiplier', 1))
                )
                
                # Update split toggle state from UI
                self.stress_worker.update_split_enabled(visualizer.get_split_enabled())
                
                # Process big ball spawn requests from mouse clicks
                spawn_requests = visualizer.get_spawn_requests()
                for sim_x, sim_y, count in spawn_requests:
                    self.stress_worker.spawn_big_balls(sim_x, sim_y, count)
                
                # This is the expensive call, now done less often
                positions, masses, colors, glows = self.stress_worker.get_particle_sample(max_samples=2000)
                
                if positions is not None:
                    influence_boundaries = self.stress_worker.get_influence_boundaries(
                        gravity_strength=slider_values['gravity'] # Use current slider value
                    )
                    active_particles = int(self.stress_worker._active_count)
                    
                    # Use cached GPU metrics from independent sampling
                    gpu_util = sum(self.gpu_util_buffer) / len(self.gpu_util_buffer) if self.gpu_util_buffer else 0
                    
                    # Get latest memory usage
                    latest_sample = self.samples[-1] if self.samples else {}
                    mem_used = latest_sample.get('memory_used_mb', 0)
                    mem_total = latest_sample.get('memory_total_mb', 1)
                    gpu_mem_percent = (mem_used / mem_total * 100) if mem_total > 0 else 0

                    visualizer.render_frame(
                        positions=positions,
                        masses=masses,
                        colors=colors,
                        glows=glows,
                        influence_boundaries=influence_boundaries,
                        total_particles=self.stress_worker._initial_particle_count, # Use the actual count from worker
                        active_particles=active_particles,
                        fps=render_fps,
                        gpu_util=gpu_util,
                        gpu_mem_percent=gpu_mem_percent,
                        elapsed_time=elapsed
                    )

            # Calculate render FPS based on actual render calls
            now = time.time()
            render_fps = 1.0 / (now - last_render_time) if (now - last_render_time) > 0 else 0
            last_render_time = now
                
            # Auto-scaling check
            if self.config.auto_scale and elapsed - last_scale_check >= scale_interval:
                current_sample = self.samples[-1] if self.samples else {}
                gpu_util_check = current_sample.get('utilization', 0)
                
                if scale_count < max_scales:
                    if gpu_util_check < 70:
                        scale_factor = 2.0
                        print(f"[Auto-Scale] GPU util {gpu_util_check}% << target, scaling 2.0x...")
                        self.stress_worker.scale_workload(scale_factor)
                        scale_count += 1
                        self.current_phase = f"Auto-Scaling: {self.stress_worker.workload_type}"
                    elif gpu_util_check < 85:
                        scale_factor = 1.5
                        print(f"[Auto-Scale] GPU util {gpu_util_check}% < target, scaling 1.5x...")
                        self.stress_worker.scale_workload(scale_factor)
                        scale_count += 1
                        self.current_phase = f"Auto-Scaling: {self.stress_worker.workload_type}"
                    elif gpu_util_check < 93:
                        scale_factor = 1.2
                        print(f"[Auto-Scale] GPU util {gpu_util_check}% near target, scaling 1.2x...")
                        self.stress_worker.scale_workload(scale_factor)
                        scale_count += 1
                        self.current_phase = f"Auto-Scaling: {self.stress_worker.workload_type}"
                    else:
                        print(f"[Auto-Scale] GPU util {gpu_util_check}% - target reached!")
                else:
                    if gpu_util_check < 93:
                        print(f"[Auto-Scale] Max scales reached ({max_scales}), GPU util at {gpu_util_check}%")
                
                last_scale_check = elapsed
            
            # Check stop conditions (use latest sample if available)
            if self.samples:
                latest_sample = self.samples[-1]
                stop = self.check_stop_conditions(latest_sample)
                if stop:
                    self.stop_reason = stop
                    break
            
            # Check if user closed the visualization window
            if visualizer and not visualizer.running:
                self.stop_reason = "Visualization closed"
                break

            
            # Update progress
            self.progress = int((elapsed / self.config.duration_seconds) * 100)
        
        # Cleanup visualizer
        if visualizer:
            visualizer.close()
        
        return self._calculate_results()
    
    def _calculate_results(self) -> Dict[str, Any]:
        """Calculate benchmark results from samples."""
        # Always calculate elapsed time first
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
        elapsed_sec = time.time() - self.start_time
        
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
            'overall': (stability_score + thermal_score + perf_score) // 3
        }
        
        return results
    
    def start(self, config: BenchmarkConfig, visualize: bool = False) -> None:
        """Start benchmark with given configuration.
        
        Args:
            config: Benchmark configuration
            visualize: If True, show particle visualization (particles only)
        """
        self.config = config
        self.running = True
        self.should_stop = False
        self.stop_reason = None
        self.progress = 0
        self.samples = []
        self.completed_full = False
        
        # Initialize stress worker with benchmark type from config
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
            
            # Get baseline for comparison (benchmark-type specific)
            if 'name' in gpu_info:
                baseline = self.baseline_storage.get_baseline(gpu_info['name'], config.benchmark_type)
                if baseline:
                    self.results['baseline'] = baseline
            
            results = self.run_stress_benchmark(visualize=visualize)
            self.results.update(results)
            self.results['status'] = 'completed'
            
            # Save as baseline only if completed fully
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
            # Ensure cleanup happens
            if self.stress_worker:
                try:
                    self.stress_worker.cleanup()
                except Exception:
                    pass
            self.running = False
            self.progress = 100
    
    def stop(self) -> None:
        """Stop the benchmark."""
        self.should_stop = True
    
    def get_status(self) -> Dict[str, Any]:
        """Get current benchmark status."""
        return {
            'running': self.running,
            'progress': self.progress,
            'phase': self.current_phase,
            'samples_count': len(self.samples),
            'iterations': self.stress_worker.iterations if self.stress_worker else 0,
            'workload_type': self.stress_worker.workload_type if self.stress_worker else 'N/A',
            'latest_sample': self.samples[-1] if self.samples else None,
        }
    
    def get_samples(self) -> List[Dict[str, Any]]:
        """Get all collected samples for real-time graphing."""
        return self.samples.copy()
    
    def get_results(self) -> Dict[str, Any]:
        """Get benchmark results."""
        return self.results
    
    def get_baseline(self, benchmark_type: str = "gemm") -> Optional[Dict[str, Any]]:
        """Get stored baseline for current GPU and benchmark type."""
        gpu_info = self.get_gpu_info()
        if 'name' in gpu_info:
            return self.baseline_storage.get_baseline(gpu_info['name'], benchmark_type)
        return None


# Global instance
_benchmark: Optional[GPUBenchmark] = None

def get_benchmark_instance() -> GPUBenchmark:
    """Get or create global benchmark instance."""
    global _benchmark
    if _benchmark is None:
        _benchmark = GPUBenchmark()
    return _benchmark
