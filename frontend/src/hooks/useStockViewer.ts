// src/hooks/useStockViewer.ts
import { useEffect, useState } from "react";
import type { StockHistoryPoint } from "../types/stock";
import { fetchStockHistoryApi } from "../api/stocks";
import { fetchFavoritesApi, toggleFavoriteApi } from "../api/favorites";

export const useStockViewer = () => {
  const [symbolInput, setSymbolInput] = useState("");
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);
  const [history, setHistory] = useState<StockHistoryPoint[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初回マウント時にお気に入り一覧を取得
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const list = await fetchFavoritesApi();
        setFavorites(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("お気に入り取得に失敗", e);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, []);

  const fetchHistory = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchStockHistoryApi(symbol);
      setHistory(data);
      setCurrentSymbol(symbol);
    } catch (e: any) {
      setError(e?.message ?? "データ取得に失敗しました");
      setHistory([]);
      setCurrentSymbol(null);
    } finally {
      setLoading(false);
    }
  };

  // 検索フォームから呼ばれる
  const handleSearchSubmit = () => {
    if (!symbolInput.trim()) return;
    fetchHistory(symbolInput.trim().toUpperCase());
  };

  // チャートから「☆」押下
  const handleAddFavorite = async () => {
    if (!currentSymbol) return;
    try {
      const updated = await toggleFavoriteApi(currentSymbol);
      setFavorites(updated);
    } catch (e) {
      console.error("お気に入りトグルに失敗", e);
    }
  };

  // お気に入り一覧で銘柄クリック
  const handleSelectFavorite = (symbol: string) => {
    setSymbolInput(symbol);
    fetchHistory(symbol);
  };

  // お気に入り一覧で削除（トグルAPIで OFF にする）
  const handleRemoveFavorite = async (symbol: string) => {
    try {
      const updated = await toggleFavoriteApi(symbol);
      setFavorites(updated);
    } catch (e) {
      console.error("お気に入り削除に失敗", e);
    }
  };

  return {
    // state
    symbolInput,
    currentSymbol,
    history,
    favorites,
    loading,
    error,
    // setter
    setSymbolInput,
    // handlers
    handleSearchSubmit,
    handleAddFavorite,
    handleSelectFavorite,
    handleRemoveFavorite,
  };
};

