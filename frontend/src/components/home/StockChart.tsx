// src/components/home/StockChart.tsx
import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  CrosshairMode,
  type UTCTimestamp,
} from "lightweight-charts";
import type { StockHistoryPoint } from "../../types/stock";

type Props = {
  symbol: string | null;
  history: StockHistoryPoint[];
  loading: boolean;
  onAddFavorite: () => void;
  canAddFavorite: boolean;
};

const CHART_HEIGHT = 360;

export const StockChart: React.FC<Props> = ({
  symbol,
  history,
  loading,
  onAddFavorite,
  canAddFavorite,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // シンボルや履歴がないときは何もしない
    if (!containerRef.current || !symbol || history.length === 0) {
      return;
    }

    const element = containerRef.current;

    // チャート作成
    const chart = createChart(element, {
      width: element.clientWidth,
      height: CHART_HEIGHT,
      layout: {
        background: { type: ColorType.Solid, color: "#111" },
        textColor: "#ddd",
      },
      grid: {
        vertLines: { color: "#444444" },
        horzLines: { color: "#444444" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "#555555",
        // 上下に 10% ずつマージン
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: "#555555",
      },
      handleScroll: false, // スクロール OFF
      handleScale: false,  // ズーム OFF
    });

    // ローソク足シリーズ追加
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // history -> ライブラリ用データに変換
    const data = history.map((p) => {
      // p.date: "YYYY-MM-DD" 形式の string を Unix time (秒) に変換
      const timestamp = Math.floor(
        new Date(p.date).getTime() / 1000
      ) as UTCTimestamp;

      return {
        time: timestamp,
        open: p.open,
        high: p.high,
        low: p.low,
        close: p.close,
      };
    });

    candleSeries.setData(data);

    // X 軸をデータ範囲にフィット
    chart.timeScale().fitContent();

    // サイズ調整（ウィンドウリサイズ対応）
    const handleResize = () => {
      if (containerRef.current) {
        chart.resize(containerRef.current.clientWidth, CHART_HEIGHT);
      }
    };

    window.addEventListener("resize", handleResize);

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbol, history]);

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
            <div
              ref={containerRef}
              style={{
                marginTop: 8,
                width: "100%",
                height: CHART_HEIGHT,
              }}
            />
          )}
        </>
      )}
    </section>
  );
};

