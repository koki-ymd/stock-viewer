# backend/schemas/favorites.py
from typing import List
from pydantic import BaseModel


class FavoriteRequest(BaseModel):
    """
    お気に入り登録用のリクエストボディ。
    例: { "symbol": "7203.T" }
    """
    symbol: str


class FavoritesResponse(BaseModel):
    """
    お気に入り一覧のレスポンス。
    例:
    {
      "user_id": "user1",
      "symbols": ["7203.T", "AAPL"]
    }
    """
    user_id: str
    symbols: List[str]

