// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { StockSearchForm } from "../components/home/StockSearchForm";
import { StockChart } from "../components/home/StockChart";
import { FavoritesList } from "../components/home/FavoritesList";
import type { StockHistoryPoint } from "../types/stock";

const Home: React.FC = () => {
  const [symbolInput, setSymbolInput] = useState("");
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);
  const [history, setHistory] = useState<StockHistoryPoint[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初回マウント時にダミー銘柄やお気に入りを読み込む場合があればここ
  useEffect(() => {
    // 例: setFavorites(["AAPL", "GOOGL"]);
  }, []);

  const fetchHistory = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:8000/stocks/${encodeURIComponent(symbol)}/history`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: StockHistoryPoint[] = await res.json();
      setHistory(data);
      setCurrentSymbol(symbol);
    } catch (e: any) {
      setError(e.message ?? "データ取得に失敗しました");
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

  // お気に入りに追加
  const handleAddFavorite = () => {
    if (!currentSymbol) return;
    if (favorites.includes(currentSymbol)) return;
    setFavorites((prev) => [...prev, currentSymbol]);
  };

  // お気に入り一覧で銘柄クリック
  const handleSelectFavorite = (symbol: string) => {
    setSymbolInput(symbol);
    fetchHistory(symbol);
  };

  // お気に入り一覧で削除
  const handleRemoveFavorite = (symbol: string) => {
    setFavorites((prev) => prev.filter((s) => s !== symbol));
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px" }}>
      <h1>株価ビューアー</h1>

      <StockSearchForm
        symbolInput={symbolInput}
        onSymbolInputChange={setSymbolInput}
        onSubmit={handleSearchSubmit}
      />

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>
          エラー: {error}
        </p>
      )}

      <StockChart
        symbol={currentSymbol}
        history={history}
        loading={loading}
        onAddFavorite={handleAddFavorite}
        canAddFavorite={!!currentSymbol && !favorites.includes(currentSymbol)}
      />

      <FavoritesList
        favorites={favorites}
        onSelect={handleSelectFavorite}
        onRemove={handleRemoveFavorite}
      />
    </div>
  );
};

export default Home;
