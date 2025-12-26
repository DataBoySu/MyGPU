<div align="center">
  <a href="../README.md">🇺🇸 英語</a> |
  <a href="../locales/README.de.md">🇩🇪 ドイツ語</a> |
  <a href="../locales/README.fr.md">🇫🇷 フランス語</a> |
  <a href="../locales/README.es.md">🇪🇸 スペイン語</a> |
  <a href="../locales/README.ja.md">🇯🇵 日本語</a> |
  <a href="../locales/README.zh.md">🇨🇳 中文</a> |
  <a href="../locales/README.pt.md">🇵🇹 ポルトガル語</a> |
  <a href="../locales/README.ko.md">🇰🇷 韓国語</a> |
  <a href="../locales/README.hi.md">🇮🇳 हिंदी</a>
</div>

<div style="text-align:center; margin:18px 0;">
  <img src="../monitor/api/static/logo.png" alt="MyGPU ロゴ"/>
</div>

> *MyGPU: GPU 管理ユーティリティの軽量版: 洗練されたウェブダッシュボードを備えた `nvidia-smi` ラッパー*

![ライセンス](https://img.shields.io/badge/ライセンス-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![バージョン](https://img.shields.io/badge/バージョン-1.2.3-blue)
![プラットフォーム](https://img.shields.io/badge/プラットフォーム-Windows-lightgrey)
![CUDA 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## ギャラリー

<details>
  <summary>ウェブダッシュボード</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- 画像は 1624x675 のアスペクト比に合わせてスライドフレームに配置 -->
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

### 利用理由

- **軽量性**: リソース消費量が最小限に抑えられている。
- **柔軟性**: CLIツールとして、または完全なウェブダッシュボードとして利用可能。
- **管理者向け機能**: VRAM制限（VRAM使用量超過時の自動終了）やウォッチリストなどの機能を備えている。
- **開発者向け機能**: ストレステストや粒子物理学シミュレーションなどのベンチマークツールが組み込まれている。

---

## 機能

- **リアルタイム監視**:
  - GPUメトリクス（利用率、VRAM、電力、温度）。
  - システムメトリクス（CPU、メモリなど）。

- **管理者向け機能**:
  - **VRAMキャップ**: 各GPUのVRAM使用量の上限を設定。
  - **自動終了**: VRAMポリシーに違反するプロセスを自動的に終了（管理者のみ）。
  - **ウォッチリスト**: 特定のPIDやプロセス名を監視。

- **ベンチマークとシミュレーション**:
  - **ストレステスト**: 構成可能なGEMMワークロードで熱的スローシングとシステム安定性をテスト。
  - **視覚化シミュレーション**: インタラクティブな3D粒子物理学シミュレーションでGPU負荷を視覚化。

---

## 開発ロードマップと将来の作業

貢献は歓迎します！主な今後のポイントは以下の通りです。

- **マルチGPUサポート**: マルチカードセットアップやNVLinkトポロジーの処理を強化。
- **コンテナ化**: 公式のDockerサポートで簡単なデプロイを実現。
- **リモートアクセス**: SSHトンネル統合とセキュアなリモート管理。
- **クロスプラットフォーム**:
  - [ ] Linuxサポート（Ubuntu/Debianに焦点を当てて）。
  - [ ] macOSサポート（Apple Siliconの監視）。
- **ハードウェア非依存**:
  - [ ] AMD ROCmサポート。
  - [ ] Intel Arcサポート。
- ~~**マルチ言語ドキュメント**: 最も人気のあるGitHub言語でドキュメントをサポート。~~

[CONTRIBUTING.md](../CONTRIBUTING.md) を参照して、どのように貢献できるかを知ってください。

---

## 要件

- **OS**: Windows 10/11
- **Python**: 3.10+
- **ハードウェア**: NVIDIA GPU
- **CUDA**: 12.x (ベンチマーク/シミュレーション機能を使用する場合は厳密に必要)。
- *注: CUDA 12.xが検出されない場合は、GPU固有のベンチマーク機能が無効になります。*

---

## インストール

ツールには、ニーズに合わせて複数のインストールオプションがあります。

### 1. 最小（CLIのみ）

ヘッドレスサーバーやバックグラウンド監視に最適です。

- コマンドラインインターフェースのみ。
- 基本的なシステム/GPUメトリクス。

### 2. 標準（CLI + ウェブUI）

ほとんどのユーザーに最適です。

- ウェブダッシュボードが含まれています。
- REST APIエンドポイント。
- リアルタイムチャート。

### 3. フル（標準 + 視覚化）

開発やストレステストに最適です。

- シミュレーション機能が含まれています。
- PyTorch/CuPy依存関係（ベンチマーク用）。

### クイックスタート

1. **ダウンロード** またはリポジトリをクローンします。
2. **セットアップスクリプトを実行**:

  ```powershell
  .\setup.ps1
  ```

3. **起動**:

```powershell
# ウェブダッシュボードを起動（標準/フル）
python health_monitor.py web

# CLIを起動
python health_monitor.py cli
```