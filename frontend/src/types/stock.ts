// src/types/stock.ts

// 1本分の株価データ
export type StockHistoryPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// 履歴の配列（エンドポイントのレスポンスそのもの）
export type StockHistoryResponse = StockHistoryPoint[];

