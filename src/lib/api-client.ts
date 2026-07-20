// Talks to the real Django backend. Auth/profile live under /accounts/v1;
// catalog under /catalog/v1. Override with NEXT_PUBLIC_* env vars if needed.
const ACCOUNTS_BASE_URL =
  process.env.NEXT_PUBLIC_ACCOUNTS_BASE_URL || "https://api.arborn.shop/accounts/v1";

const CATALOG_BASE_URL =
  process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "https://api.arborn.shop/catalog/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiEnvelope<T> {
  status_code: number;
  message: string;
  data: T;
}

function unwrapData<T>(json: ApiEnvelope<T> | T): T {
  if (json && typeof json === "object" && "data" in json && "status_code" in json) {
    return (json as ApiEnvelope<T>).data;
  }
  return json as T;
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; accessToken?: string; baseUrl?: string } = {},
): Promise<T> {
  const { method = "GET", body, accessToken, baseUrl = ACCOUNTS_BASE_URL } = options;

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

export async function googleLogin(idToken: string) {
  const json = await request<ApiEnvelope<AuthTokens> | AuthTokens>("/auth/google/", {
    method: "POST",
    body: { id_token: idToken },
  });
  return unwrapData(json);
}

export async function refreshAccessToken(refreshToken: string) {
  const json = await request<
    ApiEnvelope<{ access_token: string; refresh_token?: string }> | { access_token: string; refresh_token?: string }
  >("/auth/refresh/", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  return unwrapData(json);
}

export async function logoutRequest(accessToken: string, refreshToken: string) {
  const json = await request<ApiEnvelope<{ message?: string }> | { message: string }>("/auth/logout/", {
    method: "POST",
    accessToken,
    body: { refresh_token: refreshToken },
  });
  return unwrapData(json);
}

export async function getMyProfile(accessToken: string) {
  const json = await request<
    ApiEnvelope<BackendUser & { first_name: string; last_name: string }> | (BackendUser & { first_name: string; last_name: string })
  >("/users/profile/", {
    accessToken,
  });
  return unwrapData(json);
}

export async function updateMyProfile(
  accessToken: string,
  data: { first_name?: string; last_name?: string },
) {
  const json = await request<ApiEnvelope<{ message?: string }> | { message: string }>("/users/profile/", {
    method: "PATCH",
    accessToken,
    body: data,
  });
  return unwrapData(json);
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

export interface ApiProductTag {
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  base_discount_price: string | null;
  image_url: string | null;
  tag: ApiProductTag | null;
}

export async function getProducts(
  filters: { category?: string; tag?: string; sizes?: number[] } = {},
) {
  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.tag) query.set("tag", filters.tag);
  if (filters.sizes && filters.sizes.length > 0) {
    query.set("size", filters.sizes.join(","));
  }
  const qs = query.toString();
  const res = await request<{ data: ApiProduct[] }>(`/products/${qs ? `?${qs}` : ""}`, {
    baseUrl: CATALOG_BASE_URL,
  });
  return res.data;
}

export interface ApiProductVariantImage {
  id: number;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

export interface ApiProductVariantSize {
  size_code: number;
  display_text: string;
  measurement: string;
}

export interface ApiProductVariant {
  id: number;
  color: string;
  color_code: string;
  price: string;
  discount_price: string | null;
  stock_quantity: number;
  sizes: ApiProductVariantSize[];
  images: ApiProductVariantImage[];
}

export interface ApiProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiReview {
  id?: number;
  rating: number;
  title?: string;
  review?: string;
  user_name?: string;
  created_at?: string;
}

export interface ApiProductDetail {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  base_price: string;
  base_discount_price: string | null;
  category: ApiProductCategory;
  tags: string[];
  variants: ApiProductVariant[];
  recommended_products: ApiProduct[];
  related_products: ApiProduct[];
  review_summary: { average_rating: number; review_count: number };
  reviews: ApiReview[];
  // Not sent by the backend yet — once it is, an Instagram reel card renders
  // as the last slide of the image gallery. Absent/null hides that slide.
  instagram_reel_url?: string | null;
  instagram_thumbnail_url?: string | null;
}

export async function getProductDetail(slug: string, sizes?: number[]) {
  const query = new URLSearchParams();
  if (sizes && sizes.length > 0) {
    query.set("size", sizes.join(","));
  }
  const qs = query.toString();
  const res = await request<{ data: ApiProductDetail }>(
    `/products/${slug}/${qs ? `?${qs}` : ""}`,
    { baseUrl: CATALOG_BASE_URL },
  );
  return res.data;
}
