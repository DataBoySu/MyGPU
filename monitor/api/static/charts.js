// charts.js - Live benchmark charts using Apache ECharts
function initLiveCharts() {
    const datasets = [
        { id: 'chartUtilization', color: '#76b900', name: 'Utilization', unit: '%' },
        { id: 'chartTemperature', color: '#ffb300', name: 'Temperature', unit: '°C' },
        { id: 'chartMemory', color: '#00a0ff', name: 'Memory', unit: 'MB' },
        { id: 'chartPower', color: '#ff4d4d', name: 'Power', unit: 'W' }
    ];

    datasets.forEach(d => {
        const chartDom = document.getElementById(d.id);
        if (benchCharts[d.id]) {
            benchCharts[d.id].dispose();
        }
        const chart = echarts.init(chartDom, 'dark');

        const option = {
            backgroundColor: 'transparent',
            grid: { top: 10, bottom: 25, left: 45, right: 10 },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: Array(60).fill(''),
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false }
            },
            yAxis: {
                type: 'value',
                min: 0,
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
                axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 }
            },
            series: [{
                name: d.name,
                type: 'line',
                data: Array(60).fill(0),
                showSymbol: false,
                lineStyle: { color: d.color, width: 2 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: d.color + '44' },
                        { offset: 1, color: d.color + '00' }
                    ])
                },
                animation: false
            }]
        };

        chart.setOption(option);
        benchCharts[d.id] = chart;
    });

    window.addEventListener('resize', () => {
        Object.values(benchCharts).forEach(c => c && c.resize());
    });
}

function updateLiveCharts(sample) {
    if (!sample) return;
    const mappings = {
        chartUtilization: sample.utilization,
        chartTemperature: sample.temperature_c,
        chartMemory: sample.memory_used_mb,
        chartPower: sample.power_w
    };

    Object.keys(mappings).forEach(id => {
        const chart = benchCharts[id];
        if (chart) {
            const option = chart.getOption();
            const data = option.series[0].data;
            data.push(mappings[id]);
            if (data.length > 60) {
                data.shift();
            }
            chart.setOption({
                series: [{ data: data }]
            });
        }
    });
}
