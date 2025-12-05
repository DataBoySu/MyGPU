# Cluster Health Monitor

A lightweight, real-time monitoring tool for NVIDIA GPUs. Track GPU utilization, memory, temperature, and power during ML training or any GPU workload.

## System Requirements

### Hardware

- NVIDIA GPU (GeForce, RTX, Quadro, Tesla, etc.)

### Software

- Windows 10/11 or Linux (Ubuntu 18.04+)
- Python 3.8 or higher
- NVIDIA Driver 450.0 or higher

### Verify Your Setup

Before installing, confirm your GPU is detected:

```bash
nvidia-smi
```

You should see your GPU listed with driver version. If this command fails, install NVIDIA drivers first.

## Installation

### Step 1: Clone the Repository

```git
git clone https://github.com/DataBoySu/cluster-monitor.git
cd cluster-monitor
```

### Step 2: Create Virtual Environment

Windows:

```python
python -m venv venv
venv\Scripts\activate
```

Linux/macOS:

```python
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```python
pip install -r requirements.txt
```

### Step 4: Verify Installation

```python
python health_monitor.py --once
```

This should print your GPU information once and exit.

## Usage

### CLI Dashboard (Terminal)

Live monitoring in your terminal with auto-refresh:

```python
python health_monitor.py --cli
```

Press Ctrl+C to exit.

### Single Snapshot

Print GPU info once and exit:

```python
python health_monitor.py --once
```

### Web Dashboard (Optional)

Start a web server with browser-based dashboard:

```python
python health_monitor.py --web --port 8888
```

Then open <http://localhost:8888> in your browser.

## What You See

The monitor displays:

- GPU utilization (%)
- Memory usage (used/total GB)
- Temperature (C)
- Power draw (W)
- CPU and RAM usage (system)

## Configuration

Edit `config.yaml` to customize:

```yaml
monitoring:
  interval_seconds: 5    # How often to refresh

alerts:
  gpu_temperature_warn: 80     # Warn at 80C
  gpu_temperature_critical: 90 # Critical at 90C
```

## Troubleshooting

### "No NVIDIA GPU detected"

- Run `nvidia-smi` to verify driver is installed
- Make sure you have a discrete NVIDIA GPU (not Intel/AMD integrated)

### "pynvml not found" or "ModuleNotFoundError"

- Make sure virtual environment is activated
- Run: `pip install pynvml`

### "rich not found"

- Run: `pip install rich`

### Web dashboard not loading

- Install web dependencies: `pip install fastapi uvicorn`
- Check if port 8080 is available

### High CPU usage

- Increase refresh interval in config.yaml

## Dependencies

- pynvml - NVIDIA GPU metrics
- psutil - System metrics (CPU, RAM, disk)
- pyyaml - Configuration file parsing
- click - Command line interface
- rich - Terminal UI
- fastapi - REST API
- uvicorn - Web server

## License

MIT License
