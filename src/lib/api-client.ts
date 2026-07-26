// Talks to the real Django backend. Auth/profile live under /accounts/v1;
// catalog under /catalog/v1. Override with NEXT_PUBLIC_* env vars if needed.
const ACCOUNTS_BASE_URL =
  process.env.NEXT_PUBLIC_ACCOUNTS_BASE_URL || "https://api.arborn.shop/accounts/v1";

const CATALOG_BASE_URL =
  process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "https://api.arborn.shop/catalog/v1";

const CONTENT_BASE_URL =
  process.env.NEXT_PUBLIC_CONTENT_BASE_URL || "https://api.arborn.shop/content/v1";

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

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
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

export async function getSearchSuggestions() {
  const res = await request<{ data: string[] }>("/search-suggestions/");
  return res.data;
}

export interface BackendSize {
  // A plain numeric size (M, L, ...) has size_code === codes[0]. A grouped
  // entry like "Plus Size" has a non-numeric size_code (e.g. "plus_size")
  // and codes lists every underlying numeric size it stands in for — send
  // all of them to the backend, not size_code itself.
  size_code: number | string;
  display_text: string;
  measurement: string;
  codes: number[];
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
  thumbnail_image?: string | null;
  tag: ApiProductTag | null;
  colors?: string[];
  related_product_images?: string[];
  sizes?: string[];
}

export interface ApiProductPage {
  items: ApiProduct[];
  total_count: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export async function getProducts(
  filters: {
    category?: string;
    tag?: string;
    sizes?: number[];
    search?: string;
    sort?: "low-high" | "high-low";
    price_min?: number;
    price_max?: number;
    page?: number;
    page_size?: number;
  } = {},
): Promise<ApiProductPage> {
  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.tag) query.set("tag", filters.tag);
  if (filters.sizes && filters.sizes.length > 0) {
    query.set("size", filters.sizes.join(","));
  }
  if (filters.search) query.set("search", filters.search);
  if (filters.sort) query.set("sort", filters.sort);
  if (filters.price_min !== undefined) query.set("price_min", String(filters.price_min));
  if (filters.price_max !== undefined) query.set("price_max", String(filters.price_max));
  if (filters.page) query.set("page", String(filters.page));
  if (filters.page_size) query.set("page_size", String(filters.page_size));
  const qs = query.toString();
  const res = await request<{ data: ApiProduct[] | ApiProductPage }>(
    `/products/${qs ? `?${qs}` : ""}`,
    { baseUrl: CATALOG_BASE_URL },
  );
  // The tag-filtered variant of this endpoint currently returns a bare
  // array and ignores page_size — normalize it into the same page shape
  // the unfiltered endpoint returns, so callers only handle one shape.
  if (Array.isArray(res.data)) {
    return { items: res.data, total_count: res.data.length, page: 1, page_size: res.data.length, has_next: false };
  }
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
  stock_quantity: number;
  variant_size_stock_id: number;
  is_free_size?: boolean;
  free_size_note?: string;
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
  thumbnail_image?: string | null;
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
  const res = await request<{ data: ApiProductDetail }>(`/products/${slug}/${qs ? `?${qs}` : ""}`, {
    baseUrl: CATALOG_BASE_URL,
  });
  return res.data;
}

export interface ApiStory {
  id: number;
  image_url: string;
  eyebrow: string;
  caption: string;
  display_order: number;
  duration_ms: number;
  cta_label: string | null;
  cta_link: string | null;
}

export interface ApiStoryCircle {
  id: number;
  label: string;
  cover_image_url: string;
  display_order: number;
  stories: ApiStory[];
}

export async function getStories() {
  const res = await request<{ data: ApiStoryCircle[] }>("/stories/", {
    baseUrl: CONTENT_BASE_URL,
  });
  return res.data;
}

export interface ApiBanner {
  id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
  duration_ms: number;
  link: string | null;
}

export async function getBanners() {
  const res = await request<{ data: ApiBanner[] }>("/banners/", {
    baseUrl: CONTENT_BASE_URL,
  });
  return res.data;
}

export interface ApiCartItem {
  id: number;
  product: { id: number; name: string; slug: string };
  variant_id: number;
  color: string;
  color_code: string;
  size_code: number;
  size_display_text: string;
  image_url: string;
  price: string;
  quantity: number;
  subtotal: string;
  stock_quantity: number;
  is_out_of_stock: boolean;
  is_stock_insufficient: boolean;
}

export interface ApiCart {
  items: ApiCartItem[];
  total_quantity: number;
  total_amount: string;
}

export async function getCart(accessToken: string) {
  const res = await request<{ data: ApiCart }>("/cart/", {
    baseUrl: CATALOG_BASE_URL,
    accessToken,
  });
  return res.data;
}

export async function addCartItem(accessToken: string, variantSizeStockId: number, quantity: number) {
  const res = await request<{ data: ApiCartItem }>("/cart/", {
    method: "POST",
    baseUrl: CATALOG_BASE_URL,
    accessToken,
    body: { variant_size_stock_id: variantSizeStockId, quantity },
  });
  return res.data;
}

export async function updateCartItem(accessToken: string, cartItemId: number, quantity: number) {
  const res = await request<{ data: ApiCartItem }>(`/cart/${cartItemId}/`, {
    method: "PATCH",
    baseUrl: CATALOG_BASE_URL,
    accessToken,
    body: { quantity },
  });
  return res.data;
}

export async function deleteCartItems(accessToken: string, itemIds: number[]) {
  await request<undefined>("/cart/", {
    method: "DELETE",
    baseUrl: CATALOG_BASE_URL,
    accessToken,
    body: { item_ids: itemIds },
  });
}

export interface ApiWishlistItem {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  base_discount_price: string | null;
  image_url: string | null;
  tag: ApiProductTag | null;
  variants: ApiProductVariant[];
  review_summary: { average_rating: number; review_count: number };
}

export async function getWishlist(accessToken: string) {
  const res = await request<{ data: ApiWishlistItem[] }>("/wishlist/", {
    baseUrl: CATALOG_BASE_URL,
    accessToken,
  });
  return res.data;
}

export async function addWishlistItem(accessToken: string, productId: number) {
  await request<undefined>("/wishlist/", {
    method: "POST",
    baseUrl: CATALOG_BASE_URL,
    accessToken,
    body: { product_id: productId },
  });
}

export async function removeWishlistItem(accessToken: string, productId: number) {
  await request<undefined>(`/wishlist/${productId}/`, {
    method: "DELETE",
    baseUrl: CATALOG_BASE_URL,
    accessToken,
  });
}

export interface ApiOrder {
  id: number;
  product: { id: number; name: string; slug: string };
  variant_id: number;
  color: string;
  color_code: string;
  size_code: number;
  size_display_text: string;
  image_url: string;
  quantity: number;
  collected_amount: string;
  shipping_charge: string;
  transport_mode: string;
  state: string;
  created_at: string;
}

export async function getOrders(accessToken: string) {
  const res = await request<{ data: ApiOrder[] }>("/orders/", {
    baseUrl: CATALOG_BASE_URL,
    accessToken,
  });
  return res.data;
}
