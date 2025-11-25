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

<details>
  <summary> 手順5 Cloud Runへのデプロイ</summary>

  参考: [PR #44 - feature: prepare-cloud-run-build](https://github.com/koki-ymd/stock-viewer/pull/44)
  - Cloud Runのビルド準備をした
  - ローカル開発環境/クラウド環境の切り替えに対応した処理の実装
    - ローカル開発環境であればCORS設定を有効にし、Viteからのリクエストを受け付ける
    - クラウド環境であればクラウド用コンテナ内の静的ファイルとルートをマウント
      - 後の実装でルートとのマウントは失敗すると判明(refs #46)
  - 各APIのエンドポイントに/apiプレフィックスをつけた
    - 同一コンテナで配信するため、フロントとバックのURLコンフリクトを防ぐ目的
  - 本番用Dockerfileの作成
    - .dockerignoreの作成(ビルド時に無視する)

  参考: [PR #43 - fix: frontend build errors](https://github.com/koki-ymd/stock-viewer/pull/43)
  - 本番用ビルドが通らなかった部分の修正
    - ProtectedRoute.tsxのJSX名前空間エラー
    - StockChart.tsxの未使用インポート
    - StockChart.tsxのstring → UTCTimestamp の変換エラー

  参考: [PR #45 - fix: frontend api base url](https://github.com/koki-ymd/stock-viewer/pull/45)
  - フロントエンドの.envの作成を忘れていたため、クラウド環境でlocalhostにアクセスしようとしていた
  - 環境変数がない時にルートを参照するように挙動を変更した
  - 開発環境用に.env.developmentを作成した

  参考: [PR #46 - feat: refine build paths and static serving for Cloud Run](https://github.com/koki-ymd/stock-viewer/pull/46)
  - cloudbuild.yamlの作成
    - gcloud builds時にDockerfile.prodが/infra内にあることを伝える
  - .env.developにViteがAPIを叩くときのBASE URL環境変数を設定した(#45 と被る内容)
  - main.pyで本番環境のみ/staticにマウントするようにした
    - main.pyで/にマウントかつ、Viteのbase=/だと`/login`が見つからないことに対する対応
    - クラウド環境のみviteのbase=`/static`にすることでクラウド用コンテナ内の環境と合うようにした
  
</details>

