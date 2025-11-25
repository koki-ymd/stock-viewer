# Cloud Run デプロイ手順（deployment.md）

このドキュメントでは、**株価ビューワー Web アプリ**を  
GCP Cloud Run にデプロイするための手順をまとめます。

- 対象：`React + FastAPI` を 1 コンテナにまとめたアプリ
- デプロイ方法：`gcloud builds submit` → Cloud Run へ手動デプロイ
- 対象環境：Cloud Run の dev / prod（2 サービス運用を想定）

---

## 1. 前提条件

以下が準備できていることを前提とします。

- gcloud CLI がインストール済み
- `gcloud init` 済み（GCP アカウント / プロジェクト選択済み）
- プロジェクト ID・リージョンを把握している
  - プロジェクト ID 例: `stock-viewer-prod`
  - リージョン例: `asia-northeast1`
- Artifact Registry 用のリポジトリが作成済み
  - 例: `stock-viewer-repo`
- リポジトリのルートにいる状態でコマンドを実行する

よく使う値は、シェル変数に入れておくと便利です。

```bash
PROJECT_ID=stock-viewer-prod
REGION=asia-northeast1
REPO=stock-viewer-repo

SERVICE_DEV=stock-viewer-dev
SERVICE_PROD=stock-viewer-prod
```

---

## 2. 使用するファイル

- `infra/Dockerfile.prod`  
  - Cloud Run 用コンテナイメージをビルドする Dockerfile  
  - FastAPI + フロントビルドファイル(dist)を 1 コンテナにまとめる

- `infra/cloudbuild.yaml`
  - `gcloud builds submit` 実行時に参照される Cloud Build 設定。
  - Dockerfile は `infra/Dockerfile.prod` を使用します。

```yaml
# infra/cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      [
        'build',
        '-f',
        'infra/Dockerfile.prod',
        '-t',
        '${_IMAGE}',
        '.',
      ]
images:
  - '${_IMAGE}'
```

Cloud Run 用のビルド関連ファイルはすべて `infra/` 配下にまとめています。

---

## 3. Artifact Registry リポジトリの作成（初回のみ）

まだ Artifact Registry のリポジトリを作っていない場合は、最初に一度だけ作成します。

```bash
gcloud artifacts repositories create $REPO \
  --repository-format=docker \
  --location=$REGION \
  --description="Docker repo for stock-viewer"
```

作成済みであれば、このステップは不要です。

---

## 4. コンテナイメージのビルド（Cloud Build）

Cloud Build を使って、Docker イメージをビルドし Artifact Registry にプッシュします。

### 4-1. イメージ名の決定

例

```bash
IMAGE_DEV="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/stock-viewer-dev:latest"
IMAGE_PROD="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/stock-viewer-prod:latest"
```
※ Artifact Registry のイメージパスは`REGION-docker.pkg.dev/<PROJECT_ID>/<REPO>/<IMAGE_NAME>:tag`の形式になる。

### 4-2. dev イメージのビルド

```bash
gcloud builds submit \
  --project $PROJECT_ID \
  --config infra/cloudbuild.yaml \
  --substitutions _IMAGE="$IMAGE_DEV" \
  .
```

### 4-3. prod イメージのビルド

```bash
gcloud builds submit \
  --project $PROJECT_ID \
  --config infra/cloudbuild.yaml \
  --substitutions _IMAGE="$IMAGE_PROD" \
  .
```

※ `cloudbuild.yaml` は共通 → `_IMAGE` のみ切り替え

---

## 5. Cloud Run へのデプロイ

### 5-1. dev 環境へのデプロイ

```bash
gcloud run deploy $SERVICE_DEV \
  --project $PROJECT_ID \
  --image "$IMAGE_DEV" \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8000 \
  --min-instances=1
```

ポイント：

- `--port 8000`  
  - FastAPI を :8000 で起動しているため揃えている
  - ※ Cloud Run の $PORT を uvicorn に渡す構成も可（例：--port $PORT）
- `--min-instances=1`  
  - コールドスタート対策
  - コストと速度のトレードオフ

### 5-2. prod 環境へのデプロイ

```bash
gcloud run deploy $SERVICE_PROD \
  --project $PROJECT_ID \
  --image "$IMAGE_PROD" \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8000 \
  --min-instances=1
```

devとprodの違いはサービス名と使用イメージのみ

---

## 6. デプロイ後の確認

デプロイが成功すると、`gcloud run deploy` の出力に URL が表示されます。

例：

```text
Service [stock-viewer-prod] revision [stock-viewer-prod-00001-xxx] has been deployed and is serving 100 percent of traffic at https://stock-viewer-xxxxxx-yyy.a.run.app
```

ブラウザでその URL を開き、以下を確認します。

- `/` でReactのSPAが表示される
- `/login` → ログイン → Home 画面へ遷移できる
- 銘柄検索 → ローソク足がチャート表示される
- DevTools から `/api/...` へのリクエストが 200 で返っている

---

## 7. Cloud Runの設定変更(任意)

### 7-1. 最小インスタンス数

```bash
gcloud run services update $SERVICE_PROD \
  --project $PROJECT_ID \
  --region $REGION \
  --min-instances=0
```
- 0：コスト最小、初回アクセスが重い
- 1：常時起動のためレスポンスが速い

※ 本番は 1 を推奨（コールドスタート対策）

### 7-2. 同時接続数/最大インスタンス数

```bash
gcloud run services update $SERVICE_PROD \
  --project $PROJECT_ID \
  --region $REGION \
  --concurrency=80 \
  --max-instances=5
```

※ MVP では必須ではないため、説明のみ記載。

---

## 8. FastAPI 側の静的ファイル配信（Cloud Run 動作の補足）

Cloud Run では、フロントエンドの dist を FastAPI の StaticFiles で配信しています。

例（main.py）：
```python
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/{full_path:path}")
def spa_router(full_path: str):
    # React Router 用に index.html を返却
    return FileResponse("static/index.html")

```

この構成により：
- /api/* → FastAPI API
- /static/* → React ビルドファイル
- /login, /favorites ← React Router が処理（index.html を返す）

という Cloud Run での SPA 配信が成立しています。

---

## 9. 今後の CI/CD への拡張 （メモ）

現状の運用:
1. `gcloud builds submit` でイメージをビルド
2. `gcloud run deploy` でサービスを更新

将来的には：

- Cloud Build トリガーを設定し、
  - GitHub の特定ブランチへの push → Cloud Build → Cloud Run 更新
- または GitHub Actions から `gcloud` を叩いてデプロイ

などにより、自動化した CI/CD へ移行可能。

## 10. dev / prod を分ける意図（補足）

- `prod`: ポートフォリオ公開用の安定環境  
- `dev`: 今後の機能追加や検証用の環境（本番とは分離して運用）

外部公開用の URL は `prod` のみを共有し、`dev` は検証専用として扱います。

