// src/api/client.ts
const API_BASE_URL =
  // 末尾スラッシュがあっても二重スラッシュにならないように削る
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  /** Authorization: Bearer <token> を付けるかどうか（デフォルト true） */
  auth?: boolean;
  headers?: Record<string, string>;
};

async function request<T>(
  path: string,
  { method = "GET", body, auth = true, headers = {} }: RequestOptions = {}
): Promise<T> {
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 認証が必要な場合は localStorage からトークンを読む
  if (auth) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // エラーメッセージを多少見やすくする
    let message: string;
    try {
      const errorJson = await res.json();
      message = errorJson.detail ?? JSON.stringify(errorJson);
    } catch {
      message = res.statusText;
    }
    throw new Error(`API error ${res.status}: ${message}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(path, { ...options, method: "POST", body }),

  // 必要になったら put / patch / delete も足せばOK
};

