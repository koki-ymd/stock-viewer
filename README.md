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

- **状態:** 初期セットアップ中（Step 0–3）
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
- UI ライブラリ等は今後選定

**バックエンド**

- Python + FastAPI（予定）
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
  backend/        # Python + FastAPI + yfinance （予定）
  frontend/       # React + TypeScript （予定）
  infra/          # Dockerfile, Cloud Run 用設定, IaC 等（予定）
```

---

## 手順について
進行度に合わせて更新してきます。
<details>
<summary> 手順1 </summary>
  
参考ブランチ: feature/dev-container
- Dockerfile.dev、docker-compose.dev.ymlの作成
- Dockerfile.devはpython・node.jsを含める開発用コンテナ
- FastAPI/yfinance用のrequirementsはこの段階では入れていない
</details>
