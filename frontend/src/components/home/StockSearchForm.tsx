// src/components/home/StockSearchForm.tsx
import React from "react";

type Props = {
  symbolInput: string;
  onSymbolInputChange: (value: string) => void;
  onSubmit: () => void;
};

export const StockSearchForm: React.FC<Props> = ({
  symbolInput,
  onSymbolInputChange,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <label>
        銘柄コード：
        <input
          type="text"
          value={symbolInput}
          onChange={(e) => onSymbolInputChange(e.target.value)}
          placeholder="例: AAPL"
          style={{ marginLeft: 8 }}
        />
      </label>
      <button type="submit" style={{ marginLeft: 8 }}>
        検索
      </button>
    </form>
  );
};

