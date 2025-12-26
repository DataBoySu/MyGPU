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
</details>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli5.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli4.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli3.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli2.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
</details>
<details>
<summary>
</summary>
<div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web4.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web3.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
</div>
<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU logo"/>
</div>
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Version](https://img.shields.io/badge/version-1.2.3-blue)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)
<details>
<summary>
</summary>
<div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
<!-- Use first image aspect ratio 1624x675 for slide frame; images fit inside using object-fit:contain -->
<div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
<img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
</div>

## MyGPU: Ein leichtgewichtiges GPU-Verwaltungstool: Ein kompaktes `nvidia-smi`-Wrapper mit einer eleganten Web-Dashboard-Schnittstelle

**MyGPU** ist ein leichtgewichtiges Tool zur Verwaltung von GPUs, das als kompaktes `nvidia-smi`-Wrapper fungiert und über ein ansprechendes Web-Dashboard verfügt.

## Galerie

- **Web-Dashboard:** Ein intuitives und benutzerfreundliches Web-Interface zur Echtzeitüberwachung und Steuerung Ihrer GPUs.
- **CLI:** Ein leistungsstarkes Befehlszeilentool für Administratoren und Entwickler.
- **Funktionen:** VRAM-Begrenzung, automatische Beendigung überlasteter Prozesse, Watchlisten, Benchmarking- und Simulationswerkzeuge.

## Warum MyGPU?

- **Leichtgewichtig:** Minimale Ressourcenbelastung.
- **Flexibel:** Verfügbar als CLI-Tool oder mit einem umfassenden Web-Dashboard.
- **admin-zentriert:** Enthält Funktionen wie VRAM-Begrenzung, automatische Beendigung und Watchlisten.
- **entwicklerfreundlich:** Integrierte Benchmarking- und Stress-Test-Tools für die Systemstabilität.

## Funktionen

- **Echtzeitüberwachung:** Detaillierte Metriken zu GPU-Nutzung, VRAM, Stromverbrauch, Temperatur und Systemmetriken.
- **Admin- und Durchsetzungsfunktionen:**
  - **VRAM-Begrenzung:** Festlegen von Obergrenzen für VRAM-Verbrauch pro GPU.
  - **Automatische Beendigung:** Automatische Beendigung von Prozessen, die VRAM-Richtlinien verletzen (nur für Administratoren).
  - **Watchlisten:** Überwachen spezifischer PIDs oder Prozessnamen.
- **Benchmarking und Simulation:**
  - **Stress-Test:** Konfigurierbare GEMM-Lasten (Matrix-Matrix-Multiplikation) zum Testen der thermischen Throttling und Stabilität.
  - **Visuelle Simulation:** Interaktive 3D-Simulation zur Visualisierung der GPU-Belastung (Teilchenphysik).

## Roadmap und zukünftige Arbeiten

Ihre Beiträge sind willkommen! Zukünftige Schwerpunkte umfassen:

- **Multi-GPU-Unterstützung:** Verbesserte Handhabung von Multi-Card-Setups und NVLink-Topologien.
- **Containerisierung:** Offizielle Docker-Unterstützung für eine einfache Bereitstellung in Containerumgebungen.
- **Remote-Zugriff:** Integration von SSH-Tunneling und sicherer Remote-Verwaltung.
- **Plattformübergreifend:**
  - [ ] Linux-Unterstützung (Fokus auf Ubuntu/Debian).
  - [ ] macOS-Unterstützung (Apple Silicon-Überwachung).
- **Hardware-agnostisch:**
  - [ ] AMD ROCm-Unterstützung.
  - [ ] Intel Arc-Unterstützung.
- **Mehrsprachige Dokumentation:** Unterstützung der beliebtesten GitHub-Sprachen.

[CONTRIBUTING.md](../CONTRIBUTING.md) für Informationen zur Mitwirkung.

## Anforderungen

- **Betriebssystem:** Windows 10/11
- **Python:** 3.10+
- **Hardware:** NVIDIA-GPU mit installierten Treibern.
- **CUDA:** Toolkit 12.x (streng erforderlich für Benchmarking/Simulation-Funktionen).
  - *Hinweis: Wenn CUDA 12.x nicht erkannt wird, werden GPU-spezifische Benchmarking-Funktionen deaktiviert.*

## Installation

MyGPU bietet verschiedene Installationsoptionen, die auf Ihre Bedürfnisse zugeschnitten sind:

### 1. Minimal (CLI nur)

Ideal für Headless-Server oder Hintergrundüberwachung.

- Befehlszeileninterface.
- Grundlegende System- und GPU-Metriken.

### 2. Standard (CLI + Web-UI)

Ideal für die meisten Benutzer.

- Enthält Web-Dashboard.
- REST-API-Endpunkte.
- Echtzeit-Charts.

### 3. Vollständig (Standard + Visualisierung)

Ideal für Entwicklung und Stress-Test.

- Enthält Partikelsimulation.
- Abhängigkeiten für PyTorch/CuPy-Benchmarking.

### Schnelle Startanleitung

1. **Herunterladen:** Die neueste Version herunterladen oder das Repository klonen.
2. **Einrichten:**

   ```powershell
   .\setup.ps1
   ```

3. **Starten:**

```powershell
# Web-Dashboard (Standard/Vollständig) starten
python health_monitor.py web

# CLI starten
python health_monitor.py cli
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Die Einzelheiten finden Sie in der [LICENSE](../LICENSE)-Datei.