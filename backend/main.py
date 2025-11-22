# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.auth import router as auth_router
from routers.stocks import router as stocks_router

app = FastAPI(title="Stock Viewer API")

# フロント（Vite）が動いている URL を許可
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, OPTIONS など全て
    allow_headers=["*"],            # Authorization などを許可
)

@app.get("/health")
def health():
    return {"status": "ok"}

# /stocks以下のエンドポイントを登録
app.include_router(stocks_router)

# 認証ルータを登録
app.include_router(auth_router)

