# backend/core/settings.py

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    アプリ全体の設定を一元管理するクラス。

    - .env に記述した環境変数を自動で読み込む
    - credentials や secret key を Python コードに直接書かない
    - Cloud Run / Docker / ローカルすべてで同じ interface になる
    """

    # =========================
    # 実行環境
    # =========================
    # "local" / "prod" など。未設定なら local 扱いにしておく。
    APP_ENV: str = "local"

    # ローカル開発時のフロントエンド URL
    # 例）http://localhost:5173
    # 本番（Cloud Run モノリス）では基本的に同一オリジンなので未設定でOK
    FRONTEND_ORIGIN: str | None = "http://localhost:5173"

    # =========================
    # JWT 設定
    # =========================
    JWT_SECRET_KEY: str                  # .env に必須
    JWT_ALGORITHM: str = "HS256"         # デフォルト値あり
    JWT_EXPIRE_MINUTES: int = 60         # デフォルト60分

    class Config:
        env_file = ".env"                # backend/.env を自動で読む
        env_file_encoding = "utf-8"

    @property
    def cors_origins_list(self) -> list[str]:
        if not self.FRONTEND_ORIGIN:
            return []
        return [o.strip() for o in self.FRONTEND_ORIGIN.split(",") if o.strip()]

# アプリ全体から参照する Settings インスタンス
settings = Settings()

