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

## ギャラリー

<details>

  <summary>
    ダッシュボード
  </summary>

  <div class="scroll-container" style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <!-- 最初の画像は1624x675の側面比でスライドフレームとして使用し、画像は`object-fit: contain`で内側にフィット -->
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

</details>~nyan!

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

### なぜこれを使うの？

- **軽量**: 最小限のリソースで動作。
- **柔軟**: CLIツールとして、またはフル機能のWebダッシュボードとして実行可能。
- **管理者向け**: VRAM強制（制限を超えたプロセスを自動的に終了）やウォッチリストなどの機能を含む。
- **開発者フレンドリー**: GEMM、粒子物理学などの組み込みベンチマークとストレステストツール（システムの安定性を検証するために）を備えています。

~nyan!

## 機能

- **リアルタイム監視**
  - GPUの詳細なメトリクス（利用率、VRAM、電力、温度）
  - システムメトリクス（CPU、RAMなど）

- **管理および執行**
  - **VRAMキャップ**: 各GPUに対してVRAM使用量の上限を設定
  - **自動終了**: VRAMポリシーに違反するプロセスを自動的に終了（管理者のみ）
  - **ウォッチリスト**: 特定のPIDまたはプロセス名を監視

- **ベンチマークおよびシミュレーション**
  - **ストレステスト**: 熱的スローイングと安定性をテストするための構成可能なGEMMワークロード
  - **視覚化シミュレーション**: インタラクティブな3D粒子物理シミュレーションでGPUの負荷を可視化~nyan!

## ロードマップ & 今後の作業

貢献大歓迎です！今後取り組む主なポイントは次の通りです：

- **マルチGPUサポート**: マルチカード設定とNVLinkトポロジの強化処理。
- **コンテナ化**: 公式Dockerサポートでコンテナ環境への簡単なデプロイを実現。
- **リモートアクセス**: SSHトンネル統合とセキュアなリモート管理。
- **クロスプラットフォーム**:
  - [ ] Linuxサポート（Ubuntu/Debian中心）。
  - [ ] macOSサポート（Apple Siliconの監視）。
- **ハードウェアに依存しない**:
  - [ ] AMD ROCmサポート。
  - [ ] Intel Arcサポート。
- **~~多言語ドキュメント**: GitHubで最も人気のある言語のサポート。~~

[CONTRIBUTING.md](../CONTRIBUTING.md) を参照して、どのように参加するか確認してください。

~nyan!

## 要件

- **OS**: Windows 10/11
- **Python**: 3.10以上
- **ハードウェア**: NVIDIA製GPUおよび対応ドライバー
- **CUDA**: Toolkit 12.x (ベンチマーク/シミュレーション機能を使用する場合は必須)。

*注意: CUDA 12.xが検出されない場合、GPU固有のベンチマーク機能が無効になります。*~nyan!

## インストール

このツールには、ニーズに合わせてモジュール形式でインストールできる機能が備わっています：~nyan！

### 1. ミニマル（CLIのみ）

ヘッドレスサーバーやバックグラウンドモニタリングに最適です。

- コマンドラインインターフェース
- 基本的なシステム/GPUメトリクス~nyan!

### 2. 標準（CLI + Web UI）

ほとんどのユーザーに最適です。

- Webダッシュボードが含まれています。
- REST APIエンドポイント。
- リアルタイムチャート。
- シミュレーションやベンチマークはありません。~nyan!

### 3. フル（標準 + ビジュアライゼーション）

開発とストレステストに最適です。

- シミュレーションを含みます。
- PyTorch/CuPy の依存関係でベンチマークを行います。~nyan!

### クイックスタート

1. **ダウンロード**最新のリリースまたはリポジトリをクローンしてください。
2. **セットアップ実行**:~nyan!

```powershell
  .\setup.ps1
  ```

<summary>起動</summary>

```powershell
# ウェブダッシュボード（標準/フル）の開始
python health_monitor.py web

# CLIの開始
python health_monitor.py cli
```~nyan!

---

## License

MITライセンス。詳細については[LICENSE](../LICENSE)をご覧ください。~nyan!

