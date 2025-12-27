# MyGPU: 軽量GPU管理ユーティリティ

**MyGPU** は、コンパクトな `nvidia-smi` ラッパーで、エレガントなウェブダッシュボードを備えたGPU管理ツールです。

## 特徴

- **軽量性**: 最小限のリソース消費。
- **柔軟性**: CLIツールとして実行するか、フル機能のウェブダッシュボードとして利用可能。
- **管理者向け**: VRAM制限（超過時の自動終了）やウォッチリストなどの機能を備えています。
- **開発者向け**: GEMMや粒子物理学シミュレーションなどのベンチマークとストレステスト機能を備えています。

## ギャラリー

### ウェブダッシュボード

<details>
  <summary>ウェブダッシュボード</summary>
  <div style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <!-- 画像は1624x675のアスペクト比に合わせてスライドフレームに配置 -->
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web1.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/web2.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <!-- 他の画像も同様に追加 -->
  </div>
</details>

<details>
  <summary>CLI</summary>
  <div style="display: flex; overflow-x: auto; gap: 10px; padding: 12px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
    <div style="flex: 0 0 100%; scroll-snap-align: center; aspect-ratio: 1624/675; display: flex; align-items: center; justify-content: center;">
      <img src="../monitor/api/static/cli1.png" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
    <!-- 他のCLI画像も同様に追加 -->
  </div>
</details>

## 使用理由

- **軽量**: リソース消費量が少ない。
- **柔軟性**: CLIツールとして、またはフル機能のウェブダッシュボードとして利用可能。
- **管理者向け機能**: VRAM制限（超過時の自動終了）やウォッチリストなどの機能を備えている。
- **開発者向け機能**: GEMMや粒子物理学シミュレーションなどのベンチマークとストレステスト機能を備えている。

## 機能

- **リアルタイム監視**:
  - GPUメトリクス（利用率、VRAM、電力、温度）。
  - システムメトリクス（CPU、RAMなど）。
- **管理者向け機能**:
  - **VRAM制限**: GPUごとのVRAM使用量の上限を設定。
  - **自動終了**: VRAMポリシーに違反するプロセスを自動的に終了（管理者のみ）。
  - **ウォッチリスト**: 特定のPIDやプロセス名を監視。
- **ベンチマークとシミュレーション**:
  - **ストレステスト**: GEMMワークロードや粒子物理学シミュレーションによるシステムの安定性とサーマルスロッティングのテスト。
  - **インタラクティブシミュレーション**: GPU負荷を視覚化する3D粒子物理学シミュレーション。

## 開発ロードマップ

貢献を歓迎しています。今後の主な開発ポイントは以下の通りです。

- **マルチGPUサポート**: NVLinkトポロジを含むマルチカードセットアップの強化。
- **コンテナ化**: Docker公式サポートによるコンテナ環境への簡単なデプロイ。
- **リモートアクセス**: SSHトンネル統合とセキュアなリモート管理。
- **クロスプラットフォーム**:
  - [ ] Linuxサポート（Ubuntu/Debianに焦点を当てて）。
  - [ ] Apple Silicon向けmacOSサポート。
- **ハードウェア非依存**:
  - [ ] AMD ROCmサポート。
  - [ ] Intel Arcサポート。
- **マルチ言語ドキュメント**: 人気のGitHub言語のドキュメントをサポート（現時点では非対応）。

[CONTRIBUTING.md](../CONTRIBUTING.md) を参照して、どのように貢献できるか確認してください。

## 要件

- **OS**: Windows 10/11
- **Python**: 3.10+
- **ハードウェア**: NVIDIA GPUとインストールされたドライバー。
- **CUDA**: 12.x（ベンチマークやシミュレーション機能を使用する場合は必須）。
  - *注: CUDA 12.xが検出されない場合は、GPU固有のベンチマーク機能が無効になります。*

## インストール

ツールには、ニーズに合わせて3つのインストール方法があります。

### 1. 最小限（CLIのみ）

ヘッドレスサーバーやバックグラウンド監視に最適です。

- コマンドラインインターフェース。
- 基本的なシステム/GPUメトリクス。

### 2. 標準（CLI + ウェブUI）

ほとんどのユーザーに適しています。

- ウェブダッシュボードが含まれています。
- REST APIエンドポイント。
- リアルタイムチャート。
- シミュレーションやベンチマークは含まれていません。

### 3. フル（標準 + シミュレーション）

開発やストレステストに最適です。

- シミュレーションが含まれています。
- ベンチマークにはPyTorch/CuPy依存関係が必要です。

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