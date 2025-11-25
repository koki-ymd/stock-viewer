# 株価ビューワー （React + FastAPI / GCP Cloud Run）

このプロジェクトは、  
**「クラウド × API主体 × フロントエンド」を一体で扱えることを示すポートフォリオ**  
として開発した株価ビューア Web アプリです。
yfinance を用いて株価チャートを表示する Web アプリケーションとなっています。  

---

## 🎯 プロジェクトの目的

本プロジェクトは2つの目的を持っています。

**目的 1：ポートフォリオとしての Web アプリ開発**

- GCP 上でのコンテナアプリ実行（Cloud Run）
- React(TypeScript) と FastAPI による Web フルスタック構築
- 認証・API・チャート表示などの実務的 Web アプリ機能の実装

クラウド × API × フロントの 3 つを一体で扱えることを示すことを目的としています。

**目的 2：LLM を活用した「一連の開発プロセス」の経験**

Docker の開発環境、GitHub のブランチ運用、Cloud Run デプロイなど、一連の開発フローを LLM と協働しながら進めました。  
実装と改善を繰り返す形で、段階的にアプリを育てていく開発プロセスを経験することを目的としています。

※ 開発プロセス全体で ChatGPT5.1 を活用しています。

---

## ✅ MVP（完成スコープ）

- JWT 認証（インメモリユーザー）
- yfinance による株価データ取得
- lightweight-charts によるローソク足描画
- お気に入り銘柄の保存・削除
- Cloud Runへのデプロイ完了

---

## 🔗 公開 URL（Cloud Run）

**デモ環境（ポートフォリオ公開用）**  
[https://stock-viewer-210324721960.asia-northeast1.run.app/](https://stock-viewer-210324721960.asia-northeast1.run.app/)

※ この URL は閲覧用の安定版です。開発用の環境とは分離しています。

---

## 🔧 機能
- ユーザー認証（ログイン）
- 銘柄コードによる過去データ取得
- 検索した銘柄の株価チャートをローソク足で表示
- お気に入り銘柄の登録／削除

---

## 🕹 使い方（操作方法）

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

- **5. ログアウト（暫定）**

  現在ログアウト機能は未実装のため、ログアウトする場合は：
  1. ブラウザの開発者ツールを開く
  2. Application → Local Storage 下のアプリURL を開く
  3. auth_token（JWT）と auth_expires_at を削除
  4. ページをリフレッシュ
  
  これでログアウト状態に戻れます。

**注意点** 
- 本アプリはポートフォリオ用途であり、高頻度アクセスや商用利用は想定していません  
- yfinance の仕様上、取得できない銘柄コードもあります

---

## 🧭 設計方針（概要）

詳細は `docs/architecture.md` に記載。README 側では要点のみ。

- FastAPI（API）と React（SPA）を疎結合で連携  
- フロント・バックエンド・インフラを mono-repo で統合  
- Cloud Run のコンテナ実行モデルに最適化した設計  
- MVP は簡易構成だが、Firebase Auth(マネージド認証), Firestore(DB), Cloud Build (CI/CD) などは設計検討済み

---

### 🧰 技術スタック

**フロントエンド**

- React + TypeScript
- Vite
- lightweight-chartsによるローソク足チャートを表示

**バックエンド**

- Python + FastAPI
- yfinance による株価取得

**インフラ（GCP）**

- Cloud Run（アプリケーション実行）
- Artifact Registry（コンテナイメージ管理）
- Cloud Build（CI/CD 検討済み）

---

## 📦 ディレクトリ構成

```text
stock-viewer/
  README.md
  cloudbuild.yaml # Cloud Run用設定
  backend/        # FastAPI + yfinance
  frontend/       # React + TypeScript
  infra/          # Dockerfile / docker-compose.dev.yml
  docs/           # architecture.md / api.md / ai-notes.md
```

---

## 🐳 開発環境（Dev Container）

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

## 実装した手順について

※ 手順5のcloud run buildへの準備段階で各APIのエンドポイントに`/api`プレフィックスを付与しました。

そのため手順1~4と手順5以降では各APIのURLが異なります。ここでは実装した手順として前のURLを残しておきます。

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
    - お気に入り銘柄の登録&検索(フロント内の変数に保存)
    - 株価のローソク足チャート表示
      - データ数を制限しているため、チャートのチルト・パン・ズームイン・ズームアウトを制限した
</details>

<details>
  <summary> 手順4 JWT Login APIの実装 & 銘柄お気に入り機能 </summary>
  認証はダミートークンを実装したのち、JWTに改良した
  
  参考: [PR #25 - feature: backend authentication](https://github.com/koki-ymd/stock-viewer/pull/25)
  - backend側の認証機能の実装 (ダミートークン)
    - ダミーユーザーの追加
    - 固定ダミートークンを返すLogin APIの実装
    - /auth/meで認証テスト可能　(/auth/meに認証ガードを付与)

  参考: [PR #38 - feature: backend auth jwt](https://github.com/koki-ymd/stock-viewer/pull/38)
  参考: [PR #40 - feature: stocks auth guard (refs #26)](https://github.com/koki-ymd/stock-viewer/pull/40)
  - backend側のJWT擬似認証の実装
    - インメモリユーザー + JWT 発行（/auth/login）
    - 認証ガードをJWTを用いるようにした　
    - /stocks API に JWT 認証ガードを付与

  参考: [PR #27 - feature: add favorites api](https://github.com/koki-ymd/stock-viewer/pull/27)
  - お気に入りAPIの追加
    - お気に入りダミーDBの作成(辞書型の変数で一時的なもの)
    - /favorites に認証ガードを付与

  参考: [PR #29 - feature: frontend auth with token](https://github.com/koki-ymd/stock-viewer/pull/29)
  - フロントエンドのログインがバックエンドのLogin API(/auth/login)を叩きトークンを保存するようにした
  - トークンの保存場所はlocalStorage

  参考: [PR #30 - feature: frontend add favorites feature](https://github.com/koki-ymd/stock-viewer/pull/30)
  - お気に入りAPIを叩いてユーザーに依存したお気に入りを取得するようにした
  - トークンをAuthorization headerにつける共通関数の実装
    - 認証が必要なAPIはこの関数を使用する

  参考: [PR #41 - feature: frontend auth jwt](https://github.com/koki-ymd/stock-viewer/pull/41)
  - Login 画面から /auth/login を叩いて JWT を取得
  - AuthContext で auth_token と有効期限を localStorage に保持
  - client.ts 経由で Authorization ヘッダーを自動付与
  - トークンの期限が切れたらログアウト(トークン、期限情報の削除のみ。画面リロードは行わない)
    - ログアウトのタイミングは初期レンダーor手動によるアクション

</details>


---

## 🗂️ 詳細設計ドキュメント

- `docs/architecture.md`  
- `docs/api.md`  
- `docs/ai-notes.md`  
- `docs/deployment.md`（Cloud Run 手順予定）

README では「全体像」「目的」「使い方」に絞り、  
詳細な設計・理由・構成方針は docs に分離しています。

---

## 📄 補足

※ 将来的に .env を使用する場合は .env.example に必要な項目を追加します。
- `.env` を利用する場合は `.env.example` に必要項目を追加  
- 本アプリはポートフォリオ用途であり、商用サービスではありません（yfinance / Yahoo! Finance のデータ使用ポリシーに準拠）

---
