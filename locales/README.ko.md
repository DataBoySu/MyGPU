# MyGPU: GPU 관리 유틸리티

*가벼운 GPU 관리 도구: NVIDIA smi의 컴팩트한 랩핑과 우아한 웹 대시보드.*

## 갤러리

<details>
  <summary>웹 대시보드</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- 첫 번째 이미지(web1.png)를 기본 비율(1624x675)로 사용하여 슬라이드 프레임으로 설정하고, object-fit: contain을 사용하여 이미지를 채웁니다. -->
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/web2.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <!-- 추가 이미지 동일한 방식으로 설정 -->
  </div>
</details>

<details>
  <summary>CLI</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <!-- 추가 이미지 동일한 방식으로 설정 -->
  </div>
</details>

## 이 도구를 사용하는 이유

- **가벼움**: 최소한의 리소스 사용.
- **유연성**: CLI 도구 또는 완전한 기능을 갖춘 웹 대시보드로 실행 가능.
- **관리자 중심**: VRAM 제한(VRAM 사용량 제한) 및 감시 목록과 같은 기능 포함.
- **개발자 친화적**: GEMM, 입자 물리학과 같은 벤치마크 및 스트레스 테스트 도구를 내장하여 시스템 안정성을 검증.

---

## 기능

- **실시간 모니터링**:
  - GPU 메트릭(사용량, VRAM, 전력, 온도) 및 시스템 메트릭(CPU, RAM 등) 제공.
- **관리 및 강제 실행**:
  - **VRAM 제한**: GPU당 VRAM 사용량에 대한 하드 한계 설정.
  - **자동 종료**: VRAM 정책을 위반하는 프로세스를 자동으로 종료(관리자만 가능).
  - **감시 목록**: 특정 PID 또는 프로세스 이름을 모니터링.
- **벤치마크 및 시뮬레이션**:
  - **스트레스 테스트**: GEMM 워크로드를 구성하여 열 스로틀링 및 안정성을 테스트.
  - **시각적 시뮬레이션**: 상호작용 3D 입자 물리학 시뮬레이션을 통해 GPU 부하 시각화.

---

## 로드맵 및 미래 작업

기여 환영! 주요 미래 개발 사항은 다음과 같습니다.

- **다중 GPU 지원**: 다중 카드 설정 및 NVLink 토폴로지에 대한 향상된 처리.
- **컨테이너화**: Docker 공식 지원을 통해 컨테이너 환경에서 쉽게 배포.
- **원격 액세스**: SSH 터널링 통합 및 보안 원격 관리.
- **플랫폼 간 지원**:
  - [ ] Linux 지원(Ubuntu/Debian 중점).
  - [ ] Apple Silicon을 위한 macOS 지원.
- **하드웨어 독립**:
  - [ ] AMD ROCm 지원.
  - [ ] Intel Arc 지원.
- [ ] 다국어 문서화(현재는 영어만 지원).

[CONTRIBUTING.md](../CONTRIBUTING.md)를 참조하여 참여 방법 알아보기.

---

## 요구 사항

- **OS**: Windows 10/11
- **Python**: 3.10 이상
- **하드웨어**: NVIDIA GPU 및 설치 드라이버
- **CUDA**: 12.x 툴킷(벤치마크/시뮬레이션 기능 사용 시 필수).
  - *참고: CUDA 12.x가 감지되지 않으면 GPU 관련 벤치마크 기능이 비활성화됩니다.*

---

## 설치

도구의 모듈식 설치를 통해 요구 사항에 맞게 설정할 수 있습니다.

### 1. 최소(CLI 전용)

헤드리스 서버나 백그라운드 모니터링에 최적.

- 명령줄 인터페이스만 제공.
- 기본적인 시스템/GPU 메트릭 제공.

### 2. 표준(CLI + 웹 UI)

대부분의 사용자에게 적합.

- 웹 대시보드 포함.
- REST API 엔드포인트.
- 실시간 차트 제공.

### 3. 풀(표준 + 시각화)

개발 및 스트레스 테스트에 최적.

- 입자 시뮬레이션 포함.
- PyTorch/CuPy 의존성을 통한 벤치마크.

### 빠른 시작

1. **최신 릴리스 다운로드 또는 저장소 복제.**
2. **설정 실행:**
   ```powershell
   .\setup.ps1
   ```
3. **시작:**

   ```powershell
   # 웹 대시보드(표준/풀) 시작
   python health_monitor.py web

   # CLI 시작
   python health_monitor.py cli
   ```