// stc/types/auth.ts

export type LoginRequest = {
  username: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;          // "bearer"
  expires_in_seconds: number;  // バックエンドの TokenResponse と一致
};

