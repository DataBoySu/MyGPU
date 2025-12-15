// History module: load history charts, zoom/highlight plugins, and helpers
(function(){
    // State
    let historyChart = null;
    let historyOriginalLabels = [];
    let historyOriginalData = [];
    let historyVisibleStart = 0;
    let historyVisibleEnd = 0;
    let historyDayStarts = [];
    let historySelectedDay = null;

    function waitMs(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

    function ensureZoomPlugin() {
        try {
            if (typeof Chart === 'undefined') return;
            const regs = (Chart && Chart.registry && Chart.registry.plugins && Chart.registry.plugins.items) ? Chart.registry.plugins.items : null;
            if (regs && regs.some(p => p && p.id === 'zoom')) return;
            const candidate = window['chartjsPluginZoom'] || window['ChartZoom'] || window['chartjs-plugin-zoom'];
            if (candidate) {
                Chart.register(candidate);
                console.debug('chartjs zoom plugin registered at runtime');
            }
        } catch (e) { console.debug('ensureZoomPlugin error', e); }
    }

    function renderHistoryView(){ if (!historyChart) return; historyChart.update('none'); }

    function adjustZoom(factor) {
        const len = historyOriginalLabels.length;
        if (!len) return;
        const curLen = historyVisibleEnd - historyVisibleStart + 1;
        let newLen = Math.max(10, Math.round(curLen / factor));
        if (newLen >= len) { resetZoom(); return; }
        const center = Math.floor((historyVisibleStart + historyVisibleEnd)/2);
        let start = Math.max(0, center - Math.floor(newLen/2));
        let end = Math.min(len-1, start + newLen -1);
        if (end - start + 1 < newLen) start = Math.max(0, end - newLen +1);
        historyVisibleStart = start; historyVisibleEnd = end; renderHistoryView();
    }

    function resetZoom() { historyVisibleStart = 0; historyVisibleEnd = historyOriginalLabels.length-1; renderHistoryView(); }
    function zoomIn(){ adjustZoom(1.5); }
    function zoomOut(){ adjustZoom(1/1.5); }

    function highlightSelectedDay(val) {
        const idx = val === '' ? null : parseInt(val);
        historySelectedDay = isNaN(idx) ? null : idx;
        renderHistoryView();
    }

    async function loadHistory() {
        const metricEl = document.getElementById('metric-select');
        const hoursEl = document.getElementById('hours-select');
        const metric = metricEl ? metricEl.value : 'gpu_0_utilization';
        const hours = hoursEl ? hoursEl.value : '24';
        console.debug('history.loadHistory called', { metric, hours });

        try {
            const historyResponse = await fetch(`/api/history?metric=${metric}&hours=${hours}`);
            let historyData = await historyResponse.json();
            if (hours === 'lifetime' && (!historyData || !historyData.data || historyData.data.length === 0)) {
                try {
                    const fallbackHours = 24 * 365 * 5;
                    const resp2 = await fetch(`/api/history?metric=${metric}&hours=${fallbackHours}`);
                    if (resp2.ok) historyData = await resp2.json();
                } catch (e) {}
            }

            const canvas = document.getElementById('historyChart');
            if (!canvas) { console.debug('history.loadHistory: historyChart canvas not found'); return; }
            const ctx = canvas.getContext('2d');
            ensureZoomPlugin();
            if (historyChart) historyChart.destroy();

            const getUnit = (m) => {
                if (m.includes('utilization') || m.includes('percent')) return '%';
                if (m.includes('memory_used')) return 'MB';
                if (m.includes('temperature')) return '°C';
                if (m.includes('power')) return 'W';
                return '';
            }
            const unit = getUnit(metric);

            const points = (historyData.data || []).map(d => ({ t: new Date(d.timestamp).getTime(), y: d.value }));
            const labels = (historyData.data || []).map(d => new Date(d.timestamp).getTime());

            const firstTs = points.length ? points[0].t : Date.now();
            const lastTs = points.length ? points[points.length-1].t : Date.now();
            const rangeHours = (lastTs - firstTs) / (1000*60*60);
            const multiDay = rangeHours >= 24;

            const yAxisOptions = {
                ticks: { color: '#a0a0a0' },
                grid: { color: '#4a4a4a' },
                beginAtZero: true,
                title: { display: true, text: unit, color: '#a0a0a0', font: { size: 14, weight: 'bold' } }
            };
            if (metric.includes('utilization') || metric.includes('percent')) yAxisOptions.suggestedMax = 100;
            if (metric.includes('temperature')) yAxisOptions.suggestedMax = 100;

            const dayStarts = [];
            let prevDay = null;
            for (let i = 0; i < labels.length; i++) {
                const d = new Date(labels[i]);
                const day = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
                if (day !== prevDay) { dayStarts.push(i); prevDay = day; }
            }

            const dayBandPlugin = {
                id: 'dayBands',
                beforeDatasetsDraw: function(chart) {
                    if (!multiDay) return;
                    try {
                        const xScale = chart.scales.x;
                        const ctx = chart.ctx;
                        const dataLen = historyOriginalLabels.length;
                        if (dataLen === 0) return;
                        for (let j = 0; j < dayStarts.length; j++) {
                            const startIdx = dayStarts[j];
                            const endIdx = (j+1 < dayStarts.length) ? dayStarts[j+1]-1 : dataLen-1;
                            const startTs = historyOriginalLabels[startIdx];
                            const endTs = historyOriginalLabels[endIdx];
                            const left = xScale.getPixelForValue(startTs);
                            const right = xScale.getPixelForValue(endTs + 1);
                            const bandColor = (j % 2 === 0) ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
                            ctx.save(); ctx.fillStyle = bandColor; ctx.fillRect(left, chart.chartArea.top, Math.max(1, right-left), chart.chartArea.bottom - chart.chartArea.top); ctx.restore();
                        }
                    } catch(e) { console.debug('dayBandPlugin error', e); }
                }
            };

            historyOriginalLabels = labels.slice();
            historyOriginalData = points.map(p => p.y).slice();
            historyDayStarts = dayStarts.slice();
            historyVisibleStart = 0;
            historyVisibleEnd = historyOriginalLabels.length - 1;

            const highlightPlugin = {
                id: 'highlightDay',
                beforeDatasetsDraw: function(chart) {
                    if (historySelectedDay === null) return;
                    try {
                        const xScale = chart.scales.x;
                        const ctx = chart.ctx;
                        const len = historyOriginalLabels.length;
                        const sel = historySelectedDay;
                        if (sel < 0 || sel >= historyDayStarts.length) return;
                        const globalStartIdx = historyDayStarts[sel];
                        const globalEndIdx = (sel+1 < historyDayStarts.length) ? historyDayStarts[sel+1]-1 : len-1;
                        const globalStartTs = historyOriginalLabels[globalStartIdx];
                        const globalEndTs = historyOriginalLabels[globalEndIdx];
                        const left = xScale.getPixelForValue(globalStartTs);
                        const right = xScale.getPixelForValue(globalEndTs + 1);
                        if (right < chart.chartArea.left || left > chart.chartArea.right) return;
                        ctx.save(); ctx.fillStyle = 'rgba(0,160,255,0.12)'; ctx.fillRect(left, chart.chartArea.top, Math.max(1, right-left), chart.chartArea.bottom - chart.chartArea.top); ctx.restore();
                    } catch(e) { console.debug('highlightPlugin error', e); }
                }
            };

            historyChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: document.getElementById('metric-select').selectedOptions[0].text,
                        data: points.map(p => ({ x: p.t, y: p.y })),
                        borderColor: '#76b900',
                        backgroundColor: 'rgba(118, 185, 0, 0.08)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 2
                    }]
                },
                options: {
                    responsive: true,
                    interaction: { mode: 'nearest', intersect: false },
                    plugins: {
                        legend: { display: true, labels: { color: '#f0f0f0', font: { size: 14 } } },
                        zoom: { pan: { enabled: true, mode: 'x' }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, drag: { enabled: false }, mode: 'x' } }
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: { tooltipFormat: 'MMM d, yyyy HH:mm' },
                            ticks: { color: '#a0a0a0', maxRotation: 0, autoSkip: true },
                            grid: { color: '#4a4a4a' }
                        },
                        y: yAxisOptions
                    },
                    plugins: [dayBandPlugin, highlightPlugin]
                }
            });

            const canvas = document.getElementById('historyChart');
            canvas.onclick = function(evt) {
                try {
                    const pointsFound = historyChart.getElementsAtEventForMode(evt, 'nearest', { intersect: false }, true);
                    if (!pointsFound || pointsFound.length === 0) return;
                    const idx = pointsFound[0].index;
                    let sel = 0;
                    for (let j = 0; j < historyDayStarts.length; j++) {
                        if (historyDayStarts[j] <= idx) sel = j; else break;
                    }
                    historySelectedDay = sel;
                    historyChart.update('none');
                } catch (e) { console.debug('click highlight failed', e); }
            };
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }

    // expose API
    window.loadHistory = loadHistory;
    window.ensureZoomPlugin = ensureZoomPlugin;
    window.zoomIn = zoomIn;
    window.zoomOut = zoomOut;
    window.resetZoom = resetZoom;
    window.adjustZoom = adjustZoom;
    window.highlightSelectedDay = highlightSelectedDay;
    window.renderHistoryView = renderHistoryView;
})();
