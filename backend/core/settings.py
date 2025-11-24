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
    # JWT 設定
    # =========================
    JWT_SECRET_KEY: str                  # .env に必須
    JWT_ALGORITHM: str = "HS256"         # デフォルト値あり
    JWT_EXPIRE_MINUTES: int = 60         # デフォルト60分

    class Config:
        env_file = ".env"                # backend/.env を自動で読む
        env_file_encoding = "utf-8"


# アプリ全体から参照する Settings インスタンス
settings = Settings()

