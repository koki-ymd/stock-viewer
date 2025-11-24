// src/api/favorites.ts
import { apiClient } from "./client";

type FavoritesResponse = {
  user_id: string;
  symbols: string[];
};

// お気に入り一覧
export const fetchFavoritesApi = async (): Promise<string[]> => {
  const data = await apiClient.get<FavoritesResponse>("/api/favorites");
  return data.symbols;
};

// トグルで追加
export const toggleFavoriteApi = async (
  symbol: string
): Promise<string[]> => {
  const data = await apiClient.post<FavoritesResponse>("/api/favorites", {
    symbol,
  });
  return data.symbols;
};

