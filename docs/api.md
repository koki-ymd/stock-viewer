# Stock Viewer API

FastAPI + yfinance によるバックエンド API の仕様。

---

## ベース URL

- ローカル開発環境: `http://localhost:8000`

---

## エンドポイント一覧

| メソッド | パス                       | 説明                     | 状態 |
|---------|----------------------------|--------------------------|------|
| GET     | `/health`                  | ヘルスチェック           | 実装済 |
| GET     | `/stocks/{symbol}/history` | 株価履歴（ローソク足）取得  | 実装済 |
| GET     | `/stocks/search`           | 銘柄検索（ダミー）        | ダミー |
| POST    | `/auth/login`              | トークン取得(ダミー)      | 実装済  |
| GET     | `/auth/me`                 | 認証ガード動作確認        | 実装済 |
| POST    | `/favorites`               | お気に入り登録・解除トグル   | 実装済 |
| GET     | `/favorites`               | お気に入り一覧            | 実装済 |
---

## 共通仕様
### 認証
- 以下のエンドポイントは共通して認証が必要です:
  - `GET /auth/me`
  - `POST /favorites`
  - `GET /favorites`
- リクエストヘッダ:
  ```text
  Authorization: Bearer <access_token>
  ```
### 共通エラー
**401 Unauthorized**
- 認証トークンが無い、または不正な場合
- 例
```json
{
  "detail": "Not authenticated"
}
```
**422 Unprocessable Entity**
- FastAPI のバリデーションエラー時に返る（リクエストボディやクエリが不正な場合）
- 現時点では詳細バリデーションは未実装だが、将来的なエラーとして想定

---

## GET /health

### 説明
アプリケーションが正常に動作しているか確認するためのエンドポイント。

### リクエスト
- メソッド: GET
- パス: `/health`

### レスポンス（例）
```json
{ "status": "ok" }
```

---

## GET /stocks/{symbol}/history

### 説明

- 指定した銘柄シンボルの株価履歴（ローソク足）を取得します。
- データは yfinance を使用して取得します。

### パスパラメータ

| 名前     | 型      | 必須 | 説明                   |
| ------ | ------ | -- | -------------------- |
| symbol | string | 必須 | 銘柄コード（例: AAPL, TSLA） |

### クエリパラメータ

| 名前       | 型      | デフォルト | 説明   |
| -------- | ------ | ----- | ---- |
| period   | string | `1mo` | 取得期間 |
| interval | string | `1d`  | 足の間隔 |

### レスポンス例

```json
[
  {
    "date": "2025-01-01",
    "open": 123.45,
    "high": 125.67,
    "low": 122.22,
    "close": 124.56,
    "volume": 12345678
  }
]
```

### エラー例
- 404 Not Found
  ```json
  { "detail": "No data for given symbol/params" }
  ```
- 422 Unprocessable Entity（バリデーションエラー時）

---

## GET /stocks/search（ダミー）

### 説明

- 将来的に実装を検討している銘柄検索 API。
- 現在はダミーレスポンスを返します。

### クエリパラメータ

| 名前    | 型      | 必須 | 説明    |
| ----- | ------ | -- | ----- |
| query | string | 任意 | 検索文字列 |

### レスポンス例

```json
{
  "query": "AAPL",
  "items": [],
  "todo": true,
  "note": "銘柄検索ロジックは後で実装"
}
```
### エラー例
- 422 Unprocessable Entity（バリデーションエラー時）

---

## POST /auth/login　（ダミーユーザーによるログイン）
### 説明
- usernameを受け取りトークンを返すAPI
- 現在はどんなユーザーでもログインすると固定ダミートークンを返す

### リクエスト
**Header**
```http
Content-Type: application/json
```
**Body (JSON)**
```json
{
  "username": "user1"
}
```

### レスポンス
```json
{
  "access_token": "<token-string>",
  "token_type": "bearer"
}
```

### エラー例
- 422 Unprocessable Entity（バリデーションエラー時）

---

## GET /auth/me
### 説明
- 認証ガードの動作確認用API
- Authorization: Bearer dummy-token が付いていれば user 情報が返る
- 無ければ 401

### レスポンス
```json
{
  "id": "user1",
  "name": "Dummy User 1"
}
```
### エラー例
- 401 Unauthorized（共通仕様を参照）

---

## POST /favorites
### 説明
- ログインユーザーのお気に入り銘柄を追加・削除する(リクエストしたシンボルが登録済なら削除するトグル形式)

### リクエスト
**Header**
```http
Authorization: Bearer dummy-token
Content-Type: application/json
```

**Body**
```json
{
  "symbol": "AAPL"
}
```

### レスポンス
- 追加後の例(7203.TとAAPLを登録)
```json
{
  "user_id": "user1",
  "symbols": [
    "7203.T",
    "AAPL"
  ]
}
```
- 削除後(全て削除された状態)
```json
{
  "user_id": "user1",
  "symbols": []
}
```

### エラー例
- 401 Unauthorized（共通仕様を参照）
- 422 Unprocessable Entity（バリデーションエラー時）

---

## GET /favorites
### 説明
- ログインユーザーのお気に入り一覧を取得
### リクエスト
**Header**
```http
Authorization: Bearer dummy-token
Content-Type: application/json
```

### レスポンス
```json
{
  "user_id": "user1",
  "symbols": [
    "7203.T",
    "AAPL"
  ]
}
```

### エラー例
- 401 Unauthorized（共通仕様を参照）
- 422 Unprocessable Entity（バリデーションエラー時）
