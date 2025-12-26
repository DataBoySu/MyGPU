# MyGPU: Ein leichtgewichtiges GPU-Verwaltungstool – Ein kompaktes `nvidia-smi` Wrapper mit einer eleganten Web-Dashboard-Schnittstelle

## Galerie

<details>
  <summary>Web-Dashboard</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- Erstes Bild für den Slide-Rahmen verwenden; Bilder passen sich mit `object-fit: contain` ein -->
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
  </div>
</details>

## Warum MyGPU?

- **Leichtgewichtig**: Minimale Ressourcenbelastung.
- **Flexibel**: Als CLI-Tool oder Web-Dashboard einsetzbar.
- **Admin-zentriert**: Enthält Funktionen wie **VRAM-Enforcement** (Automatische Beendigung von Prozessen, die VRAM-Grenzen überschreiten) und **Watchlists**.
- **Entwicklerfreundlich**: Integrierte Benchmarking- und Stresstest-Tools (GEMM, Teilchenphysik) zur Validierung der Systemstabilität.

---

## Funktionen

- **Echtzeit-Überwachung**:
  - Detaillierte GPU-Metriken (Nutzung, VRAM, Leistung, Temperatur).
  - Systemmetriken (CPU, RAM, etc.).

- **Admin- und Durchsetzungsfunktionen**:
  - **VRAM-Grenzen**: Festlegen von VRAM-Nutzungsgrenzen pro GPU.
  - **Automatische Beendigung**: Automatische Beendigung von Prozessen, die VRAM-Richtlinien verletzen (nur für Administratoren).
  - **Watchlists**: Überwachen spezifischer PIDs oder Prozessnamen.

- **Benchmarking und Simulation**:
  - **Stresstest**: Konfigurierbare GEMM-Lasten (Generative Matrix-Multiplikation) zum Testen der thermischen Throtting und Stabilität.
  - **Visuelle Simulation**: Interaktive 3D-Teilchenphysik-Simulation zur Visualisierung der GPU-Belastung.

---

## Roadmap und zukünftige Arbeiten

Beiträge sind willkommen! Die wichtigsten zukünftigen Punkte umfassen:

- **Multi-GPU-Unterstützung**: Verbesserte Handhabung für Multi-Card-Setups und NVLink-Topologien.
- **Containerisierung**: Offizielle Docker-Unterstützung für eine einfache Bereitstellung in Containerumgebungen.
- **Remote-Zugriff**: SSH-Tunnel-Integration und sichere Remote-Verwaltung.
- **Plattformübergreifend**:
  - [ ] Linux-Unterstützung (Ubuntu/Debian-Fokus).
  - [ ] macOS-Unterstützung (Apple Silicon-Überwachung).
- **Hardware-agnostisch**:
  - [ ] AMD ROCm-Unterstützung.
  - [ ] Intel Arc-Unterstützung.
- ~~**Mehrsprachige Dokumentation**: Unterstützung der beliebtesten GitHub-Sprachen.~~

Siehe [CONTRIBUTING.md](../CONTRIBUTING.md) für Informationen, wie du dich einbringen kannst.

---

## Anforderungen

- **OS**: Windows 10/11
- **Python**: 3.10+
- **Hardware**: NVIDIA-GPU mit installierten Treibern.
- **CUDA**: Toolkit 12.x (Streng genommen für Benchmarking/Simulation-Funktionen erforderlich).
  - *Hinweis: Wenn CUDA 12.x nicht erkannt wird, werden GPU-spezifische Benchmarking-Funktionen deaktiviert.*

---

## Installation

Das Tool bietet eine modulare Installation, um Ihren Bedürfnissen gerecht zu werden:

### 1. Minimal (CLI nur)

Am besten für Headless-Server oder Hintergrundüberwachung geeignet.

- Befehlszeileninterface.
- Grundlegende System-/GPU-Metriken.

### 2. Standard (CLI + Web-UI)

Am besten für die meisten Benutzer geeignet.

- Enthält Web-Dashboard.
- REST-API-Endpunkte.
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