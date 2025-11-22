# backend/schemas/stocks.py
from pydantic import BaseModel


class StockCandle(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

