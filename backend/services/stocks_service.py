# backend/services/stocks_service.py
from typing import List

import yfinance as yf
from fastapi import HTTPException

from schemas.stocks import StockCandle


def fetch_stock_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d",
) -> List[StockCandle]:
    """
    yfinance を用いて株価履歴を取得し、StockCandle のリストとして返す。
    """
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period, interval=interval)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch data: {e}")

    if df.empty:
        raise HTTPException(
            status_code=404,
            detail="No data for given symbol/params",
        )

    results: List[StockCandle] = []
    for idx, row in df.iterrows():
        results.append(
            StockCandle(
                date=idx.strftime("%Y-%m-%d"),
                open=float(row["Open"]),
                high=float(row["High"]),
                low=float(row["Low"]),
                close=float(row["Close"]),
                volume=int(row["Volume"]),
            )
        )

    return results

