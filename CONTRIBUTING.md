# Contributing to MyGPU

First off, thanks for taking the time to go through my project!

This project started as a personal tool for monitoring my local GPU setup, while I play with the AI models. It has grown into a lightweight, "nvidia-smi wrapper on steroids" that makes it easy to manage GPUs, for developers and researchers.

All contributions are welcome, bug fixes, new features, documentation improvements, and more.

## Getting Started

### Prerequisites

- **OS**: Windows 10/11
- **Python**: 3.10+
- **CUDA**: Toolkit 12.x (required for GPU benchmarking features).

### Two ways to get started

Choose one of the options below — both end with running the included `setup.ps1` to prepare the environment.

Option A — Install from Releases (ZIP)
-------------------------------------

1. Download the latest release ZIP from the Releases page: https://github.com/yourusername/mygpu/releases
2. Extract the ZIP to a local folder.
3. Open PowerShell, `cd` into the extracted folder and run:

```powershell
# from the extracted release folder
.\setup.ps1
```

Option B — Clone the repository (for development)
-----------------------------------------------

1. Clone the repository and `cd` into it:

```bash
git clone https://github.com/yourusername/mygpu.git
cd mygpu
```

2. Run the setup script to install dependencies and prepare the environment:

```powershell
.\setup.ps1
```

After `setup.ps1` completes, run the web dashboard or CLI as described below.

## Branching & Commit Guidelines

   - Branch from `main` for new work: `git checkout -b feat/short-description` or `fix/short-description`.
   - Keep commits small and focused. Use clear commit messages (imperative present tense):

     `Add VRAM cap enforcement for per-process watchlist`

   - Rebase or squash when appropriate before opening a PR to keep history tidy.

## Pull Requests

   1. Push your branch to your fork and open a Pull Request against `DataBoySu/Local-GPUMonitor:main`.
   2. In the PR description include:
      - A short summary of the change/with images if possible.
      - Motivation and any relevant issue links.
      - Testing steps to reproduce or verify the change.

## Code Style & Tests

   - Python: follow PEP 8 and use type hints where appropriate.
   - JavaScript: keep vanilla JS simple and modular. Follow consistent indentation and naming.

## Running Locally (developer tips)

   - To run the web server with auto-reload during development, use your editor's Python run configuration or run with `watchdog`/`honcho` if you add it.
   - For debugging GPU collectors on non-GPU machines, mock or stub out GPU calls (see `monitor/collectors` for structure).

## Communication, Reporting Issues & Security

   - Use GitHub Discussions for general conversation and design proposals: <https://github.com/DataBoySu/Local-GPUMonitor/discussions/9>
   - Open issues for bugs, feature requests, and design discussions
   - For sensitive security issues, please contact the repository owner directly instead of opening a public issue.

## License

   This project is distributed under the MIT License. See `LICENSE` for details.

   With your help, I would like to keeps this project useful and evolving.
