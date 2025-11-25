# 株価ビューワー （React + FastAPI / GCP Cloud Run）

React + FastAPI を用いて構築した、Cloud Run デプロイ対応の株価ビューア Web アプリです。

このプロジェクトは、ポートフォリオとして公開しています。

---

## プロジェクトの目的

本プロジェクトは2つの目的を持っています。

**目的 1：ポートフォリオとしての Web アプリ開発**

- GCP 上でのコンテナアプリ実行（Cloud Run）
- React(TypeScript) と FastAPI による Web フルスタック構築
- 認証・API・チャート表示などの実務的 Web アプリ機能の実装

クラウド × API × フロントの 3 つを一体で扱えることを示すことを目的としています。

**目的 2：LLM を活用した「一連の開発プロセス」の経験**

Docker の開発環境、GitHub のブランチ運用、Cloud Run デプロイなど、一連の開発フローを LLM と協働しながら進めました。  
実装と改善を繰り返す形で、段階的にアプリを育てていく開発プロセスを経験することを目的としています。

※ 開発プロセス全体で ChatGPT 5.1 を活用しています。

---

## MVP（完成スコープ）

- JWT 認証（インメモリユーザー）
- yfinance による株価データ取得
- lightweight-charts によるローソク足描画
- お気に入り銘柄の保存・削除
- Cloud Runへのデプロイ完了

※ 認証はポートフォリオ用途のため、インメモリユーザーに対して JWT を発行する簡易実装です。

---

## 🔗 公開 URL（Cloud Run）

**デモ環境（ポートフォリオ公開用）**  
[https://stock-viewer-210324721960.asia-northeast1.run.app/](https://stock-viewer-210324721960.asia-northeast1.run.app/)

※ この URL は閲覧用の安定版です。開発用の環境とは分離しています。

---

## 機能
- ユーザー認証（ログイン）
- 銘柄コードによる過去データ取得
- 検索した銘柄の株価チャートをローソク足で表示
- お気に入り銘柄の登録／削除

---

## 使い方（操作方法）

- **1. ログイン**
  - ユーザー名：任意の文字列  
  - パスワード：任意（インメモリ認証のため固定ユーザー扱い）  
  - ログインすると Home 画面へ遷移します。

- **2. 銘柄検索**
  - 検索フォームに銘柄コードを入力
    - 例
    - AAPL, GOOG, MSFT, 等
    - 日本の銘柄であればポストフィックスとして".T"を使用 (7023.T, 9432.T, 等)
  - 「検索」ボタンを押すと、バックエンド経由で yfinance の株価データを取得します。

- **3. 株価チャートの表示**
  - 選択した銘柄の**過去株価データをローソク足チャート**として描画します。  
  - データ量を制限しているため、「パン／ズーム／チルト操作は制限されたモード」で動作します。

- **4. お気に入り機能**
  - 銘柄の右側にある「お気に入りに追加」ボタンで登録
  - 銘柄の右側にある「削除」ボタンで解除  
  - JWT 認証によりユーザーごとにお気に入りが保持されます  
  - お気に入り一覧から銘柄をワンクリックでチャートを再表示できます

- **5. ログアウト**

  ※ 開発者向けの暫定手段になります
  
  現在ログアウト機能は未実装のため、ログアウトする場合は：
  1. ブラウザの開発者ツールを開く
  2. Application → Local Storage 下のアプリURL を開く
  3. auth_token（JWT）と auth_expires_at を削除
  4. ページをリフレッシュ
  
  これでログアウト状態に戻れます。

## ⚠️ 注意事項

- 本アプリはポートフォリオ用途であり、商用サービスとしての利用は想定していません。
- 株価データ取得には yfinance を利用しており、Yahoo! Finance の仕様変更や制限により動作が変わる可能性があります。
- yfinance の仕様上、取得できない銘柄コードも存在します。


---

## 🧭 設計方針（概要）

詳細は `docs/architecture.md` に記載。README 側では要点のみ。

- FastAPI（API）と React（SPA）を疎結合で連携  
- フロント・バックエンド・インフラを mono-repo で統合  
- Cloud Run のコンテナ実行モデルに最適化した設計  
- MVP は簡易構成だが、Firebase Auth(マネージド認証), Firestore(DB), Cloud Build (CI/CD) などは設計検討済み

---

## 🔭 今後の拡張予定（検討中）

- Firebase Auth などのマネージド認証への移行
- Firestore / Cloud SQL などを用いた永続的なお気に入り保存
- Cloud Build を用いた Cloud Run への CI/CD パイプライン構築


---

### 🧰 技術スタック

**フロントエンド**

- React + TypeScript
- Vite
- lightweight-charts によるローソク足チャートを表示

**バックエンド**

- Python + FastAPI
- yfinance による株価取得

**インフラ（GCP）**

- Cloud Run（アプリケーション実行）
- Artifact Registry（コンテナイメージ管理）

---

## 📦 ディレクトリ構成

```text
stock-viewer/
  README.md
  backend/        # FastAPI + yfinance
  frontend/       # React + TypeScript
  infra/          # Dockerfile.dev / Dockerfile.prod / docker-compose.dev.yml / cloudbuild.yaml
  docs/           # architecture.md / api.md / ai-notes.md / dev-log.md / deployment.md
```

---

## 🐳　開発環境（Dev Container）
### 前提環境
- Docker / Docker Compose がインストールされていること
- macOS + Colima 上で動作確認済み（他環境でも Docker が動けば基本的に再現可能）

### 開発コンテナの起動

```bash
docker-compose -f infra/docker-compose.dev.yml up -d --build
docker-compose -f infra/docker-compose.dev.yml exec app bash
```

### Backend（FastAPI）起動手順

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend（Vite）起動手順

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

---

## 実装手順（サマリー）

本プロジェクトは、機能単位で小さく区切り、PR ベースで段階的に開発を進めました。
詳細な開発ログは `docs/dev-log.md` にまとめています。

- **手順1**：開発用コンテナの作成（Dockerfile.dev / docker-compose.dev.yml）  
- **手順2**：FastAPI の最小API構築（/health, /stocks/...）  
- **手順3**：ダミー認証 + チャート表示フロント実装  
- **手順4**：JWT 認証・お気に入り API / フロント対応  
- **手順5**：Cloud Run ビルド対応・本番コンテナ構成の整備  
