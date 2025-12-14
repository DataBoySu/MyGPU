// main.js - Main initialization and tab handling
// All functions are now modularized across simulation.js, benchmark.js, charts.js, and utils.js

// Global variables
let countdown = 5;
let historyChart = null;
let benchmarkPollInterval = null;
let benchCharts = {};
let selectedMode = 'quick';
let selectedBenchType = 'gemm';
if (typeof selectedBackend === 'undefined') {
    var selectedBackend = 'auto';
}

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
        
        // Clear benchmark results when leaving the benchmark tab to avoid stale/plain-text output
        if (tab.dataset.tab !== 'benchmark') {
            try { const br = document.getElementById('benchmark-results'); if (br) br.innerHTML = ''; } catch(e){}
        }
        if (tab.dataset.tab === 'history') loadHistory();
        if (tab.dataset.tab === 'processes') loadProcesses();
        if (tab.dataset.tab === 'benchmark') { loadBenchmarkResults(); loadBaseline(); }
    });
});

// Sync input to slider for custom controls
['duration', 'temp', 'memory', 'power', 'matrix', 'particles'].forEach(type => {
    const input = document.getElementById('custom-' + type + '-val');
    if (input) {
        input.addEventListener('change', () => {
            document.getElementById('custom-' + type).value = input.value;
        });
    }
});

// Fetch and update dashboard status
async function fetchStatus() {
    try {
        console.log('Fetching status from /api/status...');
        const response = await fetch('/api/status');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            // try to extract server-provided error message
            let errText = `HTTP ${response.status}`;
            try {
                const txt = await response.text();
                if (txt) {
                    try { const j = JSON.parse(txt); errText = j.error || j.message || txt; }
                    catch(e){ errText = txt; }
                }
            } catch (e) {}
            if (window.showError) window.showError(`Status fetch failed: ${errText}`);
            throw new Error(errText);
        }

        const data = await response.json();
        console.log('Received data:', data);
        updateDashboard(data);
        // Update footer last-update with server timestamp if provided
        if (data && data.metrics && data.metrics.timestamp && window.setLastUpdate) {
            try { window.setLastUpdate(data.metrics.timestamp); } catch(e){ console.debug('setLastUpdate failed', e); }
        }
        // If server reported a recent benchmark error, surface it as a sliding notification
        if (data && data.benchmark_error) {
            try {
                if (window.showError) window.showError(data.benchmark_error, 15000);
            } catch (e) { console.debug('showError call failed', e); }
        }
    } catch (error) {
        console.error('Error fetching status:', error);
        document.getElementById('gpu-list').innerHTML = '<div class="gpu-card" style="color: #ef4444;">Error: Failed to fetch GPU data. Check console for details.</div>';
        document.getElementById('system-info').innerHTML = '<div style="color: #ef4444;">Error loading system info</div>';
        if (window.showError) {
            window.showError(typeof error === 'string' ? error : (error && error.message) ? error.message : 'Unknown error while fetching status');
        }
    }
}

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

async function shutdownServer() {
    if (!confirm('Are you sure you want to exit? This will stop the server and close the application.')) {
        return;
    }
    
    const btn = document.getElementById('shutdown-btn');
    btn.disabled = true;
    btn.textContent = 'Shutting down...';
    
    try {
        await fetch('/api/shutdown', { method: 'POST' });
        document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; background: var(--bg-primary); color: var(--text-primary);"><h1>Server Shutting Down</h1><p>You can close this window now.</p></div>';
    } catch (error) {
        // Server shut down, connection closed - this is expected
        document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; background: var(--bg-primary); color: var(--text-primary);"><h1>Server Shut Down</h1><p>You can close this window now.</p></div>';
    }
}

// Initialize dashboard
fetchStatus();
setInterval(fetchStatus, 5000);
// Load server feature detection and update UI (disables unavailable backends)
if (typeof loadFeatures === 'function') loadFeatures();

// Initialize benchmark tab (disabled)
try { if (typeof selectBenchType === 'function') selectBenchType('gemm'); } catch(e){}
try { if (typeof selectMode === 'function') selectMode('quick'); } catch(e){}

console.log('Dashboard initialized - all modules loaded');
