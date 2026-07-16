// Talks to the real Django backend per "Arborn V1 Authentication API
// Specification". The bare fallback here is for local dev only — the
// deployed build always gets its real value from
// .github/workflows/deploy.yml (currently https://api.arborn.shop), so
// changing this default does not affect production.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const CATALOG_BASE_URL =
  process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "http://localhost:8000/catalog/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; accessToken?: string; baseUrl?: string } = {},
): Promise<T> {
  const { method = "GET", body, accessToken, baseUrl = API_BASE_URL } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new ApiError(detail?.message || detail?.detail || `Request failed (${res.status})`, res.status);
  }

  return res.json();
}

export interface BackendUser {
  id: number;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
}

export function googleLogin(idToken: string) {
  return request<AuthTokens>("/auth/google", {
    method: "POST",
    body: { id_token: idToken },
  });
}

export function refreshAccessToken(refreshToken: string) {
  return request<{ access_token: string }>("/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
}

export function logoutRequest(accessToken: string, refreshToken: string) {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
    accessToken,
    body: { refresh_token: refreshToken },
  });
}

export function getMyProfile(accessToken: string) {
  return request<BackendUser & { first_name: string; last_name: string }>("/users/me", {
    accessToken,
  });
}

export function updateMyProfile(
  accessToken: string,
  data: { first_name?: string; last_name?: string },
) {
  return request<{ message: string }>("/users/me", {
    method: "PATCH",
    accessToken,
    body: data,
  });
}

export interface BackendSize {
  size_code: number;
  display_text: string;
  measurement: string;
}

export async function getSizes() {
  const res = await request<{ data: BackendSize[] }>("/sizes/", { baseUrl: CATALOG_BASE_URL });
  return res.data;
}

export interface ExploreItem {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  display_order: number;
}

export interface ExploreData {
  categories: ExploreItem[];
  tags: ExploreItem[];
}

export async function getExplore() {
  const res = await request<{ data: ExploreData }>("/explore/", { baseUrl: CATALOG_BASE_URL });
  return res.data;
}
