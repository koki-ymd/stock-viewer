// src/api/stocks.ts
import { apiClient } from "./client";
import type { StockHistoryPoint } from "../types/stock";

export const fetchStockHistoryApi = async (
  symbol: string,
  period = "1mo",
  interval = "1d"
): Promise<StockHistoryPoint[]> => {
  const params = new URLSearchParams({
    period,
    interval,
  });

  return apiClient.get<StockHistoryPoint[]>(
    `/api/stocks/${encodeURIComponent(symbol)}/history?${params.toString()}`
  );
};

