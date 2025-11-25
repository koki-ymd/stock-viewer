# AI 活用ノート（ai-notes.md）

このドキュメントは、本プロジェクトにおいて  
**ChatGPT（GPT-5.1）をどのように活用したか**をまとめたものです。

本アプリは、*コード生成だけでなく、設計・環境構築・デプロイ・ドキュメント整備に至るまで、全工程で AI を活用したプロジェクト*として構築しています。

---

# 1. 使用した AI モデル

- **ChatGPT GPT-5.1
- 利用シーン
  - 開発手順の生成
  - 設計レビュー
  - 実装コード生成
  - Docker / Cloud Run の設定生成
  - トラブルシューティング
  - ドキュメント整備・文章構成
  - 技術選定の相談

---

# 2. 要件定義・設計フェーズでの AI 活用

- アプリの実装手順（手順1〜5）の作成  
- API 主体アプリとしての全体設計  
- ディレクトリ構成の設計（backend / frontend / infra / docs）
- FastAPI・React・Cloud Run を組み合わせたアーキテクチャの案出し  
- 各手順に基づく PR 粒度の整理  
- README / architecture.md の構成・内容調整  
- 技術選定の支援
  - lightweight-charts の選定理由整理
  - FastAPI と Cloud Run の相性説明
  - SPA + API を単一コンテナで配信する方式の説明

---

# 3. 開発環境構築（Docker / Git）での AI 活用

### Docker 運用
- `Dockerfile.dev` の初期生成
- `docker-compose.dev.yml` の改善（常駐可能化、ホットリロード対応）
- Python + Node を統合した Dev Container の環境調整
- Colima 上でのトラブル対応
- `.dockerignore` の最小構成  
- 本番用 `Dockerfile.prod` の構成案作成（マルチステージビルド）

### Git 運用
- PR の粒度と命名規則の助言
- README に沿ったコミット方針の整理
- feature ブランチ戦略の相談

---

# 4. バックエンド（FastAPI）での AI 活用

- FastAPI の最小構成生成（health / stocks API）
- yfinance の API 設計
- CORS 対応
- ルーター分割・サービス層・スキーマ層の構成提案
- ダミーユーザー実装（インメモリ DB）
- JWT 認証の実装コード生成
- `Depends(get_current_user)` を利用した認証ガード
- SwaggerUI に Authorization が反映されない問題の調査・解決
- API 仕様（api.md）の改善

---

# 5. フロントエンド（React + TS）での AI 活用

- Vite + React + TypeScript の初期構成生成
- React Router のルーティング構成（/login /home）
- 認証 UI（ログインフォーム）の生成
- AuthContext / ProtectedRoute の生成
- JWT を扱うフロント側のロジック設計
- lightweight-charts を使ったローソク足チャート生成
- データ整形・UI 実装のアドバイス
- API クライアントの共通化（Bearer トークン付与）

---

# 6. インフラ・デプロイ（GCP Cloud Run）での AI 活用

- Cloud Run デプロイ手順（deployment.md）の作成  
  - Artifact Registry の構築
  - Cloud Build（cloudbuild.yaml）の記述
  - dev/prod の 2 環境の運用設計
  - gcloud コマンドの生成
- Cloud Run の設定値の説明
  - min-instances
  - max-instances
  - concurrency
  - ポート設定（FastAPI 8000 / Cloud Run $PORT）
- FastAPI + React SPA の単一コンテナ設計
  - StaticFiles 配信
  - SPA fallback の index.html 返却

---

# 7. ドキュメント整備での AI 活用

### README.md
- プロジェクトの目的整理
- 公開 URL / 機能一覧 / 技術スタックの構成整理
- 今後の拡張予定の文章改善

### architecture.md
- 全体アーキテクチャ図（Mermaid）
- Cloud Run 上でのルーティング（SPA 配信）の説明
- 認証処理と Depends の依存関係図

### api.md
- REST API の仕様書の整備（エンドポイント一覧、例、エラー仕様）

### deployment.md
- Cloud Run デプロイ手順の生成
- dev/prod 運用の意図説明

### dev-log.md
- 作業ログの整理と構造化

---

# 8. トラブルシューティング・深堀り調査での AI 活用

- CORS が機能しない問題の調査
- SwaggerUI で Authorization が付かない問題の分析
- Lightweight-charts の挙動（チルト・パン・ズーム無効化）
- Dockerfile キャッシュとレイヤー構造の理解
- Cloud Run のコールドスタート挙動
- React Router の SPA fallback の仕組み
- yfinance の仕様確認
- fastapi の static file ルーティング調査

---

# 9. ChatGPT 活用による効果

- **開発スピード向上**  
  環境構築からデプロイまでの道筋を短時間で構築できた。

- **知識の補完**  
  Cloud Run / lightweight-charts / JWT など初見技術を実務レベルで理解できた。

- **設計品質の向上**  
  API 設計、アーキテクチャ、ドキュメント品質の底上げに寄与。

- **継続的な改善サイクルの実現**  
  PR ベースで段階的に機能を積み上げるプロセスを実現できた。

---

# 10. まとめ

本プロジェクトでは、  
**「AI を利用した一貫したソフトウェア開発プロセス」** を構築し、  
設計 → 実装 → デプロイ → ドキュメント化 までを  
ChatGPT と協働して進めました。

単なるコード生成ではなく、

- 設計支援  
- GCP インフラ構築  
- Docker 運用  
- Git 運用  
- ドキュメント改善  
- トラブル解決  

を AI に依頼し、  
「AI と人間が協働して一つの Web アプリを作るプロセス」を 形として残しています。
