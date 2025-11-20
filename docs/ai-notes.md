ChatGPTを用いて何をしたか書く

### 2025-11-18
- ChatGPTで開発手順の作成を行った

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
    - CORSの設定について、あらかじめ生成した手順には載っていなかった
    - バックエンド側の実装として、手順2として実装した

