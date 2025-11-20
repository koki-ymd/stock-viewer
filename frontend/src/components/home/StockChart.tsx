// src/components/home/StockChart.tsx
import React from "react";
import type { StockHistoryPoint } from "../../types/stock";

type Props = {
  symbol: string | null;
  history: StockHistoryPoint[];
  loading: boolean;
  onAddFavorite: () => void;
  canAddFavorite: boolean;
};

export const StockChart: React.FC<Props> = ({
  symbol,
  history,
  loading,
  onAddFavorite,
  canAddFavorite,
}) => {
  return (
    <section style={{ marginTop: 24 }}>
      <h2>チャート</h2>

      {loading && <p>読み込み中です...</p>}

      {!loading && !symbol && <p>銘柄を検索してください。</p>}

      {!loading && symbol && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ margin: 0 }}>{symbol}</h3>
            {canAddFavorite && (
              <button type="button" onClick={onAddFavorite}>
                お気に入りに追加
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p style={{ marginTop: 8 }}>データがありません。</p>
          ) : (
            <div style={{ marginTop: 8 }}>
              {/* 後で Recharts に差し替え予定 */}
              <ul>
                {history.map((point) => (
                  <li key={point.date}>
                    {point.date}: {point.close}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
};

