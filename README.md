# 株価ビューア（GCP / Cloud Run）

yfinance を用いて株価チャートを表示する Web アプリケーションです。  
※ ChatGPTを積極的に活用していきます。

- 認証付き Web アプリの構築  
- 外部 API（yfinance）を用いたデータ取得  
- GCP（Cloud Run）へのコンテナデプロイ  
- フロント＋バックエンド＋インフラを一体で運用する構成管理  

といった一連の開発プロセスを経験することを目的としています。

---

## 🚀 このリポジトリについて

- **状態:** フロントエンドの作成をした（ダミー認証機能、株価データのローソク足チャート表示）（手順3）
- **目的:**
  - GCP（特に Cloud Run）を用いたコンテナアプリの構築経験を示す
  - フロント／バックエンド／インフラを 1 リポジトリで統合管理する
  - 実務に近い CI/CD フロー（Cloud Build or GitHub Actions）も順次追加予定

今後、進捗に応じてこの README を更新していきます。

---

## 📱 アプリ概要（MVP）

### 🔧 機能（予定）

- ユーザー認証（ログイン／ログアウト）
- 銘柄検索または銘柄一覧からの選択
- 選択した銘柄の株価チャート表示
- お気に入り銘柄の登録／削除
- スマホ・PC の双方に最適化された UI

### 🧰 技術スタック（予定）

**フロントエンド**

- React + TypeScript  
- lightweight-chartsによるローソク足チャートを表示

**バックエンド**

- Python + FastAPI
- yfinance による株価取得

**インフラ（GCP）**

- Cloud Run（アプリケーション実行）
- Cloud Build（CI/CD）
- Artifact Registry（コンテナイメージ管理）
- 認証・ユーザーデータ保存  
  - Firestore / Cloud SQL / Firebase Authentication のいずれかを選定予定

※ 実際に採用した構成は実装後に随時反映します。

---

## 📦 ディレクトリ構成（予定）

実装前のため、現時点では最低限の構成です。

```text
stock-viewer/
  README.md
  .gitignore
  backend/        # Python + FastAPI + yfinance
  frontend/       # React + TypeScript
  infra/          # Dockerfile, Cloud Run 用設定, IaC 等（予定）
```

---

## 実装した手順について
進行度に合わせて更新してきます。
<details>
<summary> 手順1 開発用コンテナの作成 </summary>
  
参考: [PR #1 – feat: setup unified dev container for Python and Node development](https://github.com/koki-ymd/stock-viewer/pull/1)
- Dockerfile.dev、docker-compose.dev.ymlの作成
- Dockerfile.devはpython・node.jsを含める開発用コンテナ
- FastAPI/yfinance用のrequirementsはこの段階では入れていない
</details>

<details>
  <summary> 手順2 APIを返す小さなバックエンドの開発 </summary>

  参考: [PR #3 - feat: add minimal FastAPI backend with requirements and main.py](https://github.com/koki-ymd/stock-viewer/pull/3)
  - 本プロジェクトにおける最小のバックエンドを構成(FastAPI + yfinance)
  - 実装した機能
    - /health: アプリの生死を確認可能
    - /stocks/{symbol}/history: 指定したsymbolの銘柄データを取得（ローソク足の情報を取得）
    - /stocks/search: ダミー（今後、クエリで銘柄検索を可能にする予定）
  - CORS設定
    - 参考: [PR #8 - feat: enable CORS for frontend development](https://github.com/koki-ymd/stock-viewer/pull/8)
    - viteの開発サーバー(`http://localhost:5173`)からのリクエストを許可した
    - フロントが未実装の時のCORS確認方法 (ブラウザのDevToolsから簡単なFetchを試す)
      ```
      fetch("http://localhost:8000/health", {
        method: "GET",
      }).then(res => res.json()).then(console.log);
      ```
</details>

<details>
  <summary> 手順3 ダミー認証 & 株価をローソク足表示をするフロントエンドの開発</summary>

  参考: [PR #7 - feat: add dummy login and minimal home navigation (with prep library install)](https://github.com/koki-ymd/stock-viewer/pull/7)
  - ダミーログインページと最小のhomeページを作成し、ログイン->homeへの遷移を確認した

 参考: [PR #19 - feat: add auth guard](https://github.com/koki-ymd/stock-viewer/pull/19)
 - 認証ガードの実装をした
 - 認証ラップコンポーネントパターンについて
   - 認証済みか否かを判定するコンポーネントで、認証が必要なページをラッピングするパターン
   - ユーザーがHome（認証が必要なページ）にアクセスした際、ログイン済みユーザーか否かを判定
     - ログイン済みユーザーならHomeを返す
     - ログインしていないユーザーなら/loginへの遷移を返す
   - 認証済みか否かの判定処理を分離できるため、認証方法の変更がしやすい

  参考: [PR #10 - feat: add home page features](https://github.com/koki-ymd/stock-viewer/pull/10)
  - APIの取得を確認するため、機能を小さく実装
    - 銘柄検索
    - お気に入り銘柄の登録&検索
    - 株価のローソク足チャート表示
      - データ数を制限しているため、チャートのチルト・パン・ズームイン・ズームアウトを制限した
</details>

---
## 開発環境の起動方法
ローカルでフロントエンド／バックエンドを動かして動作確認する際の手順をまとめます。

開発用コンテナのワーキングディレクトリは/appです。

### 開発用コンテナの起動/ログイン
```
docker-compose -f infra/docker-compose.dev.yml up -d --build
docker-compose -f infra/docker-compose.dev.yml exec app bash
```
### Backend（FastAPI）の起動方法
FastAPI は uvicorn を使用して起動します。  
- 初回セットアップ
```
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
- uvicornの起動 (/app/backend)
  - venvをアクティブにした状態で以下の起動コマンドを実行
  - `--reload` : 開発中の自動リロード
  - `--host 0.0.0.0` : コンテナ外（ホスト）からアクセス可能
```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- 動作確認 (uvicorn起動後)
  - ヘルスチェック: <a href="http://localhost:8000/health" target="_blank">http://localhost:8000/health</a>
  - API動作確認: <a href="http://localhost:8000/docs" target="_blank">http://localhost:8000/docs</a>

### Frontend（Vite）の起動方法
- 初回セットアップ
  - 使用するパッケージマネージャーはnpmを想定
```
cd frontend
npm install
```
- Viteの起動 (/app/frontend)
  - `--host 0.0.0.0` : コンテナ外（ホスト）からアクセス可能
  - `--port 5173` : Viteのデフォルトポート
```
npm run dev -- --host 0.0.0.0 --port 5173
```
- 動作確認 (Vite起動後)
  - <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>

### FrontendとBackendの接続確認
`http://localhost:8000/health` をフロント（`http://localhost:5173`）から叩いた際に「CORS error」が出ていないことを確認してください。
（Network タブで該当リクエストをクリックし、「Headers → Response Headers」に  `access-control-allow-origin` が存在することを確認する。）


※ 将来的に .env を使用する場合は .env.example に必要な項目を追加します。
