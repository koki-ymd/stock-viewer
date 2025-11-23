// src/api/auth.ts
const API_BASE_URL = "http://localhost:8000"; // 後でenv化

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export async function loginApi(username: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    throw new Error("Failed to login");
  }

  return res.json();
}

