import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: number | null;
  login: (token: string, expiresInSeconds: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("auth_token");
  });

  const [expiresAt, setExpiresAt] = useState<number | null>(() => {
    const stored = localStorage.getItem("auth_expires_at");
    if (!stored) return null;

    const num = Number(stored);

    // 無効な値 or 期限切れなら削除して null 扱い
    if (Number.isNaN(num) || Date.now() >= num) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_expires_at");
      return null;
    }

    return num;
  });

  // 期限切れ判定
  const isExpired = expiresAt !== null && Date.now() >= expiresAt;

  // ログイン処理（トークン＋期限を保存）
  const login = (newToken: string, expiresInSeconds: number) => {
    const expires = Date.now() + expiresInSeconds * 1000;

    setToken(newToken);
    setExpiresAt(expires);

    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_expires_at", String(expires));
  };

  // ログアウト処理
  const logout = () => {
    setToken(null);
    setExpiresAt(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_expires_at");
  };

  // 期限切れになった瞬間に自動ログアウト
  useEffect(() => {
    if (isExpired) {
      logout();
    }
  }, [isExpired]);

  const value: AuthContextType = {
    isAuthenticated: token !== null && !isExpired,
    token,
    expiresAt,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

