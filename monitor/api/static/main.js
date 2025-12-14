let countdown = 5;
let historyChart = null;

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
        
        if (tab.dataset.tab === 'history') loadHistory();
        if (tab.dataset.tab === 'processes') loadProcesses();
        if (tab.dataset.tab === 'benchmark') { loadBenchmarkResults(); loadBaseline(); }
    });
});

async function loadBenchmarkResults() {
    try {
        const response = await fetch('/api/benchmark/results');
        const results = await response.json();
        if (results && results.status !== 'no_results') {
            displayBenchmarkResults(results);
        }
    } catch (error) {
        console.error('Error loading benchmark results:', error);
    }
}

async function fetchStatus() {
    try {
        console.log('Fetching status from /api/status...');
        const response = await fetch('/api/status');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching status:', error);
        document.getElementById('gpu-list').innerHTML = '<div class="gpu-card" style="color: #ef4444;">Error: Failed to fetch GPU data. Check console for details.</div>';
        document.getElementById('system-info').innerHTML = '<div style="color: #ef4444;">Error loading system info</div>';
    }
}

function updateDashboard(data) {
    console.log('Updating dashboard with:', data);
    const badge = document.getElementById('status-badge');
    badge.className = 'status-badge status-' + data.status;
    badge.textContent = data.status.toUpperCase();
    
    // Add tooltip with alert count
    const alertCount = data.alerts ? data.alerts.length : 0;
    if (data.status === 'warning' && alertCount > 0) {
        badge.setAttribute('data-tooltip', `${alertCount} active alert${alertCount > 1 ? 's' : ''}`);
    } else if (data.status === 'info') {
        badge.setAttribute('data-tooltip', 'System information available');
    } else {
        badge.setAttribute('data-tooltip', 'All systems operational');
    }
    
    const gpuList = document.getElementById('gpu-list');
    gpuList.innerHTML = data.metrics.gpus.map(gpu => {
        if (gpu.error) return `<div class="gpu-card">Error: ${gpu.error}</div>`;
        
        const util = gpu.utilization || 0;
        const memPct = gpu.memory_total > 0 ? (gpu.memory_used / gpu.memory_total * 100) : 0;
        const temp = gpu.temperature || 0;
        
        return `
            <div class="gpu-card">
                <div class="gpu-header">
                    <span class="gpu-name">GPU ${gpu.index}: ${gpu.name}</span>
                    <span class="gpu-temp ${temp > 80 ? 'hot' : ''}">${temp}C</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Utilization</span>
                    <span class="metric-value">${util}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${util > 90 ? 'crit' : util > 70 ? 'warn' : ''}" style="width: ${util}%"></div>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Memory</span>
                    <span class="metric-value">${(gpu.memory_used/1024).toFixed(1)}/${(gpu.memory_total/1024).toFixed(1)} GB</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${memPct > 90 ? 'crit' : memPct > 70 ? 'warn' : ''}" style="width: ${memPct}%"></div>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Power</span>
                    <span class="metric-value">${(gpu.power || 0).toFixed(0)}W</span>
                </div>
            </div>
        `;
    }).join('');
    
    const sys = data.metrics.system;
    document.getElementById('system-info').innerHTML = `
        <div class="metric-row"><span class="metric-label">Hostname</span><span class="metric-value">${sys.hostname || 'N/A'}</span></div>
        <div class="metric-row"><span class="metric-label">CPU</span><span class="metric-value">${(sys.cpu_percent || 0).toFixed(1)}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${sys.cpu_percent || 0}%"></div></div>
        <div class="metric-row"><span class="metric-label">Memory</span><span class="metric-value">${(sys.memory_used_gb || 0).toFixed(1)}/${(sys.memory_total_gb || 0).toFixed(1)} GB</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${sys.memory_percent || 0}%"></div></div>
        <div class="metric-row"><span class="metric-label">Disk</span><span class="metric-value">${(sys.disk_used_gb || 0).toFixed(1)}/${(sys.disk_total_gb || 0).toFixed(1)} GB</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${sys.disk_percent || 0}%"></div></div>
    `;
    
    const alertsList = document.getElementById('alerts-list');
    if (data.alerts && data.alerts.length > 0) {
        alertsList.innerHTML = data.alerts.map(a => `<div class="alert-item"><strong>${a.severity.toUpperCase()}</strong>: ${a.message}</div>`).join('');
    } else {
        alertsList.innerHTML = '<div style="color: var(--accent-green);">No active alerts</div>';
    }
    
    document.getElementById('last-update').textContent = 'Last update: ' + new Date().toLocaleTimeString();
}

async function loadHistory() {
    const metric = document.getElementById('metric-select').value;
    const hours = document.getElementById('hours-select').value;
    
    try {
        const historyResponse = await fetch(`/api/history?metric=${metric}&hours=${hours}`);
        const historyData = await historyResponse.json();
        
        const ctx = document.getElementById('historyChart').getContext('2d');
        
        if (historyChart) historyChart.destroy();

        const getUnit = (metric) => {
            if (metric.includes('utilization') || metric.includes('percent')) return '%';
            if (metric.includes('memory_used')) return 'MB';
            if (metric.includes('temperature')) return '°C';
            if (metric.includes('power')) return 'W';
            return '';
        }

        const unit = getUnit(metric);

        const yAxisOptions = {
            ticks: { color: '#a0a0a0' },
            grid: { color: '#4a4a4a' },
            beginAtZero: true,
            title: {
                display: true,
                text: unit,
                color: '#a0a0a0',
                font: {
                    size: 14,
                    weight: 'bold'
                }
            }
        };

        if (metric.includes('utilization') || metric.includes('percent')) {
            yAxisOptions.suggestedMax = 100;
        }
        if (metric.includes('temperature')) {
            yAxisOptions.suggestedMax = 100;
        }

        if (metric.startsWith('gpu_') && metric.includes('_memory_used')) {
            const statusResponse = await fetch('/api/status');
            const statusData = await statusResponse.json();
            const gpuIndex = parseInt(metric.split('_')[1]);
            const gpu = statusData.metrics.gpus[gpuIndex];
            if (gpu && gpu.memory_total) {
                yAxisOptions.max = gpu.memory_total;
            }
        }
        
        historyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: historyData.data.map(d => new Date(d.timestamp).toLocaleTimeString()),
                datasets: [{
                    label: document.getElementById('metric-select').selectedOptions[0].text,
                    data: historyData.data.map(d => d.value),
                    borderColor: '#76b900',
                    backgroundColor: 'rgba(118, 185, 0, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: { 
                    legend: { 
                        display: true,
                        labels: { 
                            color: '#f0f0f0',
                            font: {
                                size: 14
                            }
                        } 
                    } 
                },
                scales: {
                    x: { 
                        ticks: { color: '#a0a0a0', maxTicksLimit: 10 }, 
                        grid: { color: '#4a4a4a' } 
                    },
                    y: yAxisOptions
                }
            }
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

async function loadProcesses() {
    try {
        const response = await fetch('/api/processes');
        const data = await response.json();
        
        // Update VRAM bar if we have GPU memory stats
        if (data.gpu_memory && Object.keys(data.gpu_memory).length > 0) {
            const gpuKeys = Object.keys(data.gpu_memory);
            const gpu0 = data.gpu_memory[gpuKeys[0]];
            
            if (gpu0 && gpu0.total > 0) {
                const usedGB = (gpu0.used / 1024).toFixed(1);
                const totalGB = (gpu0.total / 1024).toFixed(1);
                const freeGB = (gpu0.free / 1024).toFixed(1);
                const usedPct = ((gpu0.total - gpu0.free) / gpu0.total) * 100;
                
                document.getElementById('vram-bar-container').style.display = 'block';
                document.getElementById('vram-used-bar').style.width = usedPct + '%';
                document.getElementById('vram-free').textContent = `${usedGB} / ${totalGB} GB (${freeGB} GB Free)`;
                
                // Change color based on usage - solid colors only
                const bar = document.getElementById('vram-used-bar');
                if (usedPct > 90) {
                    bar.style.background = 'var(--accent-red)';
                } else if (usedPct > 70) {
                    bar.style.background = 'var(--accent-yellow)';
                } else {
                    bar.style.background = 'var(--accent-green)';
                }
            }
        }
        
        const tbody = document.getElementById('process-list');
        if (!data.processes || data.processes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="color: var(--text-secondary);">No GPU processes running</td></tr>';
        } else {
            // Check if any process has utilization data
            const hasUtilData = data.processes.some(p => p.gpu_utilization !== null && p.gpu_utilization !== undefined);
            
            // Sort by GPU memory usage (descending)
            const sorted = data.processes.sort((a, b) => (b.gpu_memory_mb || 0) - (a.gpu_memory_mb || 0));
            
            tbody.innerHTML = sorted.map(p => {
                let utilDisplay;
                if (p.gpu_utilization !== null && p.gpu_utilization !== undefined) {
                    utilDisplay = `${p.gpu_utilization.toFixed(1)}%`;
                } else if (hasUtilData) {
                    // Some processes have data, this one doesn't
                    utilDisplay = '<span style="opacity: 0.5;">N/A</span>';
                } else {
                    // No processes have data - show helpful message on first row only
                    if (sorted.indexOf(p) === 0) {
                        utilDisplay = '<span style="opacity: 0.5;" title="Per-process GPU utilization requires:\n1. CUDA/compute workloads (not graphics)\n2. Accounting mode enabled\n3. Supported GPU hardware">Not available</span>';
                    } else {
                        utilDisplay = '<span style="opacity: 0.5;">—</span>';
                    }
                }
                
                return `
                    <tr>
                        <td>${p.pid}</td>
                        <td>${p.name || 'N/A'}</td>
                        <td>GPU ${p.gpu_index}</td>
                        <td>${utilDisplay}</td>
                        <td>${p.username || 'N/A'}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading processes:', error);
        document.getElementById('process-list').innerHTML = 
            '<tr><td colspan="5" style="color: var(--accent-red);">Error loading processes</td></tr>';
    }
}

function exportData(format) {
    const hours = document.getElementById('export-hours').value;
    window.location.href = `/api/export/${format}?hours=${hours}`;
}

// Benchmark functions
let benchmarkPollInterval = null;
let benchCharts = {};
let selectedMode = 'quick';
let selectedBenchType = 'gemm';

// Load baseline on page load
async function loadBaseline() {
    try {
        const response = await fetch('/api/benchmark/baseline?benchmark_type=' + selectedBenchType);
        const baseline = await response.json();
        if (baseline && baseline.status !== 'no_baseline') {
            document.getElementById('baseline-info').style.display = 'block';
            const benchTypeLabel = baseline.benchmark_type === 'gemm' ? 'GEMM' : 'Particle';
            document.getElementById('baseline-details').innerHTML = `
                <div class="metric-row"><span class="metric-label">GPU</span><span class="metric-value">${baseline.gpu_name}</span></div>
                <div class="metric-row"><span class="metric-label">Type</span><span class="metric-value">${benchTypeLabel}</span></div>
                <div class="metric-row"><span class="metric-label">Iterations</span><span class="metric-value">${baseline.iterations_completed}</span></div>
                <div class="metric-row"><span class="metric-label">Avg Iteration</span><span class="metric-value">${baseline.avg_iteration_time_ms.toFixed(2)} ms</span></div>
                <div class="metric-row"><span class="metric-label">Avg Temp</span><span class="metric-value">${baseline.avg_temperature.toFixed(1)} C</span></div>
                <p style="font-size: 0.85em; color: var(--text-secondary); margin-top: 10px;">Saved: ${new Date(baseline.timestamp).toLocaleString()}</p>
            `;
        } else {
            document.getElementById('baseline-info').style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading baseline:', error);
    }
}

function selectBenchType(type) {
    selectedBenchType = type;
    // Reload baseline when benchmark type changes
    loadBaseline();
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    // Update description
    const descriptions = {
        'gemm': 'Dense matrix multiplication for maximum GPU compute stress. Measures TFLOPS.',
        'particle': '2D particle physics simulation with millions of particles. Measures steps/second.'
    };
    document.getElementById('type-description').textContent = descriptions[type] || '';
    
    // Show/hide type-specific settings in custom mode
    document.getElementById('gemm-settings').style.display = type === 'gemm' ? 'block' : 'none';
    document.getElementById('particle-settings').style.display = type === 'particle' ? 'block' : 'none';
    
    // Simulation button is always enabled
}

function selectMode(mode) {
    selectedMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    document.getElementById('custom-controls').style.display = mode === 'custom' ? 'block' : 'none';
    
    // Update mode description
    const descriptions = {
        'quick': 'Quick baseline test - 15 seconds with fixed workload size',
        'standard': 'Standard benchmark - 60 seconds with fixed workload size',
        'extended': 'Extended burn-in test - 180 seconds with fixed workload size for thorough validation',
        'stress-test': 'Stress test - 60 seconds with AUTO-SCALING workload that dynamically increases to push GPU to 98% utilization',
        'custom': 'Custom configuration - set your own duration, limits, and workload parameters'
    };
    document.getElementById('mode-description').textContent = descriptions[mode] || '';
}

function updateSliderValue(type) {
    const slider = document.getElementById('custom-' + type);
    const input = document.getElementById('custom-' + type + '-val');
    input.value = slider.value;
}

// Sync input to slider
['duration', 'temp', 'memory', 'power', 'matrix', 'particles'].forEach(type => {
    const input = document.getElementById('custom-' + type + '-val');
    if (input) {
        input.addEventListener('change', () => {
            document.getElementById('custom-' + type).value = input.value;
        });
    }
});

async function startBenchmark() {
    const btn = document.getElementById('start-bench-btn');
    const stopBtn = document.getElementById('stop-bench-btn');
    btn.disabled = true;
    btn.textContent = 'Running...';
    stopBtn.style.display = 'inline-block';
    
    document.getElementById('benchmark-progress').style.display = 'block';
    document.getElementById('benchmark-live-charts').style.display = 'block';
    document.getElementById('benchmark-results').innerHTML = '';
    document.getElementById('bench-stop-reason').textContent = '';
    document.getElementById('iteration-counter').style.display = 'inline';
    document.getElementById('iteration-counter').textContent = 'Iteration #0';
    
    // Build URL with params
    let url = '/api/benchmark/start?benchmark_type=' + selectedBenchType;
    
    // Handle different modes
    if (selectedMode === 'quick') {
        url += '&mode=fixed&duration=15&auto_scale=false';
    } else if (selectedMode === 'standard') {
        url += '&mode=fixed&duration=60&auto_scale=false';
    } else if (selectedMode === 'stress-test') {
        url += '&mode=stress&duration=60&auto_scale=true';
    } else if (selectedMode === 'extended') {
        url += '&mode=fixed&duration=180&auto_scale=false';
    } else if (selectedMode === 'custom') {
        url += '&mode=custom&auto_scale=false';
        url += '&duration=' + document.getElementById('custom-duration-val').value;
        url += '&temp_limit=' + document.getElementById('custom-temp-val').value;
        url += '&memory_limit=' + document.getElementById('custom-memory-val').value;
        url += '&power_limit=' + document.getElementById('custom-power-val').value;
        if (selectedBenchType === 'gemm') {
            url += '&matrix_size=' + document.getElementById('custom-matrix-val').value;
        } else if (selectedBenchType === 'particle') {
            const particles = Math.round(parseFloat(document.getElementById('custom-particles-val').value) * 1000000);
            url += '&num_particles=' + particles;
        }
    }
    
    // Initialize live charts
    initLiveCharts();
    
    try {
        await fetch(url, { method: 'POST' });
        benchmarkPollInterval = setInterval(pollBenchmarkStatus, 500);
    } catch (error) {
        console.error('Error starting benchmark:', error);
        btn.disabled = false;
        btn.textContent = 'Start Benchmark';
        stopBtn.style.display = 'none';
    }
}

async function stopBenchmark() {
    try {
        await fetch('/api/benchmark/stop', { method: 'POST' });
    } catch (error) {
        console.error('Error stopping benchmark:', error);
    }
}

async function startSimulation() {
    console.log('Start Simulation clicked');
    console.log('Current benchmark type:', selectedBenchType);
    console.log('Current mode:', selectedMode);
    
    // Check current benchmark type
    const currentType = selectedBenchType;
    let modeToUse;
    
    // If not on particle type, switch to it and use 'quick' mode
    if (currentType !== 'particle') {
        selectBenchType('particle');
        modeToUse = 'quick';
        selectMode('quick');
    } else {
        // Use the currently selected mode
        modeToUse = selectedMode;
    }
    
    const btn = document.getElementById('start-sim-btn');
    const stopBtn = document.getElementById('stop-bench-btn');
    btn.disabled = true;
    btn.textContent = 'Opening Simulation...';
    stopBtn.style.display = 'inline-block';
    
    document.getElementById('benchmark-progress').style.display = 'block';
    document.getElementById('benchmark-live-charts').style.display = 'block';
    document.getElementById('benchmark-results').innerHTML = '';
    document.getElementById('bench-stop-reason').textContent = '';
    document.getElementById('iteration-counter').style.display = 'inline';
    document.getElementById('iteration-counter').textContent = 'Iteration #0';
    
    // Get duration and particles based on selected mode
    let duration = 60;
    let particles = 100000;
    
    if (modeToUse === 'quick') {
        duration = 15;
        particles = 50000;
    } else if (modeToUse === 'standard') {
        duration = 60;
        particles = 100000;
    } else if (modeToUse === 'extended') {
        duration = 180;
        particles = 100000;
    } else if (modeToUse === 'stress-test') {
        duration = 60;
        particles = 200000;
    } else if (modeToUse === 'custom') {
        duration = parseInt(document.getElementById('custom-duration-val').value);
        particles = Math.round(parseFloat(document.getElementById('custom-particles-val').value) * 1000000);
    }
    
    // Build URL with params
    let url = `/api/benchmark/start?benchmark_type=particle&visualize=true&duration=${duration}&num_particles=${particles}`;
    
    // Initialize live charts
    initLiveCharts();
    
    try {
        await fetch(url, { method: 'POST' });
        btn.textContent = 'Simulation Running';
        benchmarkPollInterval = setInterval(pollBenchmarkStatus, 500);
    } catch (error) {
        console.error('Error starting simulation:', error);
        btn.disabled = false;
        btn.textContent = 'Start Simulation';
        stopBtn.style.display = 'none';
    }
}

function createSmallChart(canvasId, color, maxY = null) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ data: [], borderColor: color, backgroundColor: color + '20', fill: true, tension: 0.3, pointRadius: 0 }] },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { min: 0, max: maxY, ticks: { color: '#a0a0a0' }, grid: { color: '#4a4a4a' } }
            }
        }
    });
}

function initLiveCharts() {
    Object.values(benchCharts).forEach(c => c.destroy());
    benchCharts = {
        utilization: createSmallChart('chartUtilization', '#76b900', 100),
        temperature: createSmallChart('chartTemperature', '#ffc107', 100),
        memory: createSmallChart('chartMemory', '#00a0ff'),
        power: createSmallChart('chartPower', '#dc3545')
    };
}

async function pollBenchmarkStatus() {
    try {
        const [statusRes, samplesRes] = await Promise.all([
            fetch('/api/benchmark/status'),
            fetch('/api/benchmark/samples')
        ]);
        const status = await statusRes.json();
        const samplesData = await samplesRes.json();
        
        document.getElementById('bench-progress-bar').style.width = status.progress + '%';
        document.getElementById('bench-percent').textContent = status.progress + '%';
        document.getElementById('iteration-counter').textContent = 'Iteration #' + (status.iterations || 0);
        document.getElementById('workload-info').textContent = 'Workload: ' + (status.workload_type || 'N/A');
        document.getElementById('bench-workload').textContent = status.workload_type || '';
        
        // Update live charts with samples
        if (samplesData.samples && benchCharts.utilization) {
            const samples = samplesData.samples;
            const labels = samples.map(s => s.elapsed_sec + 's');
            
            benchCharts.utilization.data.labels = labels;
            benchCharts.utilization.data.datasets[0].data = samples.map(s => s.utilization || 0);
            benchCharts.utilization.update('none');
            
            benchCharts.temperature.data.labels = labels;
            benchCharts.temperature.data.datasets[0].data = samples.map(s => s.temperature_c || 0);
            benchCharts.temperature.update('none');
            
            benchCharts.memory.data.labels = labels;
            benchCharts.memory.data.datasets[0].data = samples.map(s => s.memory_used_mb || 0);
            benchCharts.memory.update('none');
            
            benchCharts.power.data.labels = labels;
            benchCharts.power.data.datasets[0].data = samples.map(s => s.power_w || 0);
            benchCharts.power.update('none');
        }
        
        if (!status.running) {
            clearInterval(benchmarkPollInterval);
            document.getElementById('start-bench-btn').disabled = false;
            document.getElementById('start-bench-btn').textContent = 'Start Benchmark';
            document.getElementById('stop-bench-btn').style.display = 'none';
                // Prefer the fancy renderer if available to maintain consistent styling
                if (typeof window !== 'undefined' && typeof window.renderFancyBenchmarkResults === 'function') {
                    try { window.renderFancyBenchmarkResults(results); return; } catch (e) { console.debug('renderFancyBenchmarkResults failed', e); }
                }

                // Fallback to previous plain rendering if fancy renderer isn't available
                if (!results || results.status === 'no_results') {
                    document.getElementById('benchmark-results').innerHTML = '<p style="color: var(--text-secondary);">No results available</p>';
                    return;
                }

                // Minimal fallback: show key metrics in structured blocks
                const r = results;
                const html = `
                    <div class="gpu-card"><h3 style="color: var(--accent-green);">Benchmark Results</h3>
                        <div class="metric-row"><span class="metric-label">Average TFLOPS</span><span class="metric-value">${(r.avg_tflops || r.performance && r.performance.tflops || 0).toFixed(2)}</span></div>
                        <div class="metric-row"><span class="metric-label">Peak TFLOPS</span><span class="metric-value">${(r.peak_tflops || r.performance && r.performance.peak_tflops || 0).toFixed(2)}</span></div>
                        <div class="metric-row"><span class="metric-label">Avg Temperature</span><span class="metric-value">${(r.avg_temperature || 0).toFixed(1)}°C</span></div>
                        <div class="metric-row"><span class="metric-label">Avg GPU Utilization</span><span class="metric-value">${(r.avg_gpu_utilization || 0).toFixed(1)}%</span></div>
                        <div class="metric-row"><span class="metric-label">Avg Memory Usage</span><span class="metric-value">${(r.avg_memory_usage || 0).toFixed(1)}%</span></div>
                        <div class="metric-row"><span class="metric-label">Avg Power Draw</span><span class="metric-value">${(r.avg_power_draw || 0).toFixed(1)}W</span></div>
                        <div class="metric-row"><span class="metric-label">Duration</span><span class="metric-value">${(r.duration || 0).toFixed(1)}s</span></div>
                        <div class="metric-row"><span class="metric-label">Iterations</span><span class="metric-value">${r.total_iterations || r.iterations_completed || 0}</span></div>
                    </div>
                `;
                document.getElementById('benchmark-results').innerHTML = html;
                <div class="gpu-card" style="margin-bottom: 10px;">
                    <div class="gpu-header">
                        <span class="gpu-name">${m.label}</span>
                    </div>
                    <div class="metric-row"><span class="metric-label">Min</span><span class="metric-value">${data.min} ${m.unit}</span></div>
                    <div class="metric-row"><span class="metric-label">Avg</span><span class="metric-value">${data.avg} ${m.unit}</span></div>
                    <div class="metric-row"><span class="metric-label">Max</span><span class="metric-value">${data.max} ${m.unit}</span></div>
                </div>
            `;
        }
    });
    
    html += `<p style="color: var(--text-secondary); margin-top: 15px; font-size: 0.9em;">Benchmark completed at ${new Date(results.timestamp).toLocaleString()}</p>`;
    
    document.getElementById('benchmark-results').innerHTML = html;
}

async function checkForUpdates() {
    const btn = document.getElementById('update-btn');
    btn.disabled = true;
    btn.textContent = 'Checking...';
    btn.removeAttribute('data-tooltip');
    const GITHUB_REPO = 'DataBoySu/cluster-monitor';

    function parseVersion(text) {
        if (!text) return '0.0.0';
        const m = /v?(\d+\.\d+\.\d+)/.exec(text);
        return m ? m[1] : text.trim();
    }

    function compareVer(a, b) {
        const pa = a.split('.').map(n => parseInt(n)||0);
        const pb = b.split('.').map(n => parseInt(n)||0);
        for (let i=0;i<3;i++){
            if ((pa[i]||0) > (pb[i]||0)) return 1;
            if ((pa[i]||0) < (pb[i]||0)) return -1;
        }
        return 0;
    }

    try {
        // Read current version from footer (rendered server-side as {{VERSION}})
        let currentText = '';
        try { currentText = document.querySelector('footer').textContent || ''; } catch(e){}
        const currentVersion = parseVersion(currentText);

        const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
        const resp = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github.v3+json' } });
        if (!resp.ok) throw new Error('GitHub API error: ' + resp.status);
        const json = await resp.json();
        const latestTag = parseVersion(json.tag_name || json.name || '0.0.0');

        const cmp = compareVer(latestTag, currentVersion);
        if (cmp > 0) {
            btn.textContent = `Update: ${latestTag}`;
            btn.classList.remove('success', 'error');
            btn.disabled = false;
            btn.setAttribute('data-tooltip', `Current: ${currentVersion} → Latest: ${latestTag}`);

            btn.onclick = async () => {
                btn.textContent = 'Installing...';
                btn.disabled = true;
                try {
                    const install = await fetch('/api/update/install', { method: 'POST' });
                    const result = await install.json();
                    if (result.status === 'success') {
                        btn.textContent = 'Restart App';
                        btn.classList.add('success');
                        btn.setAttribute('data-tooltip', 'Update installed - restart application');
                    } else {
                        btn.textContent = 'Update Failed';
                        btn.classList.add('error');
                        btn.setAttribute('data-tooltip', result.message || 'Failed to install');
                        btn.disabled = false;
                    }
                } catch (e) {
                    btn.textContent = 'Install Error';
                    btn.classList.add('error');
                    btn.setAttribute('data-tooltip', e && e.message ? e.message : 'Install failed');
                    btn.disabled = false;
                }
            };
        } else {
            btn.textContent = 'Latest Version';
            btn.classList.add('success');
            btn.setAttribute('data-tooltip', `Version ${currentVersion}`);
            setTimeout(() => {
                btn.textContent = 'Check for Updates';
                btn.classList.remove('success');
                btn.disabled = false;
                btn.removeAttribute('data-tooltip');
            }, 3000);
        }
    } catch (error) {
        btn.textContent = 'Network Error';
        btn.classList.add('error');
        btn.setAttribute('data-tooltip', 'Could not check GitHub releases');
        btn.disabled = false;
    }
}

function tick() {
    countdown--;
    document.getElementById('countdown').textContent = countdown;
    if (countdown <= 0) {
        countdown = 5;
        fetchStatus();
        
        // Auto-refresh active tab content
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            const tabId = activeTab.id;
            if (tabId === 'processes-tab') {
                loadProcesses();
            } else if (tabId === 'history-tab') {
                const activeChart = document.querySelector('.chart-tab.active');
                if (activeChart) {
                    loadHistory();
                }
            }
        }
    }
}

async function loadFeatures() {
    try {
        const response = await fetch('/api/features');
        const features = await response.json();
        
        const benchTab = document.querySelector('[data-tab="benchmark"]');
        const startBtn = document.getElementById('start-bench-btn');
        const startSimBtn = document.getElementById('start-sim-btn');
        const typeButtons = document.querySelectorAll('.type-btn');
        const modeButtons = document.querySelectorAll('.mode-btn');
        
        // Disable benchmark controls if GPU benchmark not available
        if (!features.gpu_benchmark) {
            if (benchTab) {
                benchTab.classList.add('disabled');
                benchTab.setAttribute('data-tooltip', 'Install CuPy or PyTorch for GPU benchmarking');
                benchTab.style.pointerEvents = 'auto';
            }
            
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.style.opacity = '0.5';
                startBtn.style.cursor = 'not-allowed';
                startBtn.title = 'GPU benchmark libraries not installed';
            }
            
            if (startSimBtn) {
                startSimBtn.disabled = true;
                startSimBtn.style.opacity = '0.5';
                startSimBtn.style.cursor = 'not-allowed';
                startSimBtn.title = 'Install CuPy or PyTorch for simulation';
            }
            
            typeButtons.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            });
            
            modeButtons.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            });
        } else {
            // ENABLE controls when GPU benchmark IS available
            if (benchTab) {
                benchTab.classList.remove('disabled');
                benchTab.removeAttribute('data-tooltip');
                benchTab.style.pointerEvents = '';
            }
            
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = '1';
                startBtn.style.cursor = 'pointer';
                startBtn.title = 'Start GPU benchmark';
            }
            
            if (startSimBtn) {
                startSimBtn.disabled = false;
                startSimBtn.style.opacity = '1';
                startSimBtn.style.cursor = 'pointer';
                startSimBtn.title = 'Start particle simulation with visualization';
            }
            
            typeButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
            
            modeButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
        }
    } catch (error) {
        console.error('Error loading features:', error);
    }
}

fetchStatus();
loadBaseline();
loadFeatures();
setInterval(tick, 1000);

// Initialize benchmark type on load
selectBenchType('gemm');
