# backend/routers/favorites.py
from fastapi import APIRouter, Depends

from schemas import UserRead, FavoriteRequest, FavoritesResponse
from services import favorites_service, auth_service

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.get("/", response_model=FavoritesResponse)
def get_favorites(
    current_user: UserRead = Depends(auth_service.get_current_user),
):
    """
    ログインユーザーのお気に入り一覧を返す
    """
    symbols = favorites_service.get_favorites(current_user.id)
    return FavoritesResponse(user_id=current_user.id, symbols=symbols)


@router.post("/", response_model=FavoritesResponse)
def toggle_favorite(
    body: FavoriteRequest,
    current_user: UserRead = Depends(auth_service.get_current_user),
):
    """
    ログインユーザーのお気に入りを追加する
    """
    symbols = favorites_service.toggle_favorite(current_user.id, body.symbol)
    return FavoritesResponse(user_id=current_user.id, symbols=symbols)

