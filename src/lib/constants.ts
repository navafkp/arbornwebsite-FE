export const PRICE_PRESETS = [
  { key: "under-700", label: "Under ₹700", min: 0, max: 700 },
  { key: "700-1000", label: "₹700 – ₹1,000", min: 700, max: 1000 },
  { key: "1000-1500", label: "₹1,000 – ₹1,500", min: 1000, max: 1500 },
  { key: "1500-plus", label: "₹1,500 & Above", min: 1500, max: Infinity },
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
export const NO_CHROME_ROUTES = ["/", "/select-size"];
