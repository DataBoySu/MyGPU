<!-- HTML_BLOCK:1... -->

<div align="center">
  <a href="../README.md">🇺🇸 English</a> |
  <a href="../locales/README.de.md">🇩🇪 Deutsch</a> |
  <a href="../locales/README.fr.md">🇫🇷 Français</a> |
  <a href="../locales/README.es.md">🇪🇸 Español</a> |
  <a href="../locales/README.ja.md">🇯🇵 日本語</a> |
  <a href="../locales/README.zh.md">🇨🇳 中文</a> |
  <a href="../locales/README.pt.md">🇵🇹 Português</a> |
  <a href="../locales/README.ko.md">🇰🇷 한국어</a> |
  <a href="../locales/README.hi.md">🇮🇳 हिंदी</a>
</div>

<!-- HTML_BLOCK:2... -->

<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU logo"/>
</div>

<!-- HTML_BLOCK:... -->

> *MyGPU: Lightweight GPU Management Utility: a compact `nvidia-smi` wrapper with an elegant web dashboard.*
<!-- HTML_BLOCK: no change to url; output entire as it is... -->
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Version](https://img.shields.io/badge/version-1.2.3-blue)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## Galerie

<details>
  <summary>Web-Dashboard</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- Verwende das erste Bild mit dem Seitenverhältnis 1624x675 als Rahmen für die Folie; Bilder passen sich innerhalb mit object-fit:contain an -->
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web3.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web4.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
  </div>
</details>

<details>
  <summary>CLI</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">

  <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
  </div>
  <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli3.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli4.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli5.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
</details>

### Warum sollte man dies nutzen?

- **Leichtgewichtig**: Minimale Ressourcenbelastung.
- **Flexibel**: Als CLI-Tool oder als umfassende Web-Anwendung einsetzbar.
- **admin-zentriert**: Enthält Funktionen wie **VRAM-Verschärfung** (Automatisches Beenden von Prozessen, die die Grenzen überschreiten) und **Watchlists**.
- **Entwicklerfreundlich**: Integrierte Benchmarking- und Stress-Test-Tools (GEMM, Teilchenphysik) zur Überprüfung der Systemstabilität.

## Funktionen

- **Echtzeitüberwachung**:
  - Detaillierte GPU-Metriken (Nutzung, VRAM, Stromverbrauch, Temperatur).
  - Systemmetriken (CPU, RAM usw.).

- **Verwaltung und Durchsetzung**:
  - **VRAM-Begrenzungen**: Setzen von Festwerten für die VRAM-Nutzung pro GPU.
  - **Automatische Beendigung**: Automatische Beendigung von Prozessen, die VRAM-Richtlinien verletzen (nur Administrator).
  - **Watchlists**: Überwachung spezifischer PIDs oder Prozessnamen.

- **Benchmarking und Simulation**:
  - **Stresstests**: Konfigurierbare GEMM-Lasten zur Prüfung der thermischen Drosselung und Stabilität.
  - **Visuelle Simulation**: Interaktive 3D-Partikelphysiksimulation zur Visualisierung der GPU-Belastung.

## Roadmap & Zukünftige Arbeiten

Wir freuen uns über Beiträge! Die Hauptpunkte, die in Zukunft behandelt werden sollen, sind:

- **Unterstützung für mehrere GPUs**: Verbesserte Handhabung von Multi-Card-Einrichtungen und NVLink-Topologien.
- **Containerisierung**: Offizielle Docker-Unterstützung für eine einfache Bereitstellung in Containerumgebungen.
- **Fernzugriff**: Integration von SSH-Tunneln und sichere Fernverwaltung.
- **Plattformübergreifend**:
  - [ ] Linux-Unterstützung (Ubuntu/Debian im Fokus).
  - [ ] macOS-Unterstützung (Apple Silicon-Überwachung).
- **Hardwareunabhängig**:
  - [ ] AMD ROCm-Unterstützung.
  - [ ] Intel Arc-Unterstützung.
- **Mehrsprachige Dokumentation**: Unterstützung der beliebtesten GitHub-Sprachen (entfernt).

Siehe [CONTRIBUTING.md](../CONTRIBUTING.md) für Informationen, wie du dich einbringen kannst.

## Anforderungen

- **Betriebssystem**: Windows 10/11
- **Python**: 3.10+
- **Hardware**: NVIDIA-GPU mit installierten Treibern.
- **CUDA**: Toolkit 12.x (Für die Funktionen zur Leistungsanalyse/Simulation streng erforderlich).
  - *Hinweis: Wenn CUDA 12.x nicht erkannt wird, werden die GPU-spezifischen Funktionen zur Leistungsanalyse deaktiviert.*

## Installation

Das Tool unterstützt eine modulare Installation, um sich an Ihre Anforderungen anzupassen:

### 1. Minimal (Nur CLI)

Am besten für Headless-Server oder Hintergrundüberwachung geeignet.

- Befehlszeilenschnittstelle.
- Grundlegende System-/GPU-Metriken.

### 2. Standard (CLI + Web-UI)

Am besten für die meisten Benutzer geeignet.

- Enthält Web-Dashboard.
- REST-API-Endpunkte.
- Echtzeit-Diagramme.
- Aber keine Simulation oder Benchmarking.

### 3. Vollständig (Standard + Visualisierung)

Am besten für Entwicklung und Stresstests geeignet.

- Enthält Simulation.
- Abhängigkeiten von PyTorch/CuPy für Benchmarking.

### Schnellstart

1. **Herunterladen** der neuesten Version oder Klonen des Repositories.
2. **Einrichten** ausführen:

```powershell
  .\setup.ps1
  ```

## 3. **Starten**:

```powershell
# Web-Dashboard starten (Standard/Vollständig)
python health_monitor.py web

# CLI starten
python health_monitor.py cli
```

## Lizenz

MIT-Lizenz. Details finden Sie in der Datei [LICENSE](../LICENSE).

