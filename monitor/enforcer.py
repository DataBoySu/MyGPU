"""GPU VRAM enforcer: allocate persistent device memory to reserve VRAM.

This module provides a best-effort, admin-only advisory enforcement mechanism by
allocating device-side buffers on a per-GPU basis. It attempts CuPy first, then
PyTorch. Allocations are kept referenced to remain resident; releasing deletes
references and triggers cache cleanup where supported.

Notes:
- This is advisory: it consumes memory on the GPU so other processes have less
  free memory available, but it does not change driver-reported total memory.
- Must be run with appropriate permissions. Allocation may fail if the GPU has
  insufficient free memory.
"""
from threading import Lock
from typing import Dict, Any

_lock = Lock()

class _NoBackendError(RuntimeError):
    pass

class Enforcer:
    def __init__(self):
        self._impl = None
        self._reserved: Dict[int, Any] = {}
        self._lock = Lock()
        self._detect_backend()

    def _detect_backend(self):
        # Prefer CuPy
        try:
            import cupy as cp
            self._impl = 'cupy'
            self._cupy = cp
            return
        except Exception:
            self._cupy = None
        # Fall back to PyTorch
        try:
            import torch
            if not torch.cuda.is_available():
                raise RuntimeError('torch cuda not available')
            self._impl = 'torch'
            self._torch = torch
            return
        except Exception:
            self._torch = None
        self._impl = None

    def backend_name(self):
        return self._impl

    def allocate_reserve(self, gpu_index: int, cap_mb: int) -> Dict[str, Any]:
        """Allocate `cap_mb` MB on GPU `gpu_index` and keep it resident.

        Returns a dict with status and info. Raises _NoBackendError if no backend.
        """
        with self._lock:
            if self._impl is None:
                raise _NoBackendError('No GPU backend (CuPy/PyTorch) available')

            # Convert MB to number of uint8 elements
            nbytes = int(cap_mb) * 1024 * 1024
            if nbytes <= 0:
                return {'status': 'error', 'error': 'invalid_size'}

            # If we already have a reserve on this GPU, release it first
            if gpu_index in self._reserved:
                self.release_reserve(gpu_index)

            try:
                if self._impl == 'cupy':
                    cp = self._cupy
                    with cp.cuda.Device(int(gpu_index)):
                        arr = cp.empty(nbytes, dtype=cp.uint8)
                        # touch memory to ensure allocation
                        arr[0] = 0
                        self._reserved[gpu_index] = arr
                        return {'status': 'ok', 'backend': 'cupy', 'gpu_index': gpu_index, 'reserved_mb': cap_mb}

                elif self._impl == 'torch':
                    torch = self._torch
                    device = torch.device(f'cuda:{int(gpu_index)}')
                    # create byte tensor
                    numel = nbytes
                    t = torch.empty(numel, dtype=torch.uint8, device=device)
                    t[0] = 0
                    self._reserved[gpu_index] = t
                    return {'status': 'ok', 'backend': 'torch', 'gpu_index': gpu_index, 'reserved_mb': cap_mb}

            except Exception as e:
                # allocation failed - cleanup if needed
                try:
                    if gpu_index in self._reserved:
                        del self._reserved[gpu_index]
                except Exception:
                    pass
                return {'status': 'error', 'error': str(e)}

    def release_reserve(self, gpu_index: int) -> Dict[str, Any]:
        with self._lock:
            if gpu_index not in self._reserved:
                return {'status': 'not_found'}
            try:
                # delete and request cache cleanup if backend supports it
                obj = self._reserved.pop(gpu_index, None)
                try:
                    if self._impl == 'cupy' and self._cupy is not None:
                        del obj
                        self._cupy.get_default_memory_pool().free_all_blocks()
                    elif self._impl == 'torch' and self._torch is not None:
                        del obj
                        self._torch.cuda.empty_cache()
                except Exception:
                    pass
                return {'status': 'ok', 'gpu_index': gpu_index}
            except Exception as e:
                return {'status': 'error', 'error': str(e)}

    def list_reserves(self) -> Dict[int, Any]:
        with self._lock:
            return {k: {'reserved_mb': None} for k in self._reserved.keys()}


# Module-level singleton
_enforcer = Enforcer()

def get_enforcer():
    return _enforcer
