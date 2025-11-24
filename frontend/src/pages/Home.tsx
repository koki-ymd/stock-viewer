// src/pages/Home.tsx
import { StockSearchForm } from "../components/home/StockSearchForm";
import { StockChart } from "../components/home/StockChart";
import { FavoritesList } from "../components/home/FavoritesList";
import { useStockViewer } from "../hooks/useStockViewer";

const Home: React.FC = () => {
  const {
    symbolInput,
    currentSymbol,
    history,
    favorites,
    loading,
    error,
    setSymbolInput,
    handleSearchSubmit,
    handleAddFavorite,
    handleSelectFavorite,
    handleRemoveFavorite,
  } = useStockViewer();

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

      {/* --- 操作ヒント（ログアウト方法） --- */}
      <p style={{ marginTop: "24px", fontSize: "0.85rem", color: "#888" }}>
        ※ 現在ログアウト機能は未実装です。ログアウトする場合は、ブラウザの開発者ツールから{" "}
        <code>auth_token</code> を削除し、ページをリロードしてください。
      </p>
    </div>
  );
};

export default Home;

