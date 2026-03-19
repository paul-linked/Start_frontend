import type { ApiResponse, ApiError } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.bonappit.com";

// ─── Token Management ───
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("access_token");
  }
  return accessToken;
}

// ─── Core Fetch Wrapper ───
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}/api/v1${endpoint}`;
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      message: res.statusText,
    };
    try {
      const body = await res.json();
      error.message = body.message || body.detail || res.statusText;
      error.detail = body.detail;
    } catch {
      // non-JSON error body
    }

    // Auto-logout on 401
    if (res.status === 401) {
      setAccessToken(null);
    }

    throw error;
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return { data: null as T, status: 204 };
  }

  const data = await res.json();
  return { data, status: res.status };
}

// ─── HTTP Methods ───
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

// ─── Typed Endpoint Helpers (extend as needed) ───
export const endpoints = {
  auth: {
    login: (body: { username: string; password: string }) =>
      api.post("/auth/login", body),
    register: (body: { username: string; password: string }) =>
      api.post("/auth/register", body),
    me: () => api.get("/auth/me"),
  },
  game: {
    create: (settings?: Record<string, unknown>) =>
      api.post("/game", settings),
    get: (id: string) => api.get(`/game/${id}`),
    action: (id: string, action: Record<string, unknown>) =>
      api.post(`/game/${id}/action`, action),
  },
  lobby: {
    list: () => api.get("/lobby"),
    create: (name: string) => api.post("/lobby", { name }),
    join: (id: string) => api.post(`/lobby/${id}/join`),
    leave: (id: string) => api.post(`/lobby/${id}/leave`),
  },
} as const;