## 全体像

技術スタック：GCP × Docker（colima）× yfinance × Webアプリ（フロントは Node/React を想定）

アプリ機能：

- ログインあり
- 銘柄検索
- チャート表示
- お気に入り登録

**アプリ名：「株価ビューア」**

---

## 手順0：GCP & ローカル環境の準備
### 0-1. GCP プロジェクト・サービス準備（ホスト側）

GCP コンソールで新規プロジェクト作成（例：stock-viewer-portfolio）

課金有効化

有効化しておくと良いサービス（≒API）

- Cloud Run
- Artifact Registry
- Cloud Build
- Cloud Logging / Monitoring（基本は自動でONだが意識しておく）

（認証をどうするか次第で）Identity Platform or Firebase Authentication などは後からでもOK

※「サービスの作成」ではなく「APIを有効化する」という操作です。

### 0-2. gcloud のセットアップ（ホスト側）

Mac に gcloud CLI をインストール（既に済ならスキップ）

ホームディレクトリなど「普段の場所」で以下を実行：
```
gcloud init
gcloud auth application-default login
```

これはマシン全体の設定であって、プロジェクトフォルダの構造を勝手に変えたりはしません。

「どの GCP プロジェクトをデフォルトにするか」をここで決めるイメージ。

### 0-3. プロジェクトフォルダ & Git 初期セットアップ

開発用フォルダを作成（例）：
```
mkdir stock-viewer
cd stock-viewer
```

初期ディレクトリ構成（テンプレ）
```
stock-viewer/
  backend/           # Python API（yfinanceを叩くFastAPIなど）
  frontend/          # React + TypeScript
  docs/              # ドキュメント類
  infra/             # Dockerfile, cloudbuild.yaml などインフラ周り
  .gitignore
  README.md
```

docs 内の最低限のファイルだけ、空でもいいので最初に作る

- docs/architecture.md … 全体構成図のメモ（後で追記）
- docs/api.md … API仕様（エンドポイント一覧）
- docs/ai-notes.md … 「AIをどう活用したか」のメモ

- README.md の初期イメージ（ざっくり)
  - プロジェクト名・概要
  - まだコードはないので、「これからやること」程度の ToDo を書く
- .gitignore の初期版（例：Node / Python / VSCode / Docker 関連をカバー）

Git 初期化〜最初のコミット
```
git init
git add .
git commit -m "chore: initial project skeleton"
```

**GitHub リポジトリ作成**

GitHub 上で空リポジトリ作成 → remote 追加 → push
```
git remote add origin git@github.com:yourname/stock-viewer.git
git push -u origin main
```

README.md は「プロジェクトの進捗を外に見せる看板」なので、
大きなフェーズが進むたびに更新していくイメージで使うと良いです。

---

## 手順1：Docker（colima）開発環境の準備
### 1-1. colima 起動
```
colima start
```
### 1-2. Docker 開発用のファイル作成

infra/ に以下を用意するイメージ：

1. infra/Dockerfile.dev

  - Node.js + Python が両方入っている開発用コンテナ
  - 例：
    - ベース：python:3.12 など
    - Node.js を nvm か curl でインストール
    - pip で FastAPI / yfinance 用の requirements を入れる（後で）
    - 作業ディレクトリ /app を作成

2. infra/docker-compose.dev.yml
  - app サービスを1つ立てるだけでOK（最初はモノリシックでシンプルに）
  - ./ を /app にマウント
  - ポート:
    - Backend API: 8000
    - Frontend: 5173 など(Viteの場合)
  - 例：
    ```
    services:
      app:
        build:
          context: ..
          dockerfile: infra/Dockerfile.dev
        working_dir: /app
        volumes:
          - ..:/app
        ports:
          - "8000:8000"
          - "5173:5173"
    ```

3. ここまでできたらコミット
  ```
  git add infra
  git commit -m "chore: add dev docker environment"
  ```

---

## 手順2：バックエンド API の骨組み（FastAPI + yfinance）
### 2-1. backend の初期化

コンテナ内で作業します（Docker dev 環境経由）。

コンテナ起動
```
docker compose -f infra/docker-compose.dev.yml up -d --build
docker compose -f infra/docker-compose.dev.yml exec app bash
```

backend/ 内に Python プロジェクト

```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn[standard] yfinance
pip freeze > requirements.txt
```

最小の FastAPI アプリを作成（例：backend/main.py）

- /health : 動作確認用
- /stocks/{symbol}/history : yfinance で過去データ取得（最初のサンプル）
- /stocks/search?query=... : あとで実装でもOK

ローカル実行（コンテナ内）
```
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Mac 側ブラウザで http://localhost:8000/docs を開いて動作確認。

API の仕様が見えてきたら docs/api.md を更新

- /health の説明
- /stocks/{symbol}/history のパラメータ・レスポンスの例
- 将来追加予定の /favorites 系も TODO として書いておく

ここで一度コミット

```
git add backend docs/api.md
git commit -m "feat: add basic fastapi backend with yfinance"
```

## 手順3：フロントエンド（React + TypeScript）スケルトン
### 3-1. フロントエンドの初期化

再びコンテナ内で作業（Node はコンテナ内にインストール済み想定）
```
cd /app/frontend
npm create vite@latest . -- --template react-ts
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

ブラウザで http://localhost:5173 を開いて Vite テンプレートが表示されるか確認。

### 3-2. 画面のざっくり設計

最低限のページ構成だけ決めておく：

- /login
  - とりあえずは「ダミーログイン」（固定ID/パス）でもOK
  - 後から JWT / Identity Platform に差し替え可能
- /（メイン画面）
- 銘柄検索フォーム
- チャート表示領域
- お気に入り一覧

※「認証あり」をちゃんとやるのは時間食うので、

フェーズ1：ダミーログイン（フロントのみ）

フェーズ2：時間があれば本物の認証（JWT or Identity Platform）
という二段構成にすると現実的です。

### 3-3. バックエンドとの接続

フロントから http://localhost:8000/stocks/{symbol}/history に fetch するコードを書く。

yfinance API のレスポンス形式に合わせて TypeScript の型を整理。

チャートライブラリ（Recharts など）を使ってグラフを表示（ポートフォリオとして見栄え◎）

ここまで終わったら：
```
git add frontend
git commit -m "feat: add frontend skeleton and basic stock chart"
```

---

## 手順4：お気に入り機能 & 認証の形だけ作る
### 4-1. バックエンドにお気に入り API を追加

- /favorites (GET) : ログインユーザのお気に入り銘柄一覧
- /favorites (POST) : 銘柄をお気に入り登録

認証は最初は「ダミーユーザID（例：user1）で固定」でOK

データ保存は

フェーズ1：メモリ or ローカルJSONファイル

フェーズ2：時間があれば Firestore など

### 4-2. フロント側でお気に入り機能

- 各銘柄に「☆」ボタンをつけて、お気に入り登録/解除
- メイン画面に「お気に入りリスト」を表示
- ロード時に /favorites を叩いて一覧取得

この時点で

「ログイン（擬似） → 銘柄検索 → チャート表示 → お気に入り登録・一覧」

という、一通り “アプリっぽい” 動きができる。

## 手順5：Cloud Run へのデプロイ準備
### 5-1. 本番用 Dockerfile（モノリシック構成）

シンプルにするために、以下構成を推奨：

- Docker build 時にフロントをビルド → dist/ を backend の static として同じコンテナに詰める

- 実行時には FastAPI（+ uvicorn）だけを起動し、API と静的ファイル両方を配信

- Dockerfile（本番用）は例えば：

  1. Node + Python の multi-stage build

  2. Stage1: Frontend build

    - /frontend で npm install, npm run build

    -  dist/ を export

  3. Stage2: Backend

  - Python ベースイメージ

  - backend/ をコピー
  - `pip install -r requirements.txt`
  - Stage1 の dist/ を backend/static/ にコピー
  - uvicorn main:app で起動

### 5-2. Cloud Run へのデプロイ
1. イメージビルド & Artifact Registry へ push（Cloud Buildを利用）
  ```
  gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/stock-viewer/stock-viewer-image
  ```

2. Cloud Run へデプロイ
  ```
  gcloud run deploy stock-viewer \
    --image REGION-docker.pkg.dev/PROJECT_ID/stock-viewer/stock-viewer-image \
    --platform managed \
    --region REGION \
    --allow-unauthenticated
  ```

3. 発行された URL にブラウザでアクセスして、動作確認。
   
