# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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
    app.mount("/static", StaticFiles(directory="static", html=True), name="static")

    # SPA 用: /api 以外のパスは全部 index.html を返す
    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_router(full_path: str):
        # /api で始まるものはここでは扱わない（API の 404 を返す）
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Not Found")
        return FileResponse("static/index.html")

    @app.get("/", include_in_schema=False)
    async def spa_index():
        return FileResponse("static/index.html")

