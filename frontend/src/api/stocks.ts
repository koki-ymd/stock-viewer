// src/api/stocks.ts
import type { StockHistoryPoint } from "../types/stock";

const API_BASE_URL = "http://localhost:8000";

export const fetchStockHistoryApi = async (symbol: string): Promise<StockHistoryPoint[]> => {
  const res = await fetch(
    `${API_BASE_URL}/stocks/${encodeURIComponent(symbol)}/history`
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data: StockHistoryPoint[] = await res.json();
  return data;
};

