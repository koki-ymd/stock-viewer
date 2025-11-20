// src/components/home/FavoritesList.tsx
import React from "react";

type Props = {
  favorites: string[];
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
};

export const FavoritesList: React.FC<Props> = ({
  favorites,
  onSelect,
  onRemove,
}) => {
  return (
    <section style={{ marginTop: 24 }}>
      <h2>お気に入り</h2>

      {favorites.length === 0 ? (
        <p>お気に入りはまだありません。</p>
      ) : (
        <ul>
          {favorites.map((symbol) => (
            <li key={symbol} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => onSelect(symbol)}
                style={{ textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                {symbol}
              </button>
              <button type="button" onClick={() => onRemove(symbol)}>
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

