# backend/routers/stocks.py
from typing import List, Optional

from fastapi import APIRouter

from schemas.stocks import StockCandle
from services.stocks_service import fetch_stock_history

router = APIRouter(
    prefix="/stocks",
    tags=["stocks"],
)


@router.get(
    "/{symbol}/history",
    response_model=List[StockCandle],
    summary="指定銘柄の株価履歴を取得",
)
def get_stock_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d",
):
    """
    指定銘柄の株価履歴を取得するエンドポイント。
    実際の取得ロジックは services.stocks_service に委譲する。
    """
    return fetch_stock_history(symbol=symbol, period=period, interval=interval)


@router.get(
    "/search",
    summary="銘柄検索（ダミー実装）",
)
def search_stocks(query: str | None = None):
    return {
        "query": query,
        "items": [],
        "todo": True,
        "note": "銘柄検索ロジックは後で実装",
    }

