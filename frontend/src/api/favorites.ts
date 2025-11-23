// src/api/favorites.ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type FavoritesResponse = {
  user_id: string;
  symbols: string[];
};

// token を header に付ける共通関数
const authHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// お気に入り一覧
export const fetchFavoritesApi = async () => {
  const res = await fetch(`${API_BASE_URL}/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch favorites: ${res.status}`);
  }
  
  const data: FavoritesResponse = await res.json();
  return data.symbols;
};

// トグルで追加
export const toggleFavoriteApi = async (symbol: string) => {
  const res = await fetch(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ symbol }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch favorites: ${res.status}`);
  }

  const data: FavoritesResponse = await res.json();
  return data.symbols;
};

