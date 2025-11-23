# backend/routers/auth_router.py
from fastapi import APIRouter, Depends

from schemas import UserRead, LoginRequest, TokenResponse
from services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    """
    ダミーログインAPI。
    - username を受け取るが、ダミー段階ではバリデーションはほぼ無し
    - 固定のダミートークンを返す
    """
    token = auth_service.login_user(body.username)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserRead)
def read_me(current_user: UserRead = Depends(auth_service.get_current_user)):
    """
    認証ガードの動作確認用。
    - Authorization: Bearer dummy-token が付いていれば user 情報が返る
    - 無ければ 401
    """
    return current_user

