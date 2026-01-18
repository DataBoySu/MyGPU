// utils.js - Dashboard utilities and data loading
// Contains functions for dashboard updates, process/port loading, and UI highlights.

async function updateDashboard(data) {
    const badge = document.getElementById('status-badge');
    if (badge) {
        // Map backend state to CSS classes
        const displayStatus = (data.status === 'warning') ? 'idle' : (data.status || 'unknown');
        badge.className = 'status-badge status-' + displayStatus;
        badge.textContent = displayStatus.toUpperCase();

        // Tooltip for status
        const alertCount = data.alerts ? data.alerts.length : 0;
        if (data.status === 'warning' && alertCount > 0) {
            badge.setAttribute('data-hover', `${alertCount} active alert${alertCount > 1 ? 's' : ''}`);
        } else if (displayStatus === 'info') {
            badge.setAttribute('data-hover', 'System information available');
        } else {
            badge.setAttribute('data-hover', 'All systems operational');
        }
    }

    const gpuList = document.getElementById('gpu-list');
    if (gpuList) {
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
                    <div class="metric-row"><span class="metric-label">Utilization</span><span class="metric-value">${util}%</span></div>
                    <div class="progress-bar"><div class="progress-fill ${util > 90 ? 'crit' : util > 70 ? 'warn' : ''}" style="width: ${util}%"></div></div>
                    <div class="metric-row"><span class="metric-label">Memory</span><span class="metric-value">${(gpu.memory_used / 1024).toFixed(1)}/${(gpu.memory_total / 1024).toFixed(1)} GB</span></div>
                    <div class="progress-bar"><div class="progress-fill ${memPct > 90 ? 'crit' : memPct > 70 ? 'warn' : ''}" style="width: ${memPct}%"></div></div>
                    <div class="metric-row"><span class="metric-label">Power</span><span class="metric-value">${(gpu.power || 0).toFixed(0)}W</span></div>
                </div>
            `;
        }).join('');
    }

    const sys = data.metrics.system;
    const sysInfo = document.getElementById('system-info');
    if (sysInfo) {
        sysInfo.innerHTML = `
            <div class="metric-row"><span class="metric-label">Hostname</span><span class="metric-value">${sys.hostname || 'N/A'}</span></div>
            <div class="metric-row"><span class="metric-label">CPU Usage</span><span class="metric-value">${(sys.cpu_percent || 0).toFixed(1)}%</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${sys.cpu_percent || 0}%"></div></div>
            <div class="metric-row"><span class="metric-label">RAM Usage</span><span class="metric-value">${(sys.memory_used_gb || 0).toFixed(1)}/${(sys.memory_total_gb || 0).toFixed(1)} GB</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${sys.memory_percent || 0}%"></div></div>
            <div class="metric-row"><span class="metric-label">Disk Usage</span><span class="metric-value">${(sys.disk_used_gb || 0).toFixed(1)}/${(sys.disk_total_gb || 0).toFixed(1)} GB</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${sys.disk_percent || 0}%"></div></div>
        `;
    }

    const alertsList = document.getElementById('alerts-list');
    if (alertsList) {
        if (data.alerts && data.alerts.length > 0) {
            alertsList.innerHTML = data.alerts.map(a => `<div class="alert-item"><strong>${a.severity.toUpperCase()}</strong>: ${a.message}</div>`).join('');
        } else {
            alertsList.innerHTML = '<div style="color: var(--accent-green);">No active alerts</div>';
        }
    }

    // --- Toast Notifications Logic ---
    try {
        if (!window._seenAlerts) window._seenAlerts = new Set();
        if (!window._lastAlertAt) window._lastAlertAt = {};
        const COOLDOWN_MS = 10000;
        if (data.alerts && data.alerts.length > 0) {
            for (const a of data.alerts) {
                const aid = a.name || (a.timestamp ? a.timestamp + '|' + a.message : a.message);
                if (window._seenAlerts.has(aid)) continue;
                const now = Date.now();
                const last = window._lastAlertAt[aid] || 0;
                if (now - last < COOLDOWN_MS) continue;
                window._seenAlerts.add(aid);
                window._lastAlertAt[aid] = now;
                const m = /gpu_(\d+)_vram_cap_exceeded/.exec(a.name || '');
                if (m) {
                    if (typeof showToast === 'function') showToast(`VRAM of GPU ${m[1]} exceeded`, { level: 'red', duration: 8000 });
                } else {
                    const level = (a.severity === 'warning' || a.severity === 'critical' || a.severity === 'error') ? 'red' : 'yellow';
                    if (typeof showToast === 'function') showToast(a.message || (a.name || 'Alert'), { level, duration: 8000 });
                }
            }
        }
    } catch (e) { console.debug('Toast trigger failed', e); }

    const lastUpdateEl = document.getElementById('last-update');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = new Date().toLocaleTimeString();
    }
}

async function loadHistory() {
    const metric = document.getElementById('metric-select').value;
    const hours = document.getElementById('hours-select').value;
    try {
        const response = await fetch(`/api/history?metric=${metric}&hours=${hours}`);
        const data = await response.json();
        const unit = metric.includes('temp') ? '°C' : metric.includes('util') ? '%' : metric.includes('mem') ? 'MB' : 'W';
        initHistoryChart(data, document.getElementById('metric-select').selectedOptions[0].text, unit);
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

async function loadProcesses() {
    try {
        const [procResp, capsResp, watchlistResp] = await Promise.all([
            fetch('/api/processes'),
            fetch('/api/vram_caps'),
            fetch('/api/processes/watchlist')
        ]);
        const data = await procResp.json();
        const caps = await capsResp.json();
        const wdata = await watchlistResp.json();
        const watchlist = new Set((wdata.watchlist || []).map(Number));

        // Use renderProcessTable if available (it handles VRAM bars too)
        if (typeof renderProcessTable === 'function') {
            renderProcessTable(data.processes, watchlist, data.vram_cap_exceeded, data.gpu_memory, caps.vram_caps || {});
        } else {
            console.warn('renderProcessTable not found');
        }
    } catch (error) {
        console.error('Error loading processes:', error);
    }
}

async function loadPorts() {
    try {
        const response = await fetch('/api/ports');
        const data = await response.json();
        renderPortsTable(data.ports);
    } catch (error) {
        console.error('Error loading ports:', error);
    }
}

async function terminateProcess(pid, action = 'kill') {
    const label = (action === 'free') ? 'free port from' : 'terminate';
    if (!confirm(`Are you sure you want to ${label} process ${pid}?`)) return;
    try {
        const response = await fetch('/api/processes/terminate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pid, action })
        });
        const result = await response.json();
        if (result.status === 'success') {
            if (typeof showSuccess === 'function') showSuccess(result.message);
            loadProcesses();
            if (document.getElementById('ports').classList.contains('active')) loadPorts();
        } else {
            if (typeof showError === 'function') showError(result.message);
        }
    } catch (error) {
        if (typeof showError === 'function') showError('Error terminating process: ' + error);
    }
}

// Check features level
async function checkFeatures() {
    try {
        const response = await fetch('/api/features');
        const features = await response.json();
        const select = document.getElementById('benchmark-backend-select');
        if (select) {
            if (features && features.cupy_available) {
                select.disabled = false;
                select.querySelector('option[value="disabled"]').remove();
                if (select.querySelector('option[value="cupy"]')) select.querySelector('option[value="cupy"]').textContent = 'CuPy (Ready)';
                const hint = select.nextElementSibling;
                if (hint) hint.textContent = 'Hardware acceleration ready';
                if (typeof window.onBackendChange === 'function') window.onBackendChange('auto');
            } else {
                const hint = select.nextElementSibling;
                if (hint) hint.textContent = 'Feature not implemented';
            }
        }
    } catch (e) { console.debug('Feature check failed', e); }
}

async function loadPorts() {
    try {
        const [portsResp, watchlistResp] = await Promise.all([
            fetch('/api/ports'),
            fetch('/api/ports/watchlist')
        ]);
        const portsData = await portsResp.json();
        const watchlistData = await watchlistResp.json();

        window.portWatchlist = watchlistData.watchlist || [];
        const pinned = new Set(window.portWatchlist);

        // Sort: Pinned first, then user ownership, then port number
        const sorted = portsData.ports.sort((a, b) => {
            const keyA = `${a.local_port}-${a.pid}`;
            const keyB = `${b.local_port}-${b.pid}`;
            const pinA = pinned.has(keyA) ? 0 : 1;
            const pinB = pinned.has(keyB) ? 0 : 1;
            if (pinA !== pinB) return pinA - pinB;

            const ownA = a.ownership === 'User' ? 0 : 1;
            const ownB = b.ownership === 'User' ? 0 : 1;
            if (ownA !== ownB) return ownA - ownB;

            return a.local_port - b.local_port;
        });

        if (typeof renderPortsTable === 'function') renderPortsTable(sorted);
    } catch (e) { console.error('Error loading ports:', e); }
}

async function checkForUpdates() {
    const btn = document.getElementById('update-btn');
    btn.disabled = true;
    btn.textContent = 'Checking...';
    try {
        const response = await fetch('https://api.github.com/repos/DataBoySu/MyGPU/releases/latest');
        const release = await response.json();
        const latestVersion = release.tag_name;
        if (typeof showSuccess === 'function') showSuccess('Latest version: ' + latestVersion);
    } catch (e) {
        if (typeof showError === 'function') showError('Failed to check for updates');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Check for Updates';
    }
}

// Global exposure for cross-component access
window.loadHistory = loadHistory;
window.loadProcesses = loadProcesses;
window.loadPorts = loadPorts;
window.terminateProcess = terminateProcess;
window.checkFeatures = checkFeatures;
window.checkForUpdates = checkForUpdates;
