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

## MyGPU: Utilidade de Gerenciamento de GPU Leve: um Wrapper Compacto para nvidia-smi com um Dashboard Web Elegante

**MyGPU** é uma ferramenta de gerenciamento de GPU leve, que oferece um wrapper compacto para o `nvidia-smi` e um dashboard web elegante para monitoramento e controle de GPUs NVIDIA.

## Galeria

- **Dashboard Web:** Uma interface web intuitiva para visualizar e gerenciar suas GPUs.
- **CLI:** Modo de linha de comando para execução de tarefas e monitoramento silencioso.
- **Funcionalidades:**
  - Monitoramento em tempo real de métricas de GPU e sistema.
  - Enforcamento de administração: limites de VRAM, término automático de processos e listas de observação.
  - Ferramentas de benchmark e simulação: testes de estresse com GEMM e simulação de física de partículas para visualização de carga de GPU.

## Por que usar o MyGPU?

- **Leve:** Pés leves, com baixa pegada de recursos.
- **Flexível:** Disponível como ferramenta CLI ou com um dashboard web completo.
- **Orientado a administração:** Inclui recursos como VRAM Enforcement, listas de observação e monitoramento de PIDs específicos.
- **Amigável para desenvolvedores:** Ferramentas integradas para benchmark e teste de estabilidade, como GEMM e simulação de física de partículas.

## Recursos

- **Monitoramento em tempo real:**
  - Métricas detalhadas de GPU (utilização, VRAM, potência, temperatura).
  - Monitoramento de métricas do sistema (CPU, RAM, etc.).
- **Administração e Enforcamento:**
  - **Limites de VRAM:** Defina limites rígidos de uso de VRAM por GPU.
  - **Término automático:** Termine automaticamente processos que violarem as políticas de VRAM (apenas para administradores).
  - **Listas de observação:** Monitore PIDs ou nomes de processos específicos.
- **Benchmarking e Simulação:**
  - **Testes de estresse:** Crie cargas de trabalho GEMM configuráveis para testar a estabilidade térmica e o desempenho.
  - **Simulação visual:** Interativa simulação de física de partículas para visualizar a carga da GPU.

## Roadmap e Trabalho Futuro

Contribuições são bem-vindas! Os principais pontos a serem abordados incluem:

- **Suporte Multi-GPU:** Melhoria no manuseio de configurações multi-card e topologias NVLink.
- **Containerização:** Suporte oficial para Docker para implantação fácil em ambientes contêineres.
- **Acesso remoto:** Integração de túnel SSH e gerenciamento remoto seguro.
- **Plataformas cruzadas:**
  - Suporte para Linux (foco em Ubuntu/Debian).
  - Suporte para Apple Silicon (monitoramento).
- **Hardware agnóstico:**
  - Suporte para AMD ROCm.
  - Suporte para Intel Arc.
- **Documentação em múltiplos idiomas:** (em revisão)

Veja o [CONTRIBUTING.md](../CONTRIBUTING.md) para saber como contribuir.

## Requisitos

- **Sistema operacional:** Windows 10/11
- **Python:** 3.10+
- **Hardware:** GPU NVIDIA com drivers instalados.
- **CUDA:** Versão 12.x do Toolkit (obrigatório para recursos de benchmark e simulação).

## Instalação

A ferramenta oferece opções de instalação modular para atender às suas necessidades:

### 1. Mínimo (apenas CLI)

Ideal para servidores sem cabeça ou monitoramento em segundo plano.

- Interface de linha de comando.
- Métricas básicas do sistema e da GPU.

### 2. Padrão (CLI + Dashboard Web)

Ideal para a maioria dos usuários.

- Inclui dashboard web.
- Pontos de extremidade da API REST.
- Gráficos em tempo real.

### 3. Completo (Padrão + Simulação)

Ideal para desenvolvimento e testes de estresse.

- Inclui simulação de física de partículas.
- Dependências de PyTorch/CuPy para benchmarking.

### Início rápido

1. **Baixe** a versão mais recente ou clone o repositório.
2. **Configuração:**

   ```powershell
   .\setup.ps1
   ```

3. **Inicie:**

```powershell
# Inicie o dashboard web (Padrão/Completo)
python health_monitor.py web

# Inicie o CLI
python health_monitor.py cli
```