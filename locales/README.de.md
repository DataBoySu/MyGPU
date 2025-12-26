# MyGPU: Ein leichtgewichtiges GPU-Management-Tool

*MyGPU: Ein kompaktes `nvidia-smi`-Wrapper mit einer eleganten Web-Dashboard-Schnittstelle.*

## Galerie

<details>
  <summary>Web-Dashboard</summary>
  <div style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <!-- Bilder mit 16:9-Aspektverhältnis verwenden und mit "object-fit: contain" anpassen -->
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web1.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web2.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <!-- Weitere Bilder hier einfügen -->
  </div>
</details>
<details>
  <summary>CLI</summary>
  <div style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/cli1.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <!-- Weitere CLI-Bilder hier einfügen -->
  </div>
</details>

## Warum MyGPU?

- **Leichtgewichtig**: Geringer Ressourcenbedarf.
- **Flexibel**: Verfügbar als CLI-Tool oder voll ausgestattetes Web-Dashboard.
- **adminorientiert**: Enthält Funktionen wie **VRAM-Beschränkungen** (Automatische Beendigung von Prozessen, die die Grenzen überschreiten) und **Watchlisten**.
- **Entwicklerfreundlich**: Integrierte Benchmark- und Stresstest-Tools (GEMM, Teilchenphysik) zur Überprüfung der Systemstabilität.

---

## Funktionen

- **Echtzeitüberwachung**:
  - Detaillierte GPU-Metriken (Nutzung, VRAM, Leistung, Temperatur).
  - Systemmetriken (CPU, RAM usw.).

- **Admin- und Durchsetzungsfunktionen**:
  - **VRAM-Limits**: Festlegen von Obergrenzen für die VRAM-Nutzung pro GPU.
  - **Automatische Beendigung**: Automatische Beendigung von Prozessen, die VRAM-Richtlinien verletzen (nur für Administratoren).
  - **Watchlisten**: Überwachen spezifischer PIDs oder Prozessnamen.

- **Benchmarking und Simulation**:
  - **Stresstest**: Konfigurierbare GEMM-Lasten für die Überprüfung der thermischen Throtting und Stabilität.
  - **Interaktive Simulation**: Visuelle 3D-Teilchenphysik-Simulation zur Visualisierung der GPU-Belastung.

---

## Roadmap und zukünftige Arbeiten

Beiträge sind willkommen! Die folgenden Punkte sollen in Zukunft abgedeckt werden:

- **Multi-GPU-Unterstützung**: Verbesserte Handhabung von Multi-Card-Setups und NVLink-Topologien.
- **Containerisierung**: Offizielle Docker-Unterstützung für eine einfache Bereitstellung in Containerumgebungen.
- **Remote-Zugriff**: SSH-Tunneling-Integration und sichere Remoteverwaltung.
- **Plattformübergreifend**:
  - [ ] Linux-Unterstützung (Ubuntu/Debian-Fokus).
  - [ ] macOS-Unterstützung (Apple Silicon-Überwachung).
- **Hardware-agnostisch**:
  - [ ] AMD ROCm-Unterstützung.
  - [ ] Intel Arc-Unterstützung.
- ~~**Mehrsprachige Dokumentation**: Unterstützung der beliebtesten GitHub-Sprachen.~~

Siehe [CONTRIBUTING.md](../CONTRIBUTING.md) für Informationen zur Mitwirkung.

---

## Anforderungen

- **Betriebssystem**: Windows 10/11
- **Python**: 3.10+
- **Hardware**: NVIDIA-GPU mit installierten Treibern.
- **CUDA**: Toolkit 12.x (Streng genommen für Benchmarking- und Simulationsfunktionen erforderlich).
  - *Hinweis: Wenn CUDA 12.x nicht erkannt wird, werden GPU-spezifische Benchmarking-Funktionen deaktiviert.*

---

## Installation

Das Tool bietet verschiedene Installationsoptionen:

### 1. Minimal (CLI nur)

Am besten für Headless-Server oder Hintergrundüberwachung geeignet.

- Befehlszeileninterface.
- Grundlegende System- und GPU-Metriken.

### 2. Standard (CLI + Web-UI)

Am besten für die meisten Benutzer geeignet.

- Enthält Web-Dashboard.
- REST-APIs.
- Echtzeitdiagramme.

### 3. Vollständig (Standard + Visualisierung)

Am besten für Entwicklung und Stresstest geeignet.

- Enthält Teilchenphysik-Simulation.
- Abhängigkeiten für PyTorch/CuPy zur Benchmarking.

### Schnelle Startanleitung

1. **Laden** Sie die neueste Version herunter oder klonen Sie das Repository.
2. **Einrichten**:

   ```powershell
   .\setup.ps1
   ```

3. **Starten**:

```powershell
# Starten Sie das Web-Dashboard (Standard/Vollständig)
python health_monitor.py web

# Starten Sie die CLI
python health_monitor.py cli
```