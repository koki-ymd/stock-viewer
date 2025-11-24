# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.settings import settings

from routers import auth_router, favorites_router, stocks_router

app = FastAPI(title="Stock Viewer API")

# ======================================================
# 1. CORS の設定（APP_ENV=local のときだけ有効）
# ======================================================
if settings.APP_ENV == "local":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_ORIGIN],  # 例: http://localhost:5173
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# ======================================================
# 2. ヘルスチェック
# ======================================================
@app.get("/api/health")
def health():
    return {"status": "ok"}

# ======================================================
# 3. API ルータ
# ======================================================
app.include_router(stocks_router, prefix="/api", tags=["stocks"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(favorites_router, prefix="/api", tags=["favorites"])

# ======================================================
# 4. 静的ファイルの配信（Cloud Run 本番用）
# ======================================================
# Docker の Stage1 で ./static に dist が配置される想定
# ⇒ APP_ENV=production のときにのみ有効化した方が安全
if settings.APP_ENV == "production":
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

