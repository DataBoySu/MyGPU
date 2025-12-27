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

## Galeria

<details>

  <summary>
    Dashboard Web
  </summary>

  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- Utilize a primeira imagem com proporção 1624x675 como estrutura de slide; as imagens se ajustarão usando object-fit:contain -->
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

### Por que usá-lo?

- **Leve**: Consumo mínimo de recursos.
- **Flexível**: Funciona como uma ferramenta CLI ou um Dashboard Web completo.
- **Focado no administrador**: Inclui recursos como **Aplicação de Políticas de VRAM** (desativação automática de processos que excedem limites) e **Listas de Observação**.
- **Amigável ao desenvolvedor**: Ferramentas integradas de benchmarking e teste de estresse (GEMM, Física de Partículas) para validar a estabilidade do sistema.

## Recursos

- **Monitoramento em Tempo Real:**
  - Métricas detalhadas de GPU (Utilização, VRAM, Potência, Temperatura).
  - Métricas do sistema (CPU, RAM, etc.).

- **Administração e Aplicação de Políticas:**
  - **Limites de VRAM:** Defina limites rígidos no uso de VRAM por GPU.
  - **Terminação Automática:** Termine automaticamente processos que violarem as políticas de VRAM (apenas para administradores).
  - **Listas de Monitoramento:** Monitore IDs específicos de processos (PIDs) ou nomes de processos.

- **Testes e Simulação:**
  - **Testes de Estresse:** Carga de trabalho configurável de GEMM para testar o throttling térmico e a estabilidade.
  - **Simulação Visual:** Simulação interativa de física de partículas 3D para visualizar a carga na GPU.

## Roadmap & Trabalhos Futuros

Contribuições são bem-vindas! Os principais pontos futuros a serem abordados incluem:

- **Suporte Multi-GPU**: Melhor gerenciamento para configurações de múltiplas placas e topologias NVLink.
- **Contêinerização**: Suporte oficial para Docker para implantação fácil em ambientes contêinerizados.
- **Acesso Remoto**: Integração de túneis SSH e gerenciamento remoto seguro.
- **Cross-Platform**:
  - [ ] Suporte a Linux (foco em Ubuntu/Debian).
  - [ ] Suporte a macOS (monitoramento de Apple Silicon).
- **Agnóstico de Hardware**:
  - [ ] Suporte a AMD ROCm.
  - [ ] Suporte a Intel Arc.
- ~~**Documentação Multi-Linguagem**: Suporte à maioria das linguagens populares do GitHub.~~

## Requisitos

- **Sistema Operacional**: Windows 10/11
- **Python**: Versão 3.10 ou superior
- **Hardware**: Placa de vídeo NVIDIA com drivers instalados.
- **CUDA**: Toolkit 12.x (Exigido especificamente para as funcionalidades de Benchmarking/Simulação).
  - *Observação: Se o CUDA 12.x não for detectado, as funcionalidades de benchmarking específicas da GPU serão desativadas.*

## Instalação

A ferramenta suporta instalação modular para atender às suas necessidades:

### 1. Mínimo (Interface de Linha de Comando Apenas)

Ideal para servidores sem interface gráfica ou monitoramento em segundo plano.

- Interface de linha de comando.
- Métricas básicas de sistema e GPU.

### 2. Padrão (CLI + Interface Web)

O ideal para a maioria dos usuários.

- Inclui Dashboard Web.
- Pontos de extremidade de API REST.
- Gráficos em tempo real.
- Sem Simulação ou benchmark.

### 3. Completo (Padrão + Visualização)

O mais adequado para desenvolvimento e testes de estresse.

- Inclui Simulação.
- Dependências PyTorch/CuPy para benchmarking.

### Início Rápido

1. **Baixe** a última versão ou clone o repositório.
2. **Execute o Setup**:

```powershell
  .\setup.ps1
  ```

**Lançamento:**

```powershell
# Inicie o painel web (Padrão/Completo)
python health_monitor.py web

# Inicie a interface de linha de comando (CLI)
python health_monitor.py cli
```

## Licença

Licença MIT. Veja o arquivo [LICENSE](../LICENSE) para detalhes.

