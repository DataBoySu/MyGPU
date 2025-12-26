# MyGPU: Utilitário de Gerenciamento de GPU Leve: um Wrapper Compacto para `nvidia-smi` com um Dashboard Web Limpo

> *MyGPU: Um utilitário de gerenciamento de GPU leve, com um wrapper compacto para `nvidia-smi` e um dashboard web intuitivo.*

![Licença](https://img.shields.io/badge/licença-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Versão](https://img.shields.io/badge/versão-1.2.3-blue)
![Plataforma](https://img.shields.io/badge/plataforma-Windows-lightgrey)
![CUDA 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## Galeria

### Dashboard Web

<details>
  <summary>Dashboard Web</summary>
  <div style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <!-- Use first image for aspect ratio to ensure proper framing -->
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web1.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web2.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web3.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web4.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  </div>
</details>

### CLI

<details>
  <summary>CLI</summary>
  <div style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/cli1.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/cli2.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/cli3.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/cli4.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/cli5.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  </div>
</details>

### Por que usar este utilitário?

- **Leveza**: Pés no chão em termos de uso de recursos.
- **Flexibilidade**: Funciona como uma ferramenta CLI, um serviço em segundo plano ou um dashboard web completo.
- **Foco no Administrador**: Inclui recursos como **Limites de VRAM** (desligar processos que excedem os limites) e **Listas de Observação**.
- **Amigável para Desenvolvedores**: Ferramentas de teste e simulação integradas (GEMM, Física de Partículas) para validar a estabilidade do sistema.

---

## Recursos

- **Monitoramento em Tempo Real**:
  - Métricas detalhadas da GPU (Utilização, VRAM, Potência, Temperatura).
  - Métricas do sistema (CPU, RAM, etc.).

- **Administração e Aplicação de Políticas**:
  - **Limites de VRAM**: Defina limites rígidos de uso de VRAM por GPU.
  - **Desligar Automaticamente**: Desligue automaticamente processos que violem as políticas de VRAM (apenas para administradores).
  - **Listas de Observação**: Monitore PIDs ou nomes de processos específicos.

- **Testes e Simulações**:
  - **Testes de Estresse**: Crie cargas de trabalho GEMM configuráveis para testar a estabilidade térmica e o desempenho.
  - **Simulação Visual**: Simulação interativa de física de partículas para visualizar a carga de trabalho da GPU.

---

## Roadmap e Trabalho Futuro

Contribuições são bem-vindas! Os principais pontos futuros a serem abordados incluem:

- **Suporte Multi-GPU**: Melhoria no manuseio de configurações multi-cartão e topologias NVLink.
- **Containerização**: Suporte oficial do Docker para implantação fácil em ambientes contêinerizados.
- **Acesso Remoto**: Integração de túnel SSH e gerenciamento remoto seguro.
- **Plataformas Cruzadas**:
  - [ ] Suporte a Linux (foco em Ubuntu/Debian).
  - [ ] Suporte a Apple Silicon para monitoramento.
- **Hardware Agnóstico**:
  - [ ] Suporte a AMD ROCm.
  - [ ] Suporte a Intel Arc.

Consulte [CONTRIBUTING.md](../CONTRIBUTING.md) para saber como contribuir.

---

## Requisitos

- **Sistema Operacional**: Windows 10/11
- **Python**: 3.10+
- **Hardware**: GPU NVIDIA com drivers instalados.
- **CUDA**: Versão 12.x (estritamente necessária para recursos de teste e simulação).
  - *Observação: Se a CUDA 12.x não for detectada, os recursos de teste e simulação serão desabilitados.*

---

## Instalação

O utilitário oferece opções de instalação modular para atender às suas necessidades:

### 1. Instalação Mínima (CLI apenas)

Ideal para servidores sem cabeça ou monitoramento em segundo plano.

- Interface de linha de comando.
- Monitoramento básico do sistema e da GPU.

### 2. Instalação Padrão (CLI + Dashboard Web)

Ideal para a maioria dos usuários.

- Inclui o Dashboard Web.
- Endpoints de API REST.
- Gráficos em tempo real.

### 3. Instalação Completa (Padrão + Simulação)

Ideal para desenvolvimento e testes de estresse.

- Inclui Simulação de Partículas.
- Dependências do PyTorch/CuPy para testes de benchmark.

### Instalação Rápida

1. **Baixe** a versão mais recente ou clone o repositório.
2. **Execute o script de configuração**:

  ```powershell
  .\setup.ps1
  ```

3. **Inicie**:

```powershell
# Inicie o dashboard web (Padrão/Completa)
python health_monitor.py web

# Inicie o CLI
python health_monitor.py cli
```