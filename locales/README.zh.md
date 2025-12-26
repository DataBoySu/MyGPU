# MyGPU：轻量级GPU管理工具

*MyGPU是一个紧凑的`nvidia-smi`封装器，配有一个优雅的网络仪表盘。*

## 画廊

<details>
  <summary>网络仪表盘</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- 使用第一个图像的宽高比1624x675作为滑动框的框架；图像使用`object-fit:contain`填充 -->
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
  <summary>命令行界面 (CLI)</summary>
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

### 为什么使用这个工具？

- **轻量级**：资源占用最小。
- **灵活**：作为命令行工具或全功能网络仪表盘运行。
- **管理员友好**：包括**VRAM限制**（超出限制时自动终止进程）和**监控列表**等功能。
- **开发人员友好**：内置基准测试和压力测试工具（GEMM、粒子物理）来验证系统稳定性。

---

## 功能

- **实时监控**：
  - 详细的GPU指标（利用率、VRAM、功率、温度）。
  - 系统指标（CPU、内存等）。

- **管理员和强制执行**：
  - **VRAM限制**：为每个GPU设置VRAM使用硬限制。
  - **自动终止**：（仅管理员可操作）自动终止违反VRAM策略的进程（可自定义）。
  - **监控列表**：监控特定PID或进程名称。

- **基准测试和模拟**：
  - **压力测试**：配置可配置的GEMM工作负载以测试热量限制和稳定性。
  - **视觉模拟**：交互式粒子物理模拟以可视化GPU负载。

---

## 路线图和未来工作

欢迎贡献！主要未来要点如下：

- **多GPU支持**：增强多卡设置和NVLink拓扑的处理。
- **容器化**：官方Docker支持以方便在容器环境中部署。
- **远程访问**：SSH隧道集成和安全远程管理。
- **跨平台**：
  - [ ] Linux支持（Ubuntu/Debian重点）。
  - [ ] macOS支持（Apple Silicon监控）。
- **硬件无关**：
  - [ ] AMD ROCm支持。
  - [ ] Intel Arc支持。
- [ ] 多语言文档（支持GitHub上最受欢迎的语言）。

请参阅[CONTRIBUTING.md](../CONTRIBUTING.md)了解如何参与。

---

## 要求

- **操作系统**：Windows 10/11
- **Python**：3.10+
- **硬件**：NVIDIA GPU及其驱动程序。
- **CUDA**：12.x工具包（严格要求基准测试/模拟功能）。
  - *注意：如果未检测到CUDA 12.x，则GPU特定基准功能将被禁用。*

---

## 安装

工具支持模块化安装以适应您的需求：

### 1. 最小（仅命令行界面）

适用于无头服务器或后台监控。

- 命令行界面。
- 基本的系统/GPU指标。

### 2. 标准（命令行界面+网络仪表盘）

适用于大多数用户。

- 包括网络仪表盘。
- REST API端点。
- 实时图表。

### 3. 完整（标准+可视化）

适用于开发和压力测试。

- 包括粒子模拟。
- 用于基准测试的PyTorch/CuPy依赖。

### 快速开始

1. **下载**最新版本或克隆仓库。
2. **运行设置**：

   ```powershell
   .\setup.ps1
   ```

3. **启动**：

```powershell
# 启动网络仪表盘（标准/完整）
python health_monitor.py web

# 启动命令行界面
python health_monitor.py cli
```