# Agent Documentation (AGENTS.md)

This document provides a technical overview of the **MyGPU** repository to assist LLM agents and developers in understanding the codebase structure, data flow, and implementation details.

---

## 🏗 Repository Structure

### Core Package: `monitor/`
The heart of the application, organized by responsibility:

- **`monitor/api/`**: The FastAPI-based web server.
  - `server.py`: Main API definition, WebSocket handling, and routing.
  - `templates/` & `static/`: Frontend assets (Vanilla JS, CSS, HTML).
- **`monitor/collectors/`**: Data acquisition layer.
  - `gpu.py`: NVIDIA/Apple Silicon GPU metric collection.
  - `system.py`: CPU, RAM, Disk, and Hostname info (via `psutil`).
  - `network.py`: Network interface statistics.
- **`monitor/benchmark/`**: Stress-testing and physics workloads.
  - `runner.py`: Orchestrates benchmark execution.
  - `physics_torch.py` / `gpu_setup.py`: PyTorch-based particle physics engine.
  - `workloads.py`: GEMM and other computational stress tests.
- **`monitor/storage/`**: Persistance layer.
  - `sqlite.py`: Manages the `metrics.db` SQLite database using a unified connector.
- **`monitor/alerting/`**: Alert engine and notifications.
  - `rules.py`: Threshold evaluation logic.
  - `toaster.py`: Cross-platform system notifications (Windows, Linux, macOS).
- **`monitor/utils/`**: Helper utilities.
  - `features.py`: Capability detection (CUDA, CuPy, PyTorch, Platform).

### External Entry Points
- **`health_monitor.py`**: The primary CLI entry point. Uses `click` for commands (`web`, `cli`, `benchmark`, `refresh`).
- **`setup.ps1` / `setup.sh`**: Cross-platform environment installers (uses `uv`).

---

## 🔄 Data Flow & Connectivity

1.  **Collection**: `health_monitor.py` starts a background thread or process that periodically triggers `collectors`.
2.  **Storage**: Collected metrics are passed to `monitor.storage.sqlite` and appended to the `metrics.db` file.
3.  **API Service**: `monitor.api.server` reads live data from memory (cached state) and historical data from the SQLite database.
4.  **Frontend**: The web dashboard polls the `/api/status` endpoint for live updates and uses WebSockets (`/ws/simulation`) for real-time benchmark visualization.
5.  **Alerting**: The `AlertEngine` evaluates every new metric sample against rules defined in `config.yaml`. If a threshold is hit, it triggers `toaster.py`.

---

## 🛠 Technology Stack

- **Backend**: Python 3.10+, FastAPI (Web Server), Click (CLI).
- **Frontend**: Vanilla JS (Dynamic UI), Chart.js (History graphs).
- **GPU Computing**: 
  - NVIDIA: `nvidia-ml-py` (NVML) for metrics, `CuPy` or `PyTorch` for benchmarks.
  - Apple Silicon: `psutil` and native commands for basic metrics.
- **Environment**: `uv` is the preferred package manager for virtual environments.

---

## 🤖 LLM Implementation Principles

When modifying this repository, please adhere to these guidelines:

1.  **Cross-Platform First**: Always consider Windows, Linux, and macOS. Use `platform.system()` and provide fallbacks.
2.  **Modular Collectors**: If adding a new metric, create a new file in `monitor/collectors/` and register it in the main loop within `health_monitor.py`.
3.  **Non-Blocking API**: API endpoints and WebSockets must remain non-blocking. Use `asyncio` for I/O and `threading` for compute-heavy benchmarks.
4.  **Graceful Degredation**: Ensure the dashboard works even if no GPU is detected (fall back to CPU metrics).
5.  **Database Integrity**: Use the existing `SQLiteManager` in `monitor/storage/sqlite.py` to ensure thread-safe database access.

---

## ⚠️ Known "Old" or Volatile Files
- **`old/`**: Contains legacy translation and utility scripts. These are preserved for reference but are not part of the runtime.
- **`metrics.db`**: Automatically generated. Can be safely deleted to reset history.
- **`.features_cache`**: Caches hardware detection results. Run `python health_monitor.py refresh` to clear.
