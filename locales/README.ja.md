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

<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU logo"/>
</div>

> *MyGPU: 軽量GPU管理ユーティリティ: 洗練されたWebダッシュボードを備えたコンパクトな`nvidia-smi`ラッパー.*

![ライセンス](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![バージョン](https://img.shields.io/badge/version-1.2.3-blue)
![プラットフォーム](https://img.shields.io/badge/platform-Windows-lightgrey)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## ギャラリー

<details>
  <summary>Web ダッシュボード</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- 画像は1624x675のアスペクト比に合わせてスライドフレームに配置 -->
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

### 利用目的

- **軽量性**: リソース消費量が最小限。
- **柔軟性**: CLIツールとして、またはWebダッシュボードとして利用可能。
- **管理者向け機能**: VRAM制限（超過時の自動終了）やウォッチリストなどの機能を備えています。
- **開発者向け機能**: ストレステストや粒子物理学シミュレーションなどのベンチマークツールを内蔵。

---

### 特徴

- **リアルタイム監視**:
  - GPUメトリクス（利用率、VRAM、電力、温度）。
  - システムメトリクス（CPU、メモリなど）。
- **管理者向け機能**:
  - **VRAM制限**: 各GPUのVRAM使用量の上限を設定。
  - **自動終了**: VRAMポリシーに違反するプロセスを自動的に終了（管理者のみ）。
  - **ウォッチリスト**: 特定PIDやプロセス名を監視。
- **ベンチマークとシミュレーション**:
  - **ストレステスト**: 構成可能なGEMMワークロードで、熱的スローやシステム安定性をテスト。
  - **視覚化シミュレーション**: インタラクティブな3D粒子物理学シミュレーションでGPU負荷を視覚化。

---

### 今後のロードマップと開発

貢献は歓迎します！今後の主な開発ポイントは以下の通りです。

- **マルチGPUサポート**: NVLinkトポロジを含むマルチカードセットアップの処理強化。
- **コンテナ化**: Docker公式サポートで、コンテナ環境への簡単なデプロイを実現。
- **リモートアクセス**: SSHトンネル統合とセキュアなリモート管理。
- **クロスプラットフォーム**:
  - [ ] Linuxサポート（Ubuntu/Debianに焦点）。
  - [ ] macOSサポート（Apple Siliconの監視）。
- **ハードウェア非依存**:
  - [ ] AMD ROCmサポート。
  - [ ] Intel Arcサポート。
- **多言語ドキュメント**: GitHubで人気のある言語のドキュメントをサポート（現時点では非対応）。

[CONTRIBUTING.md](../CONTRIBUTING.md) を参照して、どのように貢献できるか確認してください。

---

### 要件

- **OS**: Windows 10/11
- **Python**: 3.10+
- **ハードウェア**: NVIDIA GPU
- **CUDA**: 12.xツールキット（ベンチマーク/シミュレーション機能を使用する場合）。
  - *注: CUDA 12.xが検出されない場合、GPU関連のベンチマーク機能が無効になります。*

---

### インストール

ツールには、ニーズに合わせて複数のインストールオプションがあります。

### 1. 最小（CLIのみ）

ヘッドレスサーバーやバックグラウンド監視に最適です。

- コマンドラインインターフェースのみ。
- 基本的なシステム/GPUメトリクスの監視。

### 2. 標準（CLI + Web UI）

ほとんどのユーザーに最適です。

- Webダッシュボードが含まれています。
- REST APIエンドポイント。
- リアルタイムチャート。
- シミュレーションやベンチマークは含まれません。

### 3. フル（標準 + 視覚化）

開発やストレステストに最適です。

- シミュレーション機能。
- PyTorch/CuPy依存関係（ベンチマーク用）。

### クイックスタート

1. **ダウンロード**: 最新リリースまたはリポジトリをクローン。
2. **セットアップ**:

  ```powershell
  .\setup.ps1
  ```

3. **起動**:

```powershell
# Webダッシュボードを起動（標準/フル）
python health_monitor.py web

# CLIを起動
python health_monitor.py cli
```