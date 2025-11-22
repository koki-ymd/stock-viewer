# backend/services/auth_service.py
from typing import Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from schemas.user import UserRead

# =========================
# ダミーユーザー & トークン
# =========================

# in-memory ユーザーデータ
_FAKE_USERS_DB: Dict[str, UserRead] = {
    "user1": UserRead(id="user1", name="Dummy User 1"),
}

# ダミートークン（固定）
DUMMY_TOKEN = "dummy-token"

# token -> user_id
_TOKEN_USER_MAP: Dict[str, str] = {
    DUMMY_TOKEN: "user1",
}

# HTTPBearer セキュリティスキーム
security = HTTPBearer(auto_error=False)


def register_user(username: str) -> UserRead:
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
    ダミーログイン用。
    - username があれば OK
    - 無ければ register_user してからトークンを返す
    - 返すトークンは常に DUMMY_TOKEN
    """
    register_user(username)
    return DUMMY_TOKEN


def _resolve_user_from_token(token: str | None) -> UserRead:
    """
    アクセストークン文字列から UserRead を引く内部関数。
    """
    if token is None:
        raise ValueError("Missing token")

    # token → user_id
    user_id = _TOKEN_USER_MAP.get(token)
    if user_id is None:
        raise ValueError("Invalid token")

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

