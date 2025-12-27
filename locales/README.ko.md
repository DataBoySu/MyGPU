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

## 갤러리

<details>

  <summary>
  웹 대시보드
  </summary>

  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- 첫 번째 이미지의 측비 1624x675를 사용하여 슬라이드 프레임 유지; 이미지는 object-fit:contain을 사용하여 내부에서 맞춤 -->
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

### 왜 이걸 사용해야 할까요?

- **가볍다**: 최소한의 리소스 발자국.
- **유연하다**: CLI 도구 또는 완전한 기능의 웹 대시보드로 실행 가능.
- **관리자 중심**: VRAM 강제 집행(한계를 초과하는 프로세스를 자동으로 종료) 및 감시 목록과 같은 기능 포함.
- **개발자 친화적**: GEMM, 입자 물리학 등 시스템 안정성을 검증하기 위한 내장 벤치마킹 및 스트레스 테스트 도구 제공.

## 기능

- **실시간 모니터링**
  - 상세한 GPU 지표 (사용률, VRAM, 전력, 온도)
  - 시스템 지표 (CPU, RAM 등)

- **관리 및 집행**
  - **VRAM 제한**: GPU당 VRAM 사용에 대한 하드 한계 설정
  - **자동 종료**: VRAM 정책을 위반하는 프로세스에 대해 자동으로 종료(관리자 전용)
  - **감시 목록**: 특정 PID 또는 프로세스 이름 모니터링

- **벤치마킹 및 시뮬레이션**
  - **스트레스 테스트**: 열적 쓰로틀링과 안정성을 테스트하기 위한 구성 가능한 GEMM 워크로드
  - **시각화 시뮬레이션**: 상호작용 3D 입자 물리학 시뮬레이션을 통해 GPU 부하 시각화

## 로드맵 및 미래 작업

기여 환영! 주요 미래 개발 사항은 다음과 같습니다:

- **다중 GPU 지원**: 다중 카드 설정과 NVLink 토폴로지에 대한 향상된 처리 기능.
- **컨테이너화**: 공식 Docker 지원으로 컨테이너 환경에서의 간편한 배포.
- **원격 액세스**: SSH 터널링 통합 및 안전한 원격 관리.
- **교차 플랫폼**:
  - [ ] 리눅스 지원 (Ubuntu/Debian 중점).
  - [ ] macOS 지원 (Apple Silicon 모니터링).
- **하드웨어 무관**:
  - [ ] AMD ROCm 지원.
  - [ ] Intel Arc 지원.
- ~~**다국어 문서화**: GitHub에서 가장 인기 있는 언어 지원.~~

참여 방법은 [CONTRIBUTING.md](../CONTRIBUTING.md)를 참조하세요.

## 요구 사항

- **운영 체제**: Windows 10/11
- **Python**: 3.10 이상
- **하드웨어**: NVIDIA GPU 및 설치된 드라이버
- **CUDA**: Toolkit 12.x (벤치마크/시뮬레이션 기능 사용 시 필수).
  - *참고*: CUDA 12.x가 감지되지 않으면 GPU 특정 벤치마크 기능이 비활성화됩니다.

## 설치

이 도구는 필요에 맞게 모듈식 설치를 지원합니다:

### 1. 최소한 (CLI 전용)

헤드리스 서버나 백그라운드 모니터링에 최적화.

- 명령줄 인터페이스.
- 기본 시스템/GPU 메트릭.

### 2. 표준 (CLI + 웹 UI)

대부분의 사용자들에게 최적화됨.

- 웹 대시보드 포함.
- REST API 엔드포인트.
- 실시간 차트.
- 하지만 시뮬레이션이나 벤치마크 기능은 없음.

### 3. 풀 (표준 + 시각화)

개발 및 스트레스 테스트에 가장 적합합니다.

- 시뮬레이션 포함.
- PyTorch/CuPy 벤치마킹을 위한 의존성.

### 빠른 시작

1. **다운로드** 최신 릴리스 또는 리포지토리 복제.
2. **설치 실행**:

```powershell
  .\setup.ps1
  ```

3. **시작**:

```powershell
# 웹 대시보드 시작 (표준/완전)
python health_monitor.py web

# CLI 시작
python health_monitor.py cli
```

## 라이선스

<license>MIT 라이선스. 자세한 내용은 [LICENSE](../LICENSE)을 참조하세요.</license>

