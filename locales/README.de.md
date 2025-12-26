# Navigation Bar

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

# Logo

<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU logo"/>
</div>

## Zitat

*MyGPU: Ein leichtgewichtiges GPU-Management-Tool: Ein kompakter Wrapper für `nvidia-smi` mit einem eleganten Web-Dashboard.*

## Badges

![Lizenz](https://img.shields.io/badge/lizenz-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Version](https://img.shields.io/badge/version-1.2.3-blue)
![Plattform](https://img.shields.io/badge/plattform-Windows-lightgrey)
![CUDA 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## Galerie

### Web-Dashboard

<details>
  <summary>Web-Dashboard</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- Bilder passend zuschneiden, um das Rasterlayout beizubehalten -->
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <!-- Weitere Bilder hier einfügen -->
  </div>
</details>

<details>
  <summary>CLI</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <!-- Weitere CLI-Bilder hier einfügen -->
  </div>
</details>

## Warum MyGPU?

- **Leichtgewichtig**: Minimale Ressourcenbelastung.
- **Flexibel**: Verfügbar als CLI-Tool oder voll ausgestattetes Web-Dashboard.
- **admin-zentriert**: Enthält Funktionen wie VRAM-Enforcement und Watchlists.
- **Entwicklerfreundlich**: Integrierte Benchmarking- und Stresstest-Tools (GEMM, Teilchenphysik) zur Validierung der Systemstabilität.

---

## Funktionen

- **Echtzeit-Überwachung**:
  - Detaillierte GPU-Metriken (Nutzung, VRAM, Temperatur).
  - Systemmetriken (CPU, RAM, etc.).

- **Admin- und Durchsetzungsfunktionen**:
  - **VRAM-Limits**: Festlegen von VRAM-Nutzungsgrenzen pro GPU.
  - **Automatische Beendigung**: Automatische Beendigung von Prozessen, die VRAM-Richtlinien verletzen (nur für Administratoren).
  - **Watchlists**: Überwachen spezifischer PIDs oder Prozessnamen.

- **Benchmarking und Simulation**:
  - **Stresstest**: Konfigurierbare GEMM-Lasten zum Testen der thermischen Throtting und Stabilität.
  - **Visuelle Simulation**: Interaktive 3D-Teilchenphysik-Simulation zur Visualisierung der GPU-Belastung.

---

## Roadmap und zukünftige Arbeiten

Beiträge sind willkommen! Die wichtigsten zukünftigen Punkte umfassen:

- **Multi-GPU-Unterstützung**: Verbesserte Handhabung für Multi-Card-Setups und NVLink-Topologien.
- **Containerisierung**: Offizielle Docker-Unterstützung für eine einfache Bereitstellung in Containerumgebungen.
- **Remote-Zugriff**: SSH-Tunneling-Integration und sichere Remote-Verwaltung.
- **Plattformübergreifend**:
  - [ ] Linux-Unterstützung (Ubuntu/Debian-Fokus).
  - [ ] macOS-Unterstützung (Apple Silicon-Überwachung).
- **Hardware-agnostisch**:
  - [ ] AMD ROCm-Unterstützung.
  - [ ] Intel Arc-Unterstützung.
- ~~**Mehrsprachige Dokumentation**: Unterstützung der beliebtesten GitHub-Sprachen.~~

Siehe [CONTRIBUTING.md](../CONTRIBUTING.md) für Informationen, wie Sie sich einbringen können.

---

## Anforderungen

- **OS**: Windows 10/11
- **Python**: 3.10+
- **Hardware**: NVIDIA-GPU mit installierten Treibern.
- **CUDA**: Toolkit 12.x (Streng erforderlich für Benchmarking/Simulation-Funktionen).
  - *Hinweis: Wenn CUDA 12.x nicht erkannt wird, werden GPU-spezifische Benchmarking-Funktionen deaktiviert.*

---

## Installation

Das Tool unterstützt modulare Installationen, um Ihren Bedürfnissen gerecht zu werden:

### 1. Minimal (CLI nur)

Am besten für Headless-Server oder Hintergrundüberwachung geeignet.

- Befehlszeileninterface.
- Grundlegende System- und GPU-Metriken.

### 2. Standard (CLI + Web-UI)

Am besten für die meisten Benutzer geeignet.

- Enthält Web-Dashboard.
- REST-APIs.
- Echtzeit-Diagramme.
- Aber keine Simulation oder Benchmarking.

### 3. Vollständig (Standard + Visualisierung)

Am besten für Entwicklung und Stresstest geeignet.

- Enthält Simulation.
- Abhängigkeiten für PyTorch/CuPy für Benchmarking.

### Schnelle Startanleitung

1. **Herunterladen** der neuesten Version oder Klonen des Repos.
2. **Einrichten**:

   ```powershell
   .\setup.ps1
   ```

3. **Starten**:

```powershell
# Starten des Web-Dashboards (Standard/Vollständig)
python health_monitor.py web

# Starten der CLI
python health_monitor.py cli
```