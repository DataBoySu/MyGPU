"""Backend stress multiplier for GPU workloads."""

from . import gpu_setup


class BackendStressManager:
    """Manages backend (offscreen) particle arrays for GPU stress testing."""
    
    def __init__(self):
        """Initialize backend stress manager."""
        self._backend_arrays = []
        self._backend_multiplier = 1
        self._method = None
        self._library = None  # cp or torch
    
    def initialize(self, method: str, library, particle_count: int, backend_multiplier: int):
        """
        Initialize backend arrays.
        
        Args:
            method: 'cupy' or 'torch'
            library: CuPy or PyTorch module
            particle_count: Number of particles per array
            backend_multiplier: Multiplier for stress (1 = no backend, 10 = 10x particles)
        """
        self._method = method
        self._library = library
        self._backend_multiplier = backend_multiplier
        self._backend_arrays = []
        
        if backend_multiplier > 1:
            for i in range(backend_multiplier - 1):  # -1 because main arrays count as 1x
                if method == 'cupy':
                    backend_gpu, _ = gpu_setup.setup_cupy_arrays(particle_count, library)
                elif method == 'torch':
                    backend_gpu, _ = gpu_setup.setup_torch_arrays(particle_count, library)
                else:
                    continue
                self._backend_arrays.append(backend_gpu)
            
            total_particles = backend_multiplier * particle_count
            print(f"[Backend Stress] Initialized {backend_multiplier}x multiplier ({total_particles:,} total particles on GPU)")
    
    def update_multiplier(self, new_multiplier: int, particle_count: int):
        """
        Update backend multiplier by recreating arrays.
        
        Args:
            new_multiplier: New multiplier value (1-100)
            particle_count: Number of particles per array
        """
        if new_multiplier < 1:
            new_multiplier = 1
        if new_multiplier > 100:
            new_multiplier = 100
        
        old_multiplier = self._backend_multiplier
        self._backend_multiplier = new_multiplier
        
        # Clear old arrays
        self._backend_arrays = []
        
        # Create new arrays
        if new_multiplier > 1 and self._method and self._library:
            for i in range(new_multiplier - 1):
                if self._method == 'cupy':
                    backend_gpu, _ = gpu_setup.setup_cupy_arrays(particle_count, self._library)
                elif self._method == 'torch':
                    backend_gpu, _ = gpu_setup.setup_torch_arrays(particle_count, self._library)
                else:
                    continue
                self._backend_arrays.append(backend_gpu)
            
            total_particles = new_multiplier * particle_count
            print(f"[Backend Stress] Updated multiplier: {old_multiplier}x → {new_multiplier}x ({total_particles:,} total particles)")
    
    def run_physics(self, physics_module, params, library):
        """
        Run physics on all backend arrays.
        
        Args:
            physics_module: physics_cupy or physics_torch module
            params: Dictionary with physics parameters
            library: CuPy or PyTorch module
        """
        if not self._backend_arrays:
            return
        
        for backend_gpu in self._backend_arrays:
            if self._method == 'cupy':
                physics_module.run_particle_physics_cupy(backend_gpu, params, library)
            elif self._method == 'torch':
                physics_module.run_particle_physics_torch(backend_gpu, params, library)
    
    def get_multiplier(self) -> int:
        """Get current backend multiplier value."""
        return self._backend_multiplier
    
    def get_array_count(self) -> int:
        """Get number of backend arrays."""
        return len(self._backend_arrays)
