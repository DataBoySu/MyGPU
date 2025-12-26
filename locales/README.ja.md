# MyGPU: GPU管理ユーティリティ

軽量なGPU管理ツール: `nvidia-smi`のコンパクトなラッパーに美しいウェブダッシュボードを組み合わせたものです。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Version](https://img.shields.io/badge/version-1.2.3-blue)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![cuda 12.x](https://img.shields.io/badge/CUDA-12.x-0f9d58?logo=nvidia)

## ギャラリー

### ウェブダッシュボード

<details>
  <summary>ウェブダッシュボード</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
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

### CLI

<details>
  <summary>CLI</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <div style="flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1624/675; display:flex; align-items:center; justify-content:center;">
      <img src="../monitor/api/static/cli1.png" style="width:100%; height:100%; object-fit:contain;" />
    </div>
    <!-- 他の画像も同様に追加 -->
  </div>
</details>

## 利用理由

- **軽量**: リソース消費量が少ない。
- **柔軟性**: CLIツールとして、またはウェブダッシュボードとして利用可能。
- **管理者向け**: VRAM制限（超過時の自動終了）やウォッチリストなどの機能を備えている。
- **開発者向け**: 組み込みのベンチマークとストレステストツール（GEMM、粒子物理学）でシステムの安定性を検証できる。

---

## 機能

- **リアルタイム監視**:
  - GPUメトリクス（利用率、VRAM、電力、温度）。
  - システムメトリクス（CPU、RAMなど）。

- **管理者機能**:
  - **VRAM制限**: 各GPUのVRAM使用量に上限を設定。
  - **自動終了**: VRAMポリシーに違反するプロセスを自動的に終了（管理者のみ）。
  - **ウォッチリスト**: 特定のPIDやプロセス名を監視。

- **ベンチマークとシミュレーション**:
  - **ストレステスト**: GEMMワークロードを使用して、熱的スローや安定性をテスト。
  - **視覚化シミュレーション**: 3D粒子物理学シミュレーションでGPU負荷を視覚化。

---

## 開発ロードマップ

貢献を歓迎します！今後の主な開発ポイントは以下の通りです。

- **マルチGPUサポート**: マルチカードセットアップやNVLinkトポロジーの処理を強化。
- **コンテナ化**: Docker公式サポートで、コンテナ環境への簡単なデプロイを実現。
- **リモートアクセス**: SSHトンネル統合とセキュアなリモート管理。
- **クロスプラットフォーム**:
  - [ ] Linuxサポート（Ubuntu/Debianに焦点を当てて）。
  - [ ] macOSサポート（Apple Siliconの監視）。
- **ハードウェア非依存**:
  - [ ] AMD ROCmサポート。
  - [ ] Intel Arcサポート。
- [ ] マルチ言語ドキュメント（GitHubで人気のある言語をサポート）。

[CONTRIBUTING.md](../CONTRIBUTING.md)を参照して、貢献方法をご確認ください。

---

## 要件

- **OS**: Windows 10/11
- **Python**: 3.10+
- **ハードウェア**: NVIDIA GPUとインストールされたドライバー。
- **CUDA**: 12.x（ベンチマークやシミュレーション機能を使用する場合に必須）。
  - *注: CUDA 12.xが検出されない場合は、ベンチマーク機能が非アクティブになります。*

---

## インストール

モジュール式インストールで、ニーズに合わせてカスタマイズ可能です。

### 1. 最小限（CLIのみ）

ヘッドレスサーバーやバックグラウンド監視に最適です。

- コマンドラインインターフェース。
- 基本的なシステム/GPUメトリクス。

### 2. 標準（CLI + ウェブUI）

ほとんどのユーザーに適したオプションです。

- ウェブダッシュボードが含まれています。
- REST APIエンドポイント。
- リアルタイムチャート。

### 3. フル（標準 + 視覚化）

開発やストレステストに最適です。

- 粒子シミュレーションが含まれています。
- PyTorch/CuPy依存関係でベンチマークが可能。

### クイックスタート

1. **リポジトリをダウンロード** またはクローンします。
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