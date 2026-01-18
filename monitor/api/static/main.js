// main.js - Core dashboard logic
// Handles tab switching, data fetching, charting, and benchmark management.

// Global State
let countdown = 5;
let refreshInterval = null;
let historyChart = null;
let benchCharts = {};
let selectedBenchType = 'gemm';
let selectedMode = 'quick';
let benchmarkPollInterval = null;
let lastUpdateTs = 0;
window.isAdmin = false;

// Tabs Logic
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const contentId = tab.getAttribute('data-tab');
        document.getElementById(contentId).classList.add('active');

        // Tab-specific loading
        if (contentId === 'history') {
            loadHistory();
            if (historyChart) setTimeout(() => historyChart.resize(), 50);
        }
        if (contentId === 'processes') loadProcesses();
        if (contentId === 'ports') loadPorts();
        if (contentId === 'benchmark') {
            loadBaseline();
            loadSimulationBaseline();
            loadBenchmarkResults();
            setTimeout(() => {
                Object.values(benchCharts).forEach(c => c && c.resize());
            }, 50);
        }
    });
});

// Update Ticker
function updateTicker() {
    countdown--;
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) countdownEl.textContent = countdown;

    if (countdown <= 0) {
        countdown = 5;
        fetchStatus();

        // Background updates for active tabs
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            if (activeTab.id === 'processes') {
                window._procTicker = (window._procTicker || 0) + 1;
                if (window._procTicker >= 12) { // Every 60s
                    window._procTicker = 0;
                    loadProcesses();
                }
            } else if (activeTab.id === 'ports') {
                window._portsTicker = (window._portsTicker || 0) + 1;
                if (window._portsTicker >= 6) { // Every 30s
                    window._portsTicker = 0;
                    loadPorts();
                }
            }
        }
    }
}

async function fetchStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        updateDashboard(data);
        if (data.is_admin !== undefined) window.isAdmin = data.is_admin;

        // Server provided timestamp
        if (data.timestamp && typeof window.setLastUpdate === 'function') {
            window.setLastUpdate(data.timestamp);
        }
    } catch (error) {
        console.error('Error fetching status:', error);
        const gpuList = document.getElementById('gpu-list');
        if (gpuList) gpuList.innerHTML = '<div class="gpu-card" style="color: var(--accent-red);">Server Unreachable</div>';
    }
}

// Charting Logic - Using Apache ECharts for superior history rendering
function initHistoryChart(data, metricLabel, unit) {
    const chartDom = document.getElementById('historyChart');
    if (historyChart) {
        historyChart.dispose();
    }
    historyChart = echarts.init(chartDom, 'dark');

    const points = data.data.map(d => [
        new Date(d.timestamp).getTime(),
        d.value
    ]).sort((a, b) => a[0] - b[0]);

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const date = new Date(params[0].value[0]);
                return `${date.toLocaleString()}<br/>${params[0].marker} ${metricLabel}: <b>${params[0].value[1]} ${unit}</b>`;
            },
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            borderColor: '#4a4a4a',
            textStyle: { color: '#f0f0f0' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            splitLine: { show: true, lineStyle: { color: '#333' } },
            axisLabel: { color: '#a0a0a0' }
        },
        yAxis: {
            type: 'value',
            name: unit,
            splitLine: { show: true, lineStyle: { color: '#333' } },
            axisLabel: { color: '#a0a0a0' },
            nameTextStyle: { color: '#a0a0a0' }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
                zoomLock: false // Allow zooming
            },
            {
                type: 'slider',
                start: 0,
                end: 100,
                bottom: 10,
                borderColor: '#4a4a4a',
                handleStyle: { color: '#76b900' },
                textStyle: { color: '#a0a0a0' }
            }
        ],
        series: [{
            name: metricLabel,
            type: 'line',
            showSymbol: false,
            data: points,
            lineStyle: { color: '#76b900', width: 2 },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(118, 185, 0, 0.3)' },
                    { offset: 1, color: 'rgba(118, 185, 0, 0)' }
                ])
            },
            emphasis: {
                lineStyle: { width: 3 }
            }
        }]
    };

    historyChart.setOption(option);

    // ECharts handles resizing automatically if we call resize()
    window.addEventListener('resize', () => historyChart && historyChart.resize());
}

// Process & VRAM Support
function renderProcessTable(processes, watchlist, exceededGpus, gpuMemory, caps) {
    const tbody = document.getElementById('process-list');
    if (!tbody) return;

    // Render VRAM Bars first
    const vramWrapper = document.getElementById('vram-bars-wrapper');
    const vramContainer = document.getElementById('vram-bar-container');
    if (vramWrapper && gpuMemory && Object.keys(gpuMemory).length > 0) {
        vramContainer.style.display = 'block';
        vramWrapper.innerHTML = '';
        const sortedGpuKeys = Object.keys(gpuMemory).sort((a, b) => Number(a) - Number(b));

        for (const gpuIdx of sortedGpuKeys) {
            const stats = gpuMemory[gpuIdx];
            const idx = Number(gpuIdx);
            const total = Number(stats.total || 0);
            const used = Number(stats.used || 0);
            const free = Number(stats.free || 0);
            const pct = total ? (used / total * 100) : 0;

            const cap = caps[idx] || {};
            const capDisplay = cap.cap_mb ? `${(cap.cap_mb / 1024).toFixed(1)} GB` : (cap.cap_percent ? `${cap.cap_percent}%` : 'No cap');
            const sliderVal = cap.cap_percent != null ? cap.cap_percent : Math.round(pct);
            const mbVal = cap.cap_mb != null ? cap.cap_mb : Math.round(total * (sliderVal / 100));

            vramWrapper.insertAdjacentHTML('beforeend', `
                <div class="vram-gpu-card" id="vram-gpu-${idx}">
                    <div class="vram-gpu-header">
                        <span class="vram-gpu-label">GPU ${idx}</span>
                        <span class="vram-gpu-free">${(used / 1024).toFixed(1)} / ${(total / 1024).toFixed(1)} GB (${(free / 1024).toFixed(1)} GB Free) • Cap: <span class="vram-cap-display" id="vram-cap-display-${idx}">${capDisplay}</span></span>
                    </div>
                    <div class="vram-bar-outer">
                        <div class="vram-bar-used" id="vram-used-${idx}" style="width:${pct}%; background:${pct > 90 ? 'var(--accent-red)' : pct > 70 ? 'var(--accent-yellow)' : 'var(--accent-green)'}"></div>
                        <input type="range" min="1" max="100" value="${sliderVal}" class="vram-overlay-slider" id="vram-overlay-${idx}" ${!window.isAdmin ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; justify-content:flex-end; margin-top:8px; gap:8px; align-items:center;">
                        <input type="number" min="0" max="${Math.floor(total)}" value="${mbVal}" class="vram-cap-input" id="vram-cap-input-${idx}" placeholder="MB" ${!window.isAdmin ? 'disabled' : ''}>
                    </div>
                </div>
            `);

            // Attach VRAM events
            const overlay = document.getElementById(`vram-overlay-${idx}`);
            const mbInput = document.getElementById(`vram-cap-input-${idx}`);
            const capDisp = document.getElementById(`vram-cap-display-${idx}`);
            const usedBar = document.getElementById(`vram-used-${idx}`);

            if (overlay) {
                overlay.oninput = (ev) => {
                    const val = ev.target.value;
                    if (usedBar) usedBar.style.width = val + '%';
                    if (capDisp) capDisp.textContent = val + '%';
                    if (mbInput) mbInput.value = Math.round((total * val) / 100);
                };
                overlay.onchange = async (ev) => {
                    const val = ev.target.value;
                    try {
                        const r = await fetch('/api/vram_caps', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ gpu_index: idx, cap_percent: Number(val) })
                        });
                        if (r.ok) {
                            if (typeof window.showSuccess === 'function') window.showSuccess('VRAM cap saved');
                            loadProcesses();
                        }
                    } catch (e) { }
                };
            }
            if (mbInput) {
                const saveMb = async () => {
                    const val = parseInt(mbInput.value);
                    if (isNaN(val) || val <= 0) return;
                    try {
                        const r = await fetch('/api/vram_caps', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ gpu_index: idx, cap_mb: val })
                        });
                        if (r.ok) {
                            if (typeof window.showSuccess === 'function') window.showSuccess('VRAM cap saved');
                            loadProcesses();
                        }
                    } catch (e) { }
                };
                mbInput.onkeydown = (e) => { if (e.key === 'Enter') saveMb(); };
                mbInput.onblur = saveMb;
            }
        }
    } else {
        vramContainer.style.display = 'none';
    }

    // Render Table Rows
    // Differential update: Remove rows not in new data
    const newPids = new Set(processes.map(p => p.pid));
    Array.from(tbody.querySelectorAll('tr[data-pid]')).forEach(row => {
        if (!newPids.has(Number(row.dataset.pid))) row.remove();
    });

    // Remove "Loading..." row
    const loadingRow = tbody.querySelector('tr td[colspan]');
    if (loadingRow) loadingRow.closest('tr').remove();

    processes.sort((a, b) => (b.gpu_memory_usage || 0) - (a.gpu_memory_usage || 0)).forEach(p => {
        const pid = Number(p.pid);
        let row = tbody.querySelector(`tr[data-pid="${pid}"]`);

        const isExceeded = exceededGpus && exceededGpus[p.gpu_index] && exceededGpus[p.gpu_index].exceeded;
        const badge = (isExceeded && watchlist.has(pid)) ? '<span class="vram-exceeded-badge big"></span>' : '';

        const html = `
            <td><input type="checkbox" class="watch-cb" data-pid="${pid}" ${watchlist.has(pid) ? 'checked' : ''}></td>
            <td class="large-font" style="font-family:monospace; color:var(--accent-blue); white-space:nowrap; min-width:100px;">${badge}${pid}</td>
            <td style="font-weight:600;">${p.name || 'N/A'}</td>
            <td style="font-size:0.9em; opacity:0.8;">GPU ${p.gpu_index}</td>
            <td style="font-size:0.9em; opacity:0.8;">${p.username || '—'}</td>
            <td><button onclick="terminateProcess(${pid})" class="terminate-btn" ${!window.isAdmin ? 'disabled' : ''} ${!window.isAdmin ? 'data-hover="Admin mode required to terminate"' : ''} style="background:var(--accent-red); color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Terminate</button></td>
        `;

        if (row) {
            if (row.innerHTML !== html) row.innerHTML = html;
        } else {
            const newRow = document.createElement('tr');
            newRow.dataset.pid = pid;
            newRow.innerHTML = html;
            tbody.appendChild(newRow);

            // Watchlist toggle
            const cb = newRow.querySelector('.watch-cb');
            if (cb) {
                cb.onchange = async (ev) => {
                    const action = ev.target.checked ? 'add' : 'remove';
                    await fetch('/api/processes/watchlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pid, action })
                    });

                    // Sync to Ports: If ticking, find associated ports and tick them too
                    if (action === 'add') {
                        try {
                            const pResp = await fetch('/api/ports');
                            const pData = await pResp.json();
                            if (pData && pData.ports) {
                                for (const port of pData.ports) {
                                    if (Number(port.pid) === pid) {
                                        await fetch('/api/ports/watchlist', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ key: `${port.local_port}-${port.pid}`, action: 'add' })
                                        });
                                    }
                                }
                                if (typeof window.loadPorts === 'function') window.loadPorts();
                            }
                        } catch (e) { console.debug('Sync failed', e); }
                    }
                };
            }
        }
    });
}

// Port Rendering
function renderPortsTable(ports) {
    const tbody = document.getElementById('port-list');
    if (!tbody) return;

    // Remove Loading row
    const loadingRow = tbody.querySelector('tr td[colspan]');
    if (loadingRow) loadingRow.closest('tr').remove();

    const newKeys = new Set(ports.map(p => `${p.local_port}-${p.pid}`));
    Array.from(tbody.querySelectorAll('tr[data-key]')).forEach(row => {
        if (!newKeys.has(row.dataset.key)) row.remove();
    });

    const watchlist = new Set(window.portWatchlist || []);
    ports.forEach(p => {
        const key = `${p.local_port}-${p.pid}`;
        let row = tbody.querySelector(`tr[data-key="${key}"]`);

        const isPinned = watchlist.has(key);
        const btnHover = !window.isAdmin ? 'data-hover="Available in Admin Mode. Open MyGPU with --admin flag to activate."' : '';
        const actions = p.pid ? `
            <div style="display:inline-flex; gap:5px;">
                <button onclick="terminateProcess(${p.pid}, 'free')" class="terminate-btn" ${!window.isAdmin ? 'disabled' : ''} ${btnHover} style="background:var(--accent-blue); color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.8em;">Free Port</button>
                <button onclick="terminateProcess(${p.pid}, 'kill')" class="terminate-btn" ${!window.isAdmin ? 'disabled' : ''} ${btnHover} style="background:var(--accent-red); color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.8em;">Terminate</button>
            </div>
        ` : '—';

        const html = `
            <td><input type="checkbox" class="port-watch-cb" data-key="${key}" ${isPinned ? 'checked' : ''}></td>
            <td class="large-font" style="font-family:monospace; color:var(--accent-blue);">${p.local_port}</td>
            <td><span style="font-size:0.8em; opacity:0.8; background:var(--bg-tertiary); padding:2px 5px; border-radius:3px;">${p.type}</span></td>
            <td style="font-weight:500;">${p.process_name} ${p.ownership === 'System' ? '🛡️' : ''}</td>
            <td class="large-font" style="font-family:monospace; opacity:0.9; white-space:nowrap; min-width:80px;">${p.pid || '—'}</td>
            <td class="large-font"><span class="status-badge ${p.status === 'LISTEN' ? 'status-healthy' : 'status-info'}" style="padding:4px 10px; font-size:0.8em; border-radius:12px;">${p.status || 'ACTIVE'}</span></td>
            <td>${actions}</td>
        `;

        if (row) {
            if (row.innerHTML !== html) row.innerHTML = html;
        } else {
            const newRow = document.createElement('tr');
            newRow.dataset.key = key;
            newRow.innerHTML = html;
            tbody.appendChild(newRow);

            // Watchlist toggle
            const cb = newRow.querySelector('.port-watch-cb');
            if (cb) {
                cb.onchange = async (ev) => {
                    const action = ev.target.checked ? 'add' : 'remove';
                    await fetch('/api/ports/watchlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key, action })
                    });
                    if (typeof window.loadPorts === 'function') window.loadPorts();
                };
            }
        }
    });
}

// Benchmark Logic
async function loadBaseline() {
    try {
        const response = await fetch('/api/benchmark/baseline?benchmark_type=' + selectedBenchType);
        const baseline = await response.json();
        const container = document.getElementById('baseline-info');
        const details = document.getElementById('baseline-details');
        if (baseline && baseline.status !== 'no_baseline') {
            container.style.display = 'block';
            const typeLabel = baseline.benchmark_type === 'gemm' ? 'GEMM' : 'Particle';
            details.innerHTML = `
                <div class="metric-row"><span class="metric-label">GPU</span><span class="metric-value">${baseline.gpu_name}</span></div>
                <div class="metric-row"><span class="metric-label">Type</span><span class="metric-value">${typeLabel}</span></div>
                <div class="metric-row"><span class="metric-label">Avg iteration</span><span class="metric-value">${baseline.avg_iteration_time_ms.toFixed(2)} ms</span></div>
                <div class="metric-row"><span class="metric-label">Avg Temp</span><span class="metric-value">${baseline.avg_temperature.toFixed(1)} C</span></div>
                <p style="font-size: 0.85em; color: var(--text-secondary); margin-top: 10px;">Saved: ${new Date(baseline.timestamp).toLocaleString()}</p>
            `;
        } else { container.style.display = 'none'; }
    } catch (e) { }
}

async function startBenchmark() {
    const btn = document.getElementById('start-bench-btn');
    const stopBtn = document.getElementById('stop-bench-btn');
    btn.disabled = true;
    btn.textContent = 'Running...';
    stopBtn.style.display = 'inline-block';

    document.getElementById('benchmark-progress').style.display = 'block';
    document.getElementById('benchmark-live-charts').style.display = 'block';
    document.getElementById('benchmark-results').innerHTML = '';
    document.getElementById('iteration-counter').textContent = 'Iteration #0';
    document.getElementById('iteration-counter').style.display = 'inline';

    let url = `/api/benchmark/start?benchmark_type=${selectedBenchType}&mode=${selectedMode}`;
    if (selectedMode === 'custom') {
        url += `&duration=${document.getElementById('custom-duration-val').value}`;
        url += `&temp_limit=${document.getElementById('custom-temp-val').value}`;
        url += `&memory_limit=${document.getElementById('custom-memory-val').value}`;
        url += `&power_limit=${document.getElementById('custom-power-val').value}`;
        if (selectedBenchType === 'gemm') url += `&matrix_size=${document.getElementById('custom-matrix-val').value}`;
        else url += `&num_particles=${Math.round(parseFloat(document.getElementById('custom-particles-val').value) * 1000000)}`;
    } else if (selectedMode === 'stress-test') {
        url += '&auto_scale=true&duration=60&backend_multiplier=15';
    }

    initLiveCharts();
    try {
        await fetch(url, { method: 'POST' });
        if (benchmarkPollInterval) clearInterval(benchmarkPollInterval);
        benchmarkPollInterval = setInterval(pollBenchmarkStatus, 500);
    } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Start Benchmark';
        stopBtn.style.display = 'none';
    }
}

async function pollBenchmarkStatus() {
    try {
        const [statusResp, samplesResp] = await Promise.all([
            fetch('/api/benchmark/status'),
            fetch('/api/benchmark/samples')
        ]);
        const status = await statusResp.json();
        const samplesData = await samplesResp.json();

        document.getElementById('bench-progress-bar').style.width = (status.progress || 0) + '%';
        document.getElementById('bench-percent').textContent = (status.progress || 0) + '%';
        document.getElementById('iteration-counter').textContent = 'Iteration #' + (status.iterations || 0);

        if (samplesData && samplesData.samples) {
            updateLiveCharts(samplesData.samples[samplesData.samples.length - 1]);
        }

        if (!status.running) {
            clearInterval(benchmarkPollInterval);
            benchmarkPollInterval = null;
            document.getElementById('start-bench-btn').disabled = false;
            document.getElementById('start-bench-btn').textContent = 'Start Benchmark';
            document.getElementById('start-sim-btn').disabled = false;
            document.getElementById('start-sim-btn').textContent = 'Start Simulation';
            document.getElementById('stop-bench-btn').style.display = 'none';
            loadBenchmarkResults();
            if (status.stop_reason) {
                const reasonEl = document.getElementById('bench-stop-reason') || { textContent: '' };
                reasonEl.textContent = 'Stopped: ' + status.stop_reason;
            }
        }
    } catch (e) {
        console.error('Benchmark poll error:', e);
        clearInterval(benchmarkPollInterval);
        benchmarkPollInterval = null;
        document.getElementById('start-bench-btn').disabled = false;
        document.getElementById('start-bench-btn').textContent = 'Start Benchmark';
        document.getElementById('start-sim-btn').disabled = false;
        document.getElementById('start-sim-btn').textContent = 'Start Simulation';
    }
}

async function loadBenchmarkResults() {
    try {
        const resp = await fetch('/api/benchmark/results');
        const r = await resp.json();
        if (r && r.status !== 'no_results') {
            document.getElementById('benchmark-results').innerHTML = `
                <div class="gpu-card" style="border-left: 4px solid var(--accent-green);">
                    <h3 style="color: var(--accent-green); margin-bottom: 15px;">Benchmark Results</h3>
                    <div class="metric-row"><span class="metric-label">Average TFLOPS</span><span class="metric-value">${r.avg_tflops?.toFixed(2) || 'N/A'}</span></div>
                    <div class="metric-row"><span class="metric-label">Peak TFLOPS</span><span class="metric-value">${r.peak_tflops?.toFixed(2) || 'N/A'}</span></div>
                    <div class="metric-row"><span class="metric-label">Avg Temp</span><span class="metric-value">${r.avg_temperature?.toFixed(1)}°C</span></div>
                    <div class="metric-row"><span class="metric-label">Avg Power</span><span class="metric-value">${r.avg_power_draw?.toFixed(1)}W</span></div>
                </div>`;
        }
    } catch (e) { }
}

async function stopBenchmark() {
    await fetch('/api/benchmark/stop', { method: 'POST' });
}

function selectBenchType(type) {
    selectedBenchType = type;
    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.type === type));
    document.getElementById('gemm-settings').style.display = type === 'gemm' ? 'block' : 'none';
    document.getElementById('particle-settings').style.display = type === 'particle' ? 'block' : 'none';

    // Disable Custom and Stress Test for Particle
    const customBtn = document.querySelector('.mode-btn[data-mode="custom"]');
    const stressBtn = document.querySelector('.mode-btn[data-mode="stress-test"]');
    if (type === 'particle') {
        if (customBtn) {
            customBtn.disabled = true;
            customBtn.title = 'Not available for Particle simulation';
            customBtn.style.opacity = '0.5';
            customBtn.style.cursor = 'not-allowed';
        }
        if (stressBtn) {
            stressBtn.disabled = true;
            stressBtn.title = 'Not available for Particle simulation';
            stressBtn.style.opacity = '0.5';
            stressBtn.style.cursor = 'not-allowed';
        }
        // If current mode is disabled, fallback to quick
        if (selectedMode === 'custom' || selectedMode === 'stress-test') {
            selectMode('quick');
        }
    } else {
        if (customBtn) {
            customBtn.disabled = false;
            customBtn.title = '';
            customBtn.style.opacity = '1';
            customBtn.style.cursor = 'pointer';
        }
        if (stressBtn) {
            stressBtn.disabled = false;
            stressBtn.title = '';
            stressBtn.style.opacity = '1';
            stressBtn.style.cursor = 'pointer';
        }
    }

    loadBaseline();
}

function selectMode(mode) {
    selectedMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    document.getElementById('custom-controls').style.display = mode === 'custom' ? 'block' : 'none';
}

function updateSliderValue(type) {
    const slider = document.getElementById(`custom-${type}`);
    const input = document.getElementById(`custom-${type}-val`);
    if (slider && input) input.value = slider.value;
}

function exportData(format) {
    const hours = document.getElementById('export-hours').value;
    window.location.href = `/api/export/${format}?hours=${hours}`;
}


// Admin Injection
function injectAdminButton() {
    const updateBtn = document.getElementById('update-btn');
    if (!updateBtn || document.getElementById('restart-elevated-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'restart-elevated-btn';
    btn.textContent = 'ADMIN';
    Object.assign(btn.style, {
        padding: '8px 12px', borderRadius: '6px', border: '2px solid #76b900',
        background: '#0b0b0b', color: '#76b900', cursor: 'pointer', marginRight: '8px'
    });
    btn.setAttribute('data-hover', 'Check elevation status');
    btn.onclick = async () => {
        const r = await fetch('/api/is_elevated');
        const data = await r.json();
        if (data.elevated) {
            if (typeof window.showSuccess === 'function') window.showSuccess('Running as Admin');
        } else {
            if (typeof window.showToast === 'function') window.showToast('Run with admin: python health_monitor.py web --admin', { level: 'yellow', duration: 10000 });
        }
    };
    updateBtn.parentNode.insertBefore(btn, updateBtn);
}

// App Initialization
async function init() {
    await fetchStatus();
    checkFeatures();
    injectAdminButton();
    refreshInterval = setInterval(updateTicker, 1000);
}

init();
