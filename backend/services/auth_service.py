# backend/services/auth_service.py
from typing import Dict
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from schemas import UserRead
from core.settings import settings

# =========================
# JWT 設定（.env から取得）
# =========================

JWT_SECRET_KEY = settings.JWT_SECRET_KEY
JWT_ALGORITHM = settings.JWT_ALGORITHM
JWT_EXPIRE_MINUTES = settings.JWT_EXPIRE_MINUTES

# =========================
# ダミーユーザー (DB代わり)
# =========================

# in-memory ユーザーデータ
_FAKE_USERS_DB: Dict[str, UserRead] = {
    "user1": UserRead(id="user1", name="Dummy User 1"),
}

# HTTPBearer セキュリティスキーム
security = HTTPBearer(auto_error=False)

# =========================
# JWT ヘルパー
# =========================

def _create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    JWT アクセストークンを発行する内部関数。
    data には最低限 "sub": user_id を含める想定。
    """
    to_encode = data.copy()

    if expires_delta is None:
        expires_delta = timedelta(minutes=JWT_EXPIRE_MINUTES)

    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )
    return encoded_jwt

def _register_user(username: str) -> UserRead:
    """
    ユーザーをダミーDBに登録（すでにあればそのまま返す）。
    ダミー段階 では login_user から内部的に使うだけ。
    """
    if username in _FAKE_USERS_DB:
        return _FAKE_USERS_DB[username]

    user = UserRead(id=username, name=username)
    _FAKE_USERS_DB[username] = user
    return user


def login_user(username: str) -> str:
    """
    ログイン処理。
    - username があれば OK
    - 無ければ register_user してから JWT を返す
    - 返すトークンはユーザーごとに異なる JWT
    """
    user = _register_user(username)

    # "sub" (subject) にユーザーIDを入れて JWT を発行
    access_token = _create_access_token({"sub": user.id})
    return access_token


def _resolve_user_from_token(token: str | None) -> UserRead:
    """
    アクセストークン文字列から UserRead を引く内部関数。
    JWT を検証して "sub" を取り出し、ダミーDBからユーザーを取得。
    """
    if token is None:
        raise ValueError("Missing token")

    try:
        # JWT を検証・デコード
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
    except JWTError:
        # 署名不正・期限切れなど
        raise ValueError("Invalid token")

    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise ValueError("Invalid token payload")

    user = _FAKE_USERS_DB.get(user_id)
    if user is None:
        raise ValueError("User not found")

    return user

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> UserRead:
    """
    routers から Depends(get_current_user) で使う認証ガード。

    - HTTPBearer によって Authorization ヘッダをパース
      （"Bearer xxx" の形式）
    - トークンが無ければ 401
    - 不正なトークンなら 401
    """
    if credentials is None:
        # Authorization ヘッダ自体が無い、または Bearer でない場合
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        return _resolve_user_from_token(credentials.credentials)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

