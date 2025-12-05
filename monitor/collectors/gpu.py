"""GPU metrics collector using NVML or nvidia-smi."""

import subprocess
import re
from typing import List, Dict, Any

try:
    import pynvml
    PYNVML_AVAILABLE = True
except ImportError:
    PYNVML_AVAILABLE = False


class GPUCollector:
    """Collects GPU metrics via NVML or nvidia-smi fallback."""
    
    def __init__(self):
        self.nvml_initialized = False
        if PYNVML_AVAILABLE:
            try:
                pynvml.nvmlInit()
                self.nvml_initialized = True
            except Exception:
                pass
    
    def __del__(self):
        if self.nvml_initialized:
            try:
                pynvml.nvmlShutdown()
            except Exception:
                pass
    
    def collect(self) -> List[Dict[str, Any]]:
        if self.nvml_initialized:
            return self._collect_nvml()
        else:
            return self._collect_nvidia_smi()
    
    def _collect_nvml(self) -> List[Dict[str, Any]]:
        gpus = []
        device_count = pynvml.nvmlDeviceGetCount()
        
        for i in range(device_count):
            try:
                handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                
                # Memory
                mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
                
                # Utilization
                try:
                    util = pynvml.nvmlDeviceGetUtilizationRates(handle)
                    gpu_util = util.gpu
                except Exception:
                    gpu_util = 0
                
                # Temperature
                try:
                    temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
                except Exception:
                    temp = 0
                
                # Power
                try:
                    power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000  # mW to W
                except Exception:
                    power = 0
                
                # Processes
                try:
                    procs = pynvml.nvmlDeviceGetComputeRunningProcesses(handle)
                    num_procs = len(procs)
                except Exception:
                    num_procs = 0
                
                gpus.append({
                    'index': i,
                    'name': pynvml.nvmlDeviceGetName(handle),
                    'utilization': gpu_util,
                    'memory_used': mem.used / (1024**2),  # MB
                    'memory_total': mem.total / (1024**2),
                    'memory_free': mem.free / (1024**2),
                    'temperature': temp,
                    'power': power,
                    'processes': num_procs,
                })
                
            except Exception as e:
                gpus.append({'index': i, 'error': str(e)})
        
        return gpus
    
    def _collect_nvidia_smi(self) -> List[Dict[str, Any]]:
        try:
            result = subprocess.run(
                ['nvidia-smi', '--query-gpu=index,name,utilization.gpu,memory.used,memory.total,'
                 'temperature.gpu,power.draw',
                 '--format=csv,noheader,nounits'],
                capture_output=True, text=True, timeout=10
            )
            
            if result.returncode != 0:
                return [{'error': 'nvidia-smi failed'}]
            
            gpus = []
            for line in result.stdout.strip().split('\n'):
                if not line:
                    continue
                    
                parts = [p.strip() for p in line.split(',')]
                if len(parts) >= 7:
                    gpus.append({
                        'index': int(parts[0]),
                        'name': parts[1],
                        'utilization': int(parts[2]) if parts[2] != '[N/A]' else 0,
                        'memory_used': float(parts[3]) if parts[3] != '[N/A]' else 0,
                        'memory_total': float(parts[4]) if parts[4] != '[N/A]' else 0,
                        'temperature': int(parts[5]) if parts[5] != '[N/A]' else 0,
                        'power': float(parts[6]) if parts[6] != '[N/A]' else 0,
                    })
            
            return gpus
            
        except Exception as e:
            return [{'error': str(e)}]
