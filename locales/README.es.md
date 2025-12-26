<div align="center">
  <a href="../README.md">inglés</a> |
  <a href="../README.de.md">alemán</a> |
  <a href="../README.fr.md">francés</a> |
  <a href="../README.es.md">español</a> |
  <a href="../README.ja.md">japonés</a> |
  <a href="../README.zh.md">chino</a> |
  <a href="../README.pt.md">portugués</a> |
  <a href="../README.ko.md">coreano</a> |
  <a href="../README.hi.md">hindi</a>
</div>

<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU logo"/>
</div>

> *MyGPU: Utilidad de gestión de GPU ligera: un envoltorio compacto de `nvidia-smi` con un tablero web limpio.*

![Licencia](https://img.shields.io/badge/licencia-MIT-azul.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-azul)
![Versión](https://img.shields.io/badge/versión-1.2.3-azul)
![Plataforma](https://img.shields.io/badge/plataforma-Windows-gris claro)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## Galería

<details>
  <summary>Tablero web</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- Utilice la relación de aspecto 1624x675 para el marco de la diapositiva; las imágenes se ajustan automáticamente con object-fit:contain -->
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

### ¿Por qué usar esto?

- **Ligero**: Pie de contacto mínimo con los recursos.
- **Flexible**: Se puede ejecutar como herramienta de línea de comandos, servicio en segundo plano o tablero web completo.
- **Orientado a administradores**: Incluye características como **restricciones de VRAM** (terminación automática de procesos que superen los límites) y **listas de vigilancia**.
- **Amigable con el desarrollador**: Herramientas integradas para pruebas de estrés y simulación (GEMM, física de partículas) para validar la estabilidad del sistema.

---

## Características

- **Monitoreo en tiempo real**:
  - Métricas detalladas de GPU (utilización, VRAM, potencia, temperatura).
  - Métricas del sistema (CPU, RAM, etc.).

- **Administración y aplicación de políticas**:
  - **Límites de VRAM**: Establezca límites duros en el uso de VRAM por GPU.
  - **Terminación automática**: Termine automáticamente los procesos que violen las políticas de VRAM (solo para administradores).
  - **Listas de vigilancia**: Monitoree procesos específicos o nombres.

- **Pruebas de rendimiento y simulación**:
  - **Pruebas de estrés**: Configure cargas de trabajo GEMM configurables para probar el throtting térmico y la estabilidad.
  - **Simulación visual**: Simulación de física de partículas interactiva para visualizar la carga de GPU.

---

## Roadmap y trabajo futuro

Las contribuciones son bienvenidas. Los puntos principales a cubrir serían:

- **Soporte multi-GPU**: Manejo mejorado para configuraciones multi-tarjeta y topologías NVLink.
- **Contenedorización**: Soporte oficial para Docker para una fácil implementación en entornos contenedorizados.
- **Acceso remoto**: Integración de túneles SSH y gestión remota segura.
- **Plataforma cruzada**:
  - [ ] Soporte para Ubuntu/Debian.
  - [ ] Soporte para Apple Silicon.
- **Independiente de hardware**:
  - [ ] Soporte para AMD ROCm.
  - [ ] Soporte para Intel Arc.

Consulte [CONTRIBUTING.md](../CONTRIBUTING.md) para saber cómo involucrarse.

---

## Requisitos

- **OS**: Windows 10/11
- **Python**: 3.10+
- **Hardware**: GPU de NVIDIA con controladores instalados.
- **CUDA**: Toolkit 12.x (Requerido estrictamente para las características de benchmarking/simulación).
  - *Nota: Si CUDA 12.x no se detecta, las características de benchmarking se desactivarán.*

---

## Instalación

La herramienta admite una instalación modular para adaptarse a sus necesidades:

### 1. Mínimo (solo CLI)

Ideal para servidores sin cabeza o monitoreo en segundo plano.

- Interfaz de línea de comandos.
- Métricas básicas del sistema y la GPU.

### 2. Estándar (CLI + Tablero web)

Ideal para la mayoría de los usuarios.

- Incluye el tablero web.
- Puntos finales de API REST.
- Gráficos en tiempo real.

### 3. Completo (Estándar + Visualización)

Ideal para desarrollo y pruebas de estrés.

- Incluye simulación de física de partículas.
- Dependencias de PyTorch/CuPy para benchmarking.

### Inicio rápido

1. **Descargue** la última versión o clone el repositorio.
2. **Ejecute el script de configuración**:

  ```powershell
  .\setup.ps1
  ```

3. **Inicie**:

```powershell
# Inicie el tablero web (Estándar/Completo)
python health_monitor.py web

# Inicie la CLI
python health_monitor.py cli
```