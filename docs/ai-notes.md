ChatGPTを用いて何をしたか書く

### 2025-11-18
- ChatGPTで開発手順の作成を行った

---

### 2025-11-19
- 手順1として、Docker開発環境の準備を行った
  - 参考: [PR #1 – feat: setup unified dev container for Python and Node development](https://github.com/koki-ymd/stock-viewer/pull/1)
  - Dockerfile.devの出力を行った
  - docker-compose.dev.ymlの出力を行った
  - 出力したDockerfile.devがよくわからなかったので、それを理解するための実践型チュートリアルを作成した
  - 出力したこれらのファイルはコンテナを作成した後、すぐに止まるコンテナだった
  - 常駐できるようにdocker-compose.dev.ymlを改善した

- 手順2として、最小のバックエンドを作成した
  - 参考: [PR #3 - feat: add minimal FastAPI backend with requirements and main.py](https://github.com/koki-ymd/stock-viewer/pull/3)
  - 参考: [PR #4 - docs: add initial API specification in api.md](https://github.com/koki-ymd/stock-viewer/pull/4)
  - backendプロジェクトの初期化手順の生成を行った
    - venv内にfastapi・uvicorn[standard]・yfinanceをインストールした
    - requirement.txtを作成した
  - 最小のFastAPIアプリとしてmain.pyを生成した
    - health : アプリケーションの生死確認
    - /stock/{symbol}/history : symbolで指定した銘柄のローソク足を取得可能
    - /stocks/search : ダミー（今後、クエリで銘柄検索できる予定）
  - uvicornを起動し、アプリを確認した
  - ここで作成したAPIに基づいてapi.mdを更新した

---

### 2025-11-20
- 手順3の一部として、フロントエンドの骨子を作成した
  - 参考: [PR #7 - feat: add dummy login and minimal home navigation (with prep library install)](https://github.com/koki-ymd/stock-viewer/pull/7)
  - 参考: [PR #10 - feat: add home page features](https://github.com/koki-ymd/stock-viewer/pull/10)
  - frontendプロジェクトの初期化手順の生成を行なった
    - viteのテンプレート(React + TS)をインストールした
    - viteサーバーを起動し、テンプレートが表示されることを確認した
  - 簡易ログイン画面と最小限のホーム画面を作成し、ログイン->ホーム画面の遷移を確認した
    - ログイン画面はダミー認証
    - ホーム画面は「ログイン成功です」の文字を表示するページ
  - React.jsとTSの強みについて確認した
  - Homeの機能を小さく実装し、データの取得がうまくいっているかを確認した
    - 銘柄検索によるデータ取得
    - データのリスト表示
    - お気に入り銘柄の登録 (インメモリ)
  - データを取得する際、CORSの設定をしていなかったので、CORSの設定をした
    - 参考: [PR #8 - feat: enable CORS for frontend development](https://github.com/koki-ymd/stock-viewer/pull/8)
    - CORSの設定について、あらかじめ生成した手順には載っていなかった
    - バックエンド側の実装として、手順2として実装した

---

### 2025-11-21
- 手順3の一部として、認証ガードとローソク足チャートの表示を行った
  - 認証ラップコンポーネントパターンによる認証ガードを実装した
    - 参考: [PR #19 - feat: add auth guard](https://github.com/koki-ymd/stock-viewer/pull/19)
    - コードはChagGPTが生成
  
  - ローソク足チャートの表示を実装した
    - 参考: [PR #18 - feat: implement candlestick chart component (refs #14)](https://github.com/koki-ymd/stock-viewer/pull/18)
    - ライブラリをrechartsからlightweight-chartsに変更
      - rechartsではローソク足の表示に向かなかった
      - 手順生成の段階でローソク足について言及せず、単にチャート表示としていたことで、rechartsを使う想定になっていた
    - lighrweight-cahartsでは、デフォルトでチルト・パン・ズームイン・ズームアウトができる
    - 現状、取得するデータの範囲が短期間でチャートを動かしても意味がないので、操作を無効にした
    - コードはChatGPTが生成

---

### 2025-11-22
- 手順4の一部として認証機能の追加を行なった
  - 参考: [PR #25 - feature: backend authentication](https://github.com/koki-ymd/stock-viewer/pull/25)
  - ダミーユーザーの追加
  - 固定ダミートークンを返すLoginAPIの作成
  - 認証ガードの作成
    - 初め、エンドポイントのシグネチャにHeaderでAuthorizationを受け取るプログラムだった
    - 認証ガードのためDpends(get_current_user)にしたら、AuthorizationがSwaggerUIに認識されず、curlコマンドにAuthorizationが含まれなかった
    - （この時手元のAuthorizationヘッダーを含んだcurlコマンドは意図通りに機能した）
    - HTTPBaererセキュリティスキームを使用することで、SwaggerUIからトークンを紐付けたAuthorizationヘッダーを作成することができるようになった
  - コードはChatGPTが生成

---

### 2025-11-23
- 手順4の一部として、お気に入りAPIの追加、フロントでのログイン後トークン保存、お気に入り機能の追加を行なった
  - お気に入りAPIの追加
    - 参考: [PR #27 - feature: add favorites api](https://github.com/koki-ymd/stock-viewer/pull/27)
    - お気に入りの保存はユーザーをKey, 銘柄リストをvalueとする辞書型の変数をダミーDBとして実装している
    - コードはChatGPTが生成

  - フロントエンドでのログイン後トークン保存
    - 参考：[PR #29 - feature: frontend auth with token](https://github.com/koki-ymd/stock-viewer/pull/29)
    - LoginAPIを叩くとダミートークンが返ってくるので、それをlocalStorageに保存
    - コードはChatGPTが生成

  - フロントエンドでのお気に入り機能
    - 参考: [PR #30 - feature: frontend add favorites feature](https://github.com/koki-ymd/stock-viewer/pull/30)
    - フロントの変数に保存していたものをFavoriteAPIを叩くようにした
    - FavoriteAPIが認証が必要なので、Authonticated HeaderにBaerer <token>をつける関数を作成した
    - コードはChatGPTが生成
