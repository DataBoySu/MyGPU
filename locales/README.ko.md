# MyGPU: GPU 관리 유틸리티 가벼운 버전: NVIDIA smi의 간소화된 랩핑과 청결한 웹 대시보드

## 소개

MyGPU는 NVIDIA GPU의 효율적인 관리를 위한 가벼운 도구입니다. 이 유틸리티는 컴팩트한 `nvidia-smi` 랩핑과 함께 깨끗한 웹 대시보드를 제공합니다.

## 기능

- **가벼운 설계**: 최소한의 리소스 사용.
- **유연성**: CLI 도구, 백그라운드 서비스, 또는 강력한 웹 대시보드로 실행 가능.
- **관리자 중심**: VRAM 제한 설정, 자동 종료 기능, 모니터링 목록 제공.
- **개발자 친화적**: GEMM, 입자 물리학 시뮬레이션과 같은 내장 벤치마크 및 스트레스 테스트 도구를 통해 시스템 안정성 검증.

## 갤러리

### 웹 대시보드

<details>
  <summary>웹 대시보드</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <!-- 추가 이미지... -->
  </div>
</details>

### CLI

<details>
  <summary>CLI</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <!-- 추가 이미지... -->
  </div>
</details>

## 사용 이유

- **가벼움**: 최소한의 리소스 사용량.
- **유연성**: CLI 도구, 백그라운드 서비스, 또는 웹 대시보드로 실행 가능.
- **관리자 중심**: VRAM 제한 설정, 자동 종료 기능, 모니터링 목록 제공.
- **개발자 친화적**: 벤치마크 및 스트레스 테스트 도구를 통한 시스템 안정성 검증.

## 로드맵 및 미래 작업

기여 환영! 향후 주요 포인트는 다음과 같습니다.

- **다중 GPU 지원**: NVLink 토폴로지를 포함한 다중 카드 설정 향상.
- **컨테이너화**: Docker 공식 지원을 통한 컨테이너 환경에서의 간편 배포.
- **원격 액세스**: SSH 터널링 통합 및 보안 원격 관리.
- **교차 플랫폼**:
  - [ ] Linux 지원 (Ubuntu/Debian 집중).
  - [ ] Apple Silicon을 위한 macOS 지원.
- **하드웨어 독립**:
  - [ ] AMD ROCm 지원.
  - [ ] Intel Arc 지원.

기여 방법은 [CONTRIBUTING.md](../CONTRIBUTING.md)를 참조하세요.

## 요구 사항

- **OS**: Windows 10/11
- **Python**: 3.10 이상
- **하드웨어**: NVIDIA GPU 및 설치 드라이버
- **CUDA**: 12.x (벤치마크 및 시뮬레이션 기능 사용 시 필수)

## 설치

MyGPU는 모듈식 설치를 지원하여 사용자의 요구에 맞게 설정할 수 있습니다.

### 1. 최소 (CLI 전용)

헤드리스 서버 또는 백그라운드 모니터링에 최적.

- 명령줄 인터페이스
- 기본 시스템/GPU 메트릭

### 2. 표준 (CLI + 웹 UI)

대부분의 사용자에게 적합.

- 웹 대시보드 포함
- REST API 엔드포인트
- 실시간 차트

### 3. 풀 (표준 + 시각화)

개발 및 스트레스 테스트에 최적.

- 입자 시뮬레이션 포함
- 벤치마크를 위한 PyTorch/CuPy 의존성

### 빠른 시작

1. **다운로드** 또는 리포지토리 복제.
2. **설정 실행**:

   ```powershell
   .\setup.ps1
   ```

3. **실행**:

   ```powershell
   # 웹 대시보드 시작 (표준/풀)
   python health_monitor.py web

   # CLI 시작
   python health_monitor.py cli
   ```