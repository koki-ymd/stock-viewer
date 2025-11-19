# backend/main.py
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yfinance as yf

app = FastAPI(title="Stock Viewer API")


@app.get("/health")
def health():
    return {"status": "ok"}


class StockCandle(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


@app.get(
    "/stocks/{symbol}/history",
    response_model=List[StockCandle],
    summary="指定銘柄の株価履歴を取得",
)
def get_stock_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d",
):
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period, interval=interval)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch data: {e}")

    if df.empty:
        raise HTTPException(status_code=404, detail="No data for given symbol/params")

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


@app.get("/stocks/search")
def search_stocks(query: str | None = None):
    return {
        "query": query,
        "items": [],
        "todo": True,
        "note": "銘柄検索ロジックは後で実装",
    }

