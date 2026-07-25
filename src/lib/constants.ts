export const PRICE_PRESETS = [
  { key: "under-500", label: "Under ₹500", min: 0, max: 500 },
  { key: "501-699", label: "₹501 – ₹699", min: 501, max: 699 },
  { key: "700-plus", label: "₹700 & Above", min: 700, max: Infinity },
] as const;

export const SORT_OPTIONS = [
  { key: "newest", label: "Newest First" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Best Rated" },
  { key: "bestselling", label: "Bestselling" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["key"];

// Pages with their own full-bleed layout — no Footer, no bottom nav.
const NO_CHROME_ROUTES = ["/select-size"];

// next.config.ts sets trailingSlash: true (required for GitHub Pages), so
// usePathname() can return "/select-size/" instead of "/select-size" —
// normalize before comparing.
export function isNoChromeRoute(pathname: string) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return NO_CHROME_ROUTES.includes(normalized);
}
