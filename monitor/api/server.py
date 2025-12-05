"""
FastAPI Server

REST API and web dashboard for Cluster Health Monitor.
"""

from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from monitor.collectors.gpu import GPUCollector
from monitor.collectors.system import SystemCollector
from monitor.storage.sqlite import MetricsStorage
from monitor.alerting.rules import AlertEngine


def create_app(config: Dict[str, Any]) -> FastAPI:
    
    app = FastAPI(
        title="Cluster Health Monitor",
        description="Real-time GPU cluster monitoring",
        version="1.0.0"
    )
    
    # Initialize components
    storage = MetricsStorage(config['storage']['path'])
    alert_engine = AlertEngine(config.get('alerts', {}))
    
    @app.on_event("startup")
    async def startup():
        await storage.initialize()
    
    @app.on_event("shutdown")
    async def shutdown():
        storage.close()
    
    @app.get("/", response_class=HTMLResponse)
    async def dashboard():
        return get_dashboard_html()
    
    @app.get("/api/status")
    async def get_status():
        
        gpu_collector = GPUCollector()
        sys_collector = SystemCollector()
        
        gpus = gpu_collector.collect()
        system = sys_collector.collect()
        
        metrics = {
            'timestamp': datetime.now().isoformat(),
            'hostname': system.get('hostname', 'unknown'),
            'gpus': gpus,
            'system': system,
        }
        
        alerts = alert_engine.check(metrics)
        
        return {
            'status': 'healthy' if not alerts else 'warning',
            'metrics': metrics,
            'alerts': alerts,
        }
    
    @app.get("/api/gpus")
    async def get_gpus():
        collector = GPUCollector()
        return {'gpus': collector.collect()}
    
    @app.get("/api/system")
    async def get_system():
        collector = SystemCollector()
        return {'system': collector.collect()}
    
    @app.get("/api/alerts")
    async def get_alerts():
        return {'alerts': alert_engine.get_active_alerts()}
    
    @app.get("/api/metrics")
    async def get_metrics(
        hostname: Optional[str] = None,
        metric_type: Optional[str] = None,
        metric_name: Optional[str] = None,
        hours: int = 24
    ):
        
        metrics = await storage.query(
            hostname=hostname,
            metric_type=metric_type,
            metric_name=metric_name,
            hours=hours
        )
        
        return {'metrics': metrics, 'count': len(metrics)}
    
    return app


def get_dashboard_html() -> str:
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cluster Health Monitor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg-primary: #0d1117;
            --bg-secondary: #161b22;
            --bg-tertiary: #21262d;
            --text-primary: #c9d1d9;
            --text-secondary: #8b949e;
            --accent-green: #238636;
            --accent-blue: #58a6ff;
            --accent-yellow: #d29922;
            --accent-red: #f85149;
            --border-color: #30363d;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
        
        body {
            font-family: 'Merriweather', Georgia, serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        header h1 {
            font-size: 1.8em;
        }
        
        .status-badge {
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-healthy { background: var(--accent-green); }
        .status-warning { background: var(--accent-yellow); color: #000; }
        .status-critical { background: var(--accent-red); }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
        }
        
        .card h2 {
            color: var(--accent-blue);
            margin-bottom: 15px;
            font-size: 1.2em;
        }
        
        .gpu-card {
            background: var(--bg-tertiary);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
        }
        
        .gpu-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .gpu-name { font-weight: bold; }
        .gpu-temp { color: var(--accent-yellow); }
        .gpu-temp.hot { color: var(--accent-red); }
        
        .progress-bar {
            background: var(--bg-secondary);
            border-radius: 4px;
            height: 8px;
            margin: 8px 0;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--accent-blue);
            transition: width 0.3s ease;
        }
        
        .progress-fill.warn { background: var(--accent-yellow); }
        .progress-fill.crit { background: var(--accent-red); }
        
        .metric-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .metric-label { color: var(--text-secondary); }
        .metric-value { font-weight: bold; }
        
        .alert-item {
            background: var(--bg-tertiary);
            border-left: 4px solid var(--accent-yellow);
            padding: 10px 15px;
            margin-bottom: 10px;
            border-radius: 0 8px 8px 0;
        }
        
        .alert-item.critical {
            border-color: var(--accent-red);
        }
        
        footer {
            text-align: center;
            padding: 20px;
            color: var(--text-secondary);
        }
        
        .refresh-timer {
            font-size: 0.9em;
            color: var(--text-secondary);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>Cluster Health Monitor</h1>
                <span class="refresh-timer">Auto-refresh: <span id="countdown">5</span>s</span>
            </div>
            <div id="status-badge" class="status-badge status-healthy">HEALTHY</div>
        </header>
        
        <div class="grid">
            <div class="card">
                <h2>GPU Status</h2>
                <div id="gpu-list">Loading...</div>
            </div>
            
            <div class="card">
                <h2>System</h2>
                <div id="system-info">Loading...</div>
            </div>
        </div>
        
        <div class="card">
            <h2>Alerts</h2>
            <div id="alerts-list">No active alerts</div>
        </div>
        
        <footer>
            <p>Cluster Health Monitor v1.0.0 | <span id="last-update">-</span></p>
        </footer>
    </div>
    
    <script>
        let countdown = 5;
        
        async function fetchStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                updateDashboard(data);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
        
        function updateDashboard(data) {
            // Update status badge
            const badge = document.getElementById('status-badge');
            badge.className = 'status-badge status-' + data.status;
            badge.textContent = data.status.toUpperCase();
            
            // Update GPUs
            const gpuList = document.getElementById('gpu-list');
            gpuList.innerHTML = data.metrics.gpus.map(gpu => {
                if (gpu.error) return `<div class="gpu-card">Error: ${gpu.error}</div>`;
                
                const util = gpu.utilization || 0;
                const memPct = gpu.memory_total > 0 ? (gpu.memory_used / gpu.memory_total * 100) : 0;
                const temp = gpu.temperature || 0;
                const tempClass = temp > 80 ? 'hot' : '';
                
                return `
                    <div class="gpu-card">
                        <div class="gpu-header">
                            <span class="gpu-name">GPU ${gpu.index}: ${gpu.name}</span>
                            <span class="gpu-temp ${tempClass}">${temp}°C</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Utilization</span>
                            <span class="metric-value">${util}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${util > 90 ? 'crit' : util > 70 ? 'warn' : ''}" 
                                 style="width: ${util}%"></div>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Memory</span>
                            <span class="metric-value">${(gpu.memory_used/1024).toFixed(1)}/${(gpu.memory_total/1024).toFixed(1)} GB</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${memPct > 90 ? 'crit' : memPct > 70 ? 'warn' : ''}" 
                                 style="width: ${memPct}%"></div>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Power</span>
                            <span class="metric-value">${(gpu.power || 0).toFixed(0)}W</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Update system info
            const sysInfo = document.getElementById('system-info');
            const sys = data.metrics.system;
            sysInfo.innerHTML = `
                <div class="metric-row">
                    <span class="metric-label">Hostname</span>
                    <span class="metric-value">${sys.hostname || 'N/A'}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">CPU</span>
                    <span class="metric-value">${(sys.cpu_percent || 0).toFixed(1)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${sys.cpu_percent || 0}%"></div>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Memory</span>
                    <span class="metric-value">${(sys.memory_used_gb || 0).toFixed(1)}/${(sys.memory_total_gb || 0).toFixed(1)} GB</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${sys.memory_percent || 0}%"></div>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Disk</span>
                    <span class="metric-value">${(sys.disk_used_gb || 0).toFixed(1)}/${(sys.disk_total_gb || 0).toFixed(1)} GB</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${sys.disk_percent || 0}%"></div>
                </div>
            `;
            
            // Update alerts
            const alertsList = document.getElementById('alerts-list');
            if (data.alerts && data.alerts.length > 0) {
                alertsList.innerHTML = data.alerts.map(alert => `
                    <div class="alert-item ${alert.severity}">
                        <strong>${alert.severity.toUpperCase()}</strong>: ${alert.message}
                    </div>
                `).join('');
            } else {
                alertsList.innerHTML = '<div style="color: var(--accent-green);">No active alerts</div>';
            }
            
            // Update last update time
            document.getElementById('last-update').textContent = 'Last update: ' + new Date().toLocaleTimeString();
        }
        
        function tick() {
            countdown--;
            document.getElementById('countdown').textContent = countdown;
            
            if (countdown <= 0) {
                countdown = 5;
                fetchStatus();
            }
        }
        
        // Initial fetch
        fetchStatus();
        
        // Start countdown timer
        setInterval(tick, 1000);
    </script>
</body>
</html>'''
