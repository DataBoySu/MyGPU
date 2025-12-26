# MyGPU: 軽量GPU管理ユーティリティ - 洗練されたWebダッシュボードを備えた`nvidia-smi`ラッパー

## ギャラリー

### Webダッシュボード

<details>
  <summary>Webダッシュボード</summary>
  <div style="display:flex; overflow-x:auto; gap:10px; padding:12px 0; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;">
    <!-- 最初の画像を1624x675のアスペクト比で設定し、他の画像はこれに合わせて自動調整 -->
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

### このツールを使う理由

- **軽量**: リソース消費量が少ない。
- **柔軟性**: CLIツールとして、またはWebダッシュボードとして利用可能。
- **管理者向け**: VRAM制限（ポリシーの自動適用）やウォッチリストなどの機能を備えている。
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
  - **ストレステスト**: 構成可能なGEMMワークロードで熱的スローや安定性をテスト。
  - **視覚化シミュレーション**: インタラクティブな3D粒子物理学シミュレーションでGPU負荷を視覚化。

---

## 今後の開発計画

貢献をお待ちしています！今後の主な開発ポイントは以下の通りです。

- **マルチGPUサポート**: マルチカードセットアップやNVLinkトポロジーの処理強化。
- **コンテナ化**: Docker公式サポートでコンテナ環境への簡単なデプロイを実現。
- **リモートアクセス**: SSHトンネル統合とセキュアなリモート管理。
- **クロスプラットフォーム**:
  - [ ] macOSサポート（Apple Siliconの監視）。
- **ハードウェア非依存**:
  - [ ] AMD ROCmサポート。
  - [ ] Intel Arcサポート。
- [ ] 多言語ドキュメント（GitHubで人気のある言語をサポート）。

[CONTRIBUTING.md](../CONTRIBUTING.md) を参照して、どのように貢献できるか確認してください。

---

## 要件

- **OS**: Windows 10/11
- **Python**: 3.10+
- **ハードウェア**: NVIDIA GPU
- **CUDA**: 12.x ツールキット（ベンチマークやシミュレーション機能を使用する場合に必須）。
  - *注: CUDA 12.x が検出されない場合は、GPU固有のベンチマーク機能が無効になります。*

---

## インストール

モジュールインストールでニーズに合わせてカスタマイズ可能です。

### 1. 最小限（CLIのみ）

サーバーやバックグラウンド監視に最適。

- コマンドラインインターフェース。
- 基本的なシステム/GPUメトリクス。

### 2. 標準（CLI + Web UI）

ほとんどのユーザーに適したオプション。

- Webダッシュボードが含まれています。
- REST APIエンドポイント。
- リアルタイムチャート。
- シミュレーションやベンチマークは含まれていません。

### 3. フル（標準 + 視覚化）

開発やストレステストに最適。

- シミュレーション機能が含まれています。
- PyTorch/CuPy依存関係でベンチマーク機能が利用可能。

### クイックスタート

1. **最新版をダウンロード** またはリポジトリをクローンします。
2. **セットアップスクリプトを実行**:

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

---

## ライセンス

MIT ライセンス。[LICENSE](../LICENSE) を参照してください。