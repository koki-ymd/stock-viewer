# Stock Viewer API

FastAPI + yfinance によるバックエンド API の仕様。

---

## ベース URL

- ローカル開発環境: `http://localhost:8000/api`

全てのエンドポイントは `/api` をプレフィックスに持つ

---

## エンドポイント一覧

| メソッド | パス                       | 説明                     | 状態 |
|---------|----------------------------|--------------------------|------|
| GET     | `/api/health`                  | ヘルスチェック           | 実装済 |
| GET     | `/api/stocks/{symbol}/history` | 株価履歴（ローソク足）取得  | 実装済 |
| GET     | `/api/stocks/search`           | 銘柄検索（ダミー）        | ダミー |
| POST    | `/api/auth/login`              | JWT アクセストークン取得     | 実装済  |
| GET     | `/api/auth/me`                 | 認証ガード動作確認        | 実装済 |
| POST    | `/api/favorites`               | お気に入り登録・解除トグル   | 実装済 |
| GET     | `/api/favorites`               | お気に入り一覧            | 実装済 |
---

## 共通仕様
### 認証
- 以下のエンドポイントは共通してJWT認証が必要です:
  - `GET /api/stocks/{symbol}/history`
  - `GET /api/stocks/search`
  - `GET /api/auth/me`
  - `POST /api/favorites`
  - `GET /api/favorites`

**認証ヘッダ**
  ```text
  Authorization: Bearer <access_token>
  ```
### 共通エラー
**401 Unauthorized**

アクセス拒否条件
- トークン無し
- トークン形式が不正
- トークンの署名が不正
- トークンの有効期限が切れている

例
```json
{
  "detail": "Not authenticated"
}
```
**422 Unprocessable Entity**
- FastAPI のバリデーションエラー時に返る（リクエストボディやクエリが不正な場合）
- 現時点では詳細バリデーションは未実装だが、将来的なエラーとして想定

---

## GET /api/health

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

## GET /api/stocks/{symbol}/history

### 説明

- 指定した銘柄シンボルの株価履歴（ローソク足）を取得します。
- データは yfinance を使用して取得します。
- **このエンドポイントは JWT 認証が必要です。**

### リクエストヘッダ

```http
Authorization: Bearer <JWT access_token>
Content-Type: application/json
```

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

## GET /api/stocks/search（ダミー）

### 説明

- 将来的に実装を検討している銘柄検索 API。
- 現在はダミーレスポンスを返します。
- **このエンドポイントは JWT 認証が必要です。**

### リクエストヘッダ

```http
Authorization: Bearer <JWT access_token>
Content-Type: application/json
```

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

## POST /api/auth/login　（ダミーユーザーによるログイン）
### 説明
- username を受け取り、存在しない場合はダミーDBにユーザー登録する。
- JWT アクセストークンを発行して返します。
- トークンには `sub` としてユーザーIDを含み、有効期限は `.env` の `JWT_EXPIRE_MINUTES` により決定されます。

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
  "access_token": "<jwt-token-string>",
  "token_type": "bearer",
  "expires_in_seconds": 3600
}
```

レスポンス説明
- access_token: JWT トークン本体
- token_type: "bearer" 固定
- expires_in_seconds: トークンの残り有効期限（秒）

### エラー例
- 422 Unprocessable Entity（バリデーションエラー時）

---

## GET /api/auth/me
### 説明
- 認証されたユーザー情報を返す API。
- `Authorization: Bearer <JWT>` が必要。
- トークンが不正・期限切れの場合は 401 を返します。

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

## POST /api/favorites
### 説明
- ログインユーザーのお気に入り銘柄を追加・削除する(リクエストしたシンボルが登録済なら削除するトグル形式)

### リクエスト
**Header**
```http
Authorization: Bearer <JWT access_token>
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

## GET /api/favorites
### 説明
- ログインユーザーのお気に入り一覧を取得
### リクエスト
**Header**
```http
Authorization: Bearer <JWT access_token>
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



