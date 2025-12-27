# MyGPU: 軽量GPU管理ユーティリティ

**MyGPU** は、コンパクトな `nvidia-smi` ラッパーで、エレガントなウェブダッシュボードを備えたGPU管理ツールです。

## 特徴

- **軽量性**: 最小限のリソース消費。
- **柔軟性**: CLIツールとして実行するか、完全機能のウェブダッシュボードとして実行可能。
- **管理者向け**: VRAM制限（超過時の自動終了）やウォッチリストなどの機能を備えています。
- **開発者向け**:  GEMMや粒子物理学シミュレーションなどの組み込みベンチマークとストレステストでシステムの安定性を検証できます。

## ギャラリー

### ウェブダッシュボード

<details>
  <summary>ウェブダッシュボード</summary>
  <div style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
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

## 使用理由

- **軽量性**: リソース消費量が最小限。
- **柔軟性**: CLIツールとして、または完全機能のウェブダッシュボードとして実行可能。
- **管理者向け機能**: VRAM制限（超過時の自動終了）やウォッチリストなどの機能を備えています。
- **開発者向け機能**: 組み込みのベンチマークとストレステストでシステムの安定性を検証できます。

## 機能

- **リアルタイム監視**:
  - GPUメトリクス（利用率、VRAM、電力、温度）。
  - システムメトリクス（CPU、RAMなど）。
- **管理者向け機能**:
  - **VRAM制限**: 各GPUのVRAM使用量に上限を設定。
  - **自動終了**: VRAMポリシーに違反するプロセスを自動的に終了（管理者のみ）。
  - **ウォッチリスト**: 特定のPIDやプロセス名を監視。
- **ベンチマークとシミュレーション**:
  - **ストレステスト**: 構成可能なGEMMワークロードで、熱的スローシングと安定性をテスト。
  - **粒子物理学シミュレーション**: GPU負荷を視覚化するインタラクティブな3Dシミュレーション。

## 今後の開発

貢献は歓迎します！主な今後の開発ポイントは以下の通りです。

- **マルチGPUサポート**: マルチカードセットアップやNVLinkトポロジーの処理を強化。
- **コンテナ化**: 公式のDockerサポートで、コンテナ環境での簡単なデプロイを実現。
- **リモートアクセス**: SSHトンネル統合とセキュアなリモート管理。
- **クロスプラットフォーム**:
  - [ ] Linuxサポート（Ubuntu/Debianに焦点）。
  - [ ] macOSサポート（Apple Siliconのモニタリング）。
- **ハードウェア非依存**:
  - [ ] AMD ROCmサポート。
  - [ ] Intel Arcサポート。
- [ ] マルチ言語ドキュメント（GitHubで人気のある言語をサポート）。

[CONTRIBUTING.md](../CONTRIBUTING.md) を参照して、どのように貢献できるか確認してください。

## 要件

- **OS**: Windows 10/11
- **Python**: 3.10+
- **ハードウェア**: NVIDIA GPUとインストールされたドライバー。
- **CUDA**: 12.xツールキット（ベンチマークやシミュレーション機能を使用する場合は必須）。
  - *注: CUDA 12.xが検出されない場合は、GPU固有のベンチマーク機能が無効になります。*

## インストール

ツールには、ニーズに合わせて複数のインストール方法があります。

### 1. 最小限（CLIのみ）

ヘッドレスサーバーやバックグラウンド監視に最適です。

- コマンドラインインターフェースのみ。
- 基本的なシステム/GPUメトリクスの監視。

### 2. 標準（CLI + ウェブUI）

ほとんどのユーザーに最適です。

- ウェブダッシュボードが含まれています。
- REST APIエンドポイント。
- リアルタイムチャート。
- シミュレーションやベンチマークは含まれません。

### 3. フル（標準 + シミュレーション）

開発やストレステストに最適です。

- シミュレーションが含まれています。
- PyTorch/CuPy依存関係でベンチマークが可能。

### クイックスタート

1. **ダウンロード**: 最新リリースをダウンロードするか、リポジトリをクローンします。
2. **セットアップ**:

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