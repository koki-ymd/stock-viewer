// src/api/auth.ts
import { apiClient } from "./client";
import type { TokenResponse } from "../types/auth";

export async function loginApi(username: string): Promise<TokenResponse> {
  return apiClient.post<TokenResponse>(
    "/api/auth/login",
    { username },
    {
      auth: false, // ログイン時はトークン不要
    }
  );
}

