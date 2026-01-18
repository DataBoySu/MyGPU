// benchmark.js - Benchmark UI helper functions
// Primarily handles preview updates and mode descriptions.

function updateWorkloadPreview() {
    const type = selectedBenchType;
    const mode = selectedMode;
    const desc = document.getElementById('mode-description');
    const typeDesc = document.getElementById('type-description');
    const info = document.getElementById('workload-info');

    if (type === 'gemm') {
        typeDesc.textContent = 'Dense matrix multiplication for maximum GPU compute stress. Measures TFLOPS.';
        if (mode === 'quick') {
            desc.textContent = 'Quick baseline test - 15 seconds with fixed workload size (4096).';
            info.textContent = 'Workload: Matrix Multi (4096 x 4096, FP32)';
        } else if (mode === 'standard') {
            desc.textContent = 'Standard validation - 60 seconds. Recommended for stability checks.';
            info.textContent = 'Workload: Matrix Multi (4096 x 4096, FP32)';
        } else if (mode === 'extended') {
            desc.textContent = 'Extended stress - 3 minutes. Validates thermal throttling behavior.';
            info.textContent = 'Workload: Matrix Multi (4096 x 4096, FP32)';
        } else if (mode === 'stress-test') {
            desc.textContent = 'Maximum stress - 60 seconds. Power limit testing with async bursts.';
            info.textContent = 'Workload: Multi-burst GEMM (256 - 8192 mix)';
        } else {
            desc.textContent = 'Custom parameters manually configured below.';
            info.textContent = 'Workload: Custom Matrix Multiply';
        }
    } else if (type === 'particle') {
        typeDesc.textContent = 'N-Body particle attractor simulation. Stresses both compute and memory latency.';
        if (mode === 'quick') {
            desc.textContent = 'Quick simulation - 15 seconds, 50k particles.';
            info.textContent = 'Workload: Particle Simulation (50,000 particles)';
        } else if (mode === 'standard') {
            desc.textContent = 'Standard simulation - 60 seconds, 100k particles.';
            info.textContent = 'Workload: Particle Simulation (100,000 particles)';
        } else if (mode === 'extended') {
            desc.textContent = 'Long simulation - 3 minutes. High particle count (100k).';
            info.textContent = 'Workload: Particle Simulation (100,000 particles)';
        } else if (mode === 'stress-test') {
            desc.textContent = 'System stress - Heavy memory pressure with 200k particles + high backend load.';
            info.textContent = 'Workload: Stress Simulation (200,000 particles)';
        } else {
            desc.textContent = 'Custom parameters manually configured below.';
            info.textContent = 'Workload: Custom Particle Simulation';
        }
    }
}
