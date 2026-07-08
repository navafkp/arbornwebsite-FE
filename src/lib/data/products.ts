import type { ColorVariant, Product, ProductTag, Size } from "@/lib/types";
import { imgSet } from "./images";
import { slugify } from "@/lib/utils";

const DEFAULT_CARE = [
  "Machine wash cold with like colors",
  "Do not bleach",
  "Tumble dry low",
  "Warm iron if needed",
];

const DEFAULT_SHIPPING =
  "Free shipping on orders above ₹999. Dispatched within 24-48 hours.";

function colors(names: { name: string; hex: string }[], seed: number): ColorVariant[] {
  return names.map((c, i) => ({
    name: c.name,
    hex: c.hex,
    images: imgSet(seed + i * 2, 3),
  }));
}

interface Draft {
  name: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  fabric: string;
  sizes: Size[];
  colorNames: { name: string; hex: string }[];
  shortDescription: string;
  description: string;
  careInstructions?: string[];
  tags?: ProductTag[];
  inStock?: boolean;
  createdAt: string;
  seed: number;
}

const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

function build(draft: Draft): Product {
  return {
    id: slugify(draft.name),
    slug: slugify(draft.name),
    name: draft.name,
    categorySlug: draft.categorySlug,
    price: draft.price,
    compareAtPrice: draft.compareAtPrice,
    rating: draft.rating,
    reviewCount: draft.reviewCount,
    fabric: draft.fabric,
    sizes: draft.sizes,
    colors: colors(draft.colorNames, draft.seed),
    shortDescription: draft.shortDescription,
    description: draft.description,
    careInstructions: draft.careInstructions ?? DEFAULT_CARE,
    shippingInfo: DEFAULT_SHIPPING,
    tags: draft.tags ?? [],
    inStock: draft.inStock ?? true,
    createdAt: draft.createdAt,
  };
}

export const products: Product[] = [
  // Night Suits
  build({
    name: "Korean Pajama Set",
    categorySlug: "night-suits",
    price: 899,
    compareAtPrice: 1199,
    rating: 4.6,
    reviewCount: 128,
    fabric: "100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colorNames: [
      { name: "Charcoal", hex: "#2b2b2b" },
      { name: "Sage", hex: "#8a9a82" },
    ],
    shortDescription: "Relaxed co-ord set with a notch collar and piped trims.",
    description:
      "A relaxed two-piece pajama set cut from breathable cotton poplin, finished with a notch collar and contrast piping. Designed for uninterrupted comfort from dusk to dawn.",
    tags: ["bestseller"],
    createdAt: "2026-06-02",
    seed: 0,
  }),
  build({
    name: "Floral Co-ord Night Suit",
    categorySlug: "night-suits",
    price: 949,
    rating: 4.5,
    reviewCount: 76,
    fabric: "Cotton Blend",
    sizes: ["XS", "S", "M", "L", "XL"],
    colorNames: [
      { name: "Blush Floral", hex: "#e7c3c1" },
      { name: "Ivory Floral", hex: "#efe7da" },
    ],
    shortDescription: "Delicate floral print set with a relaxed fit.",
    description:
      "An easy-fit shirt and pant set in an all-over floral print. The lightweight cotton blend keeps you cool while the relaxed silhouette moves with you through the night.",
    tags: ["new"],
    createdAt: "2026-06-28",
    seed: 2,
  }),
  build({
    name: "Classic Stripe Night Suit",
    categorySlug: "night-suits",
    price: 849,
    rating: 4.3,
    reviewCount: 54,
    fabric: "100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colorNames: [
      { name: "Navy Stripe", hex: "#26314a" },
      { name: "Grey Stripe", hex: "#9a9a9a" },
    ],
    shortDescription: "Timeless stripe pajama set in soft cotton.",
    description:
      "A wardrobe staple: crisp stripes on soft-washed cotton, tailored into a classic shirt-and-pant set with a drawstring waist for a comfortable, adjustable fit.",
    createdAt: "2026-04-15",
    seed: 4,
  }),
  build({
    name: "Quilted Winter Night Suit",
    categorySlug: "night-suits",
    price: 1099,
    compareAtPrice: 1399,
    rating: 4.7,
    reviewCount: 41,
    fabric: "Quilted Cotton",
    sizes: ["S", "M", "L", "XL"],
    colorNames: [{ name: "Maroon", hex: "#6e2b3a" }],
    shortDescription: "Quilted set for extra warmth on cooler nights.",
    description:
      "Lightly quilted cotton gives this set a cosy, cocooning feel without any bulk. Ribbed cuffs and a relaxed leg keep it easy to move in.",
    tags: ["premium"],
    createdAt: "2026-03-10",
    seed: 6,
  }),

  // Cotton
  build({
    name: "Lace Short Nighty",
    categorySlug: "cotton",
    price: 599,
    rating: 4.4,
    reviewCount: 203,
    fabric: "100% Cotton",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colorNames: [
      { name: "Peach", hex: "#e8b7a4" },
      { name: "Sand", hex: "#d8c3a5" },
      { name: "Charcoal", hex: "#3a3a3a" },
    ],
    shortDescription: "Short-sleeve nighty with delicate lace trim.",
    description:
      "Cut from soft cotton with a gentle lace trim at the neckline, this short nighty is made for warm, easy nights. Button-front placket for effortless wear.",
    tags: ["bestseller"],
    createdAt: "2026-05-20",
    seed: 8,
  }),
  build({
    name: "Cotton Button-Down Nighty",
    categorySlug: "cotton",
    price: 649,
    rating: 4.2,
    reviewCount: 88,
    fabric: "100% Cotton",
    sizes: ["S", "M", "L", "XL"],
    colorNames: [
      { name: "White", hex: "#f5f3ee" },
      { name: "Dusty Rose", hex: "#c99999" },
    ],
    shortDescription: "Shirt-style nighty with a full button placket.",
    description:
      "A shirt-inspired nighty in breathable cotton, with a full button placket and a curved hem. Simple, clean, and endlessly comfortable.",
    createdAt: "2026-06-10",
    seed: 10,
  }),
  build({
    name: "Breeze Cotton Nighty",
    categorySlug: "cotton",
    price: 549,
    rating: 4.1,
    reviewCount: 65,
    fabric: "Cotton Voile",
    sizes: ["XS", "S", "M", "L"],
    colorNames: [{ name: "Sky Blue", hex: "#aac4d4" }],
    shortDescription: "Featherlight voile nighty for hot summer nights.",
    description:
      "Woven from airy cotton voile, this nighty is designed to keep you cool through the warmest nights, with a flowing A-line cut and thin straps.",
    tags: ["new"],
    createdAt: "2026-07-01",
    seed: 12,
  }),
  build({
    name: "Everyday Cotton Nighty",
    categorySlug: "cotton",
    price: 599,
    rating: 4.3,
    reviewCount: 112,
    fabric: "100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colorNames: [
      { name: "Olive", hex: "#7c7a4e" },
      { name: "Black", hex: "#1c1c1c" },
    ],
    shortDescription: "No-fuss cotton nighty for daily wear.",
    description:
      "The everyday essential: a simple, well-cut cotton nighty with a soft jersey feel, made to be lived in night after night.",
    createdAt: "2026-02-18",
    seed: 14,
  }),

  // Satin
  build({
    name: "Hollywood Short Nighty",
    categorySlug: "satin",
    price: 649,
    compareAtPrice: 799,
    rating: 4.6,
    reviewCount: 97,
    fabric: "Satin",
    sizes: ["S", "M", "L", "XL"],
    colorNames: [
      { name: "Sage", hex: "#93a48f" },
      { name: "Champagne", hex: "#e8dcc4" },
      { name: "Black", hex: "#141414" },
    ],
    shortDescription: "Glossy satin nighty with a cowl neckline.",
    description:
      "Inspired by classic old-Hollywood slips, this satin nighty drapes beautifully with a soft cowl neckline and adjustable straps.",
    tags: ["bestseller"],
    createdAt: "2026-05-05",
    seed: 16,
  }),
  build({
    name: "Satin Wrap Robe",
    categorySlug: "satin",
    price: 1199,
    rating: 4.7,
    reviewCount: 58,
    fabric: "Satin",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colorNames: [{ name: "Wine", hex: "#5c2331" }],
    shortDescription: "Long wrap robe with a self-tie belt.",
    description:
      "A floor-grazing wrap robe in liquid-smooth satin, finished with a self-tie belt and delicate piping along the lapel.",
    tags: ["premium"],
    createdAt: "2026-03-28",
    seed: 18,
  }),
  build({
    name: "Silk-Touch Slip Dress",
    categorySlug: "satin",
    price: 999,
    rating: 4.5,
    reviewCount: 73,
    fabric: "Silk-Touch Satin",
    sizes: ["XS", "S", "M", "L"],
    colorNames: [
      { name: "Ivory", hex: "#efe9df" },
      { name: "Blush", hex: "#e3c1bd" },
    ],
    shortDescription: "Bias-cut slip dress with a silk-like finish.",
    description:
      "Cut on the bias for a fluid drape, this slip dress has the look and feel of silk with easy-care satin practicality.",
    createdAt: "2026-06-15",
    seed: 20,
  }),
  build({
    name: "Satin Cami Set",
    categorySlug: "satin",
    price: 899,
    rating: 4.4,
    reviewCount: 46,
    fabric: "Satin",
    sizes: ["S", "M", "L", "XL"],
    colorNames: [{ name: "Dusty Pink", hex: "#d9a8a3" }],
    shortDescription: "Cami top and pant set in soft satin.",
    description:
      "A cami and wide-leg pant set in soft satin, with lace-trimmed edges for a refined finishing touch.",
    createdAt: "2026-01-22",
    seed: 22,
  }),

  // Shorts
  build({
    name: "Printed Shorts Set",
    categorySlug: "shorts",
    price: 699,
    rating: 4.2,
    reviewCount: 84,
    fabric: "Cotton Blend",
    sizes: ["XS", "S", "M", "L", "XL"],
    colorNames: [
      { name: "Coral Print", hex: "#e08a72" },
      { name: "Navy Print", hex: "#2c3550" },
    ],
    shortDescription: "Playful printed tee and shorts set.",
    description:
      "A relaxed tee paired with printed shorts, cut from a soft cotton blend for easy, breathable comfort on warmer nights.",
    tags: ["new"],
    createdAt: "2026-06-25",
    seed: 24,
  }),
  build({
    name: "Cotton Shorts & Tee Set",
    categorySlug: "shorts",
    price: 749,
    rating: 4.3,
    reviewCount: 61,
    fabric: "100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colorNames: [{ name: "Grey Melange", hex: "#a7a7a7" }],
    shortDescription: "Classic tee and shorts set in soft cotton jersey.",
    description:
      "A no-fuss tee and shorts set in cotton jersey with a ribbed waistband, made for easy movement and all-night comfort.",
    createdAt: "2026-04-02",
    seed: 26,
  }),
  build({
    name: "Satin Shorts Set",
    categorySlug: "shorts",
    price: 799,
    rating: 4.5,
    reviewCount: 39,
    fabric: "Satin",
    sizes: ["S", "M", "L"],
    colorNames: [
      { name: "Champagne", hex: "#e6d9bd" },
      { name: "Black", hex: "#151515" },
    ],
    shortDescription: "Camisole and shorts set in glossy satin.",
    description:
      "A camisole and shorts set in glossy satin, edged with lace for a polished, put-together look at bedtime.",
    tags: ["bestseller"],
    createdAt: "2026-05-30",
    seed: 28,
  }),
  build({
    name: "Rib-Knit Shorts Set",
    categorySlug: "shorts",
    price: 729,
    rating: 4.1,
    reviewCount: 27,
    fabric: "Rib-Knit Cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    colorNames: [{ name: "Terracotta", hex: "#b5654a" }],
    shortDescription: "Ribbed tank and shorts set with a snug fit.",
    description:
      "A ribbed tank and shorts set with a close, comfortable fit and gentle stretch — perfect for lounging or sleeping.",
    createdAt: "2026-02-05",
    seed: 30,
  }),

  // Premium Collection
  build({
    name: "Modal Silk Night Suit",
    categorySlug: "premium",
    price: 1499,
    compareAtPrice: 1899,
    rating: 4.8,
    reviewCount: 52,
    fabric: "Modal Silk",
    sizes: ["S", "M", "L", "XL"],
    colorNames: [
      { name: "Stone", hex: "#c9c2b4" },
      { name: "Midnight", hex: "#1d2333" },
    ],
    shortDescription: "Modal-silk blend set with a fluid, cooling drape.",
    description:
      "Woven from a modal-silk blend, this night suit feels cool and weightless against the skin, with a fluid drape that elevates everyday loungewear.",
    tags: ["premium", "bestseller"],
    createdAt: "2026-05-12",
    seed: 32,
  }),
  build({
    name: "Bamboo Fabric Robe Set",
    categorySlug: "premium",
    price: 1699,
    rating: 4.7,
    reviewCount: 33,
    fabric: "Bamboo Viscose",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colorNames: [{ name: "Sage", hex: "#a9b39a" }],
    shortDescription: "Robe and cami set in sustainable bamboo fabric.",
    description:
      "A robe and cami set crafted from breathable, naturally antibacterial bamboo viscose — soft on skin and kind to the planet.",
    tags: ["premium"],
    createdAt: "2026-06-20",
    seed: 34,
  }),
  build({
    name: "Luxe Satin Nightgown",
    categorySlug: "premium",
    price: 1899,
    compareAtPrice: 2299,
    rating: 4.9,
    reviewCount: 44,
    fabric: "Mulberry-Finish Satin",
    sizes: ["XS", "S", "M", "L"],
    colorNames: [
      { name: "Champagne", hex: "#e9dcc0" },
      { name: "Emerald", hex: "#2f4a3c" },
    ],
    shortDescription: "Full-length nightgown in mulberry-finish satin.",
    description:
      "A floor-length nightgown in a mulberry-finish satin, with a bias cut that skims the body for an effortlessly elegant silhouette.",
    tags: ["premium", "limited"],
    createdAt: "2026-04-25",
    seed: 36,
  }),
  build({
    name: "Cashmere-Blend Lounge Set",
    categorySlug: "premium",
    price: 2199,
    rating: 4.8,
    reviewCount: 21,
    fabric: "Cashmere Blend",
    sizes: ["S", "M", "L"],
    colorNames: [{ name: "Oatmeal", hex: "#ddd3c2" }],
    shortDescription: "Ultra-soft cashmere-blend set for pure comfort.",
    description:
      "An indulgent cashmere-blend lounge set, brushed for extra softness — the ultimate reward-yourself piece for quiet evenings in.",
    tags: ["premium", "new"],
    createdAt: "2026-06-30",
    seed: 38,
  }),
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, count);
}

export function getNewArrivals(count = 8) {
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function getBestSellers(count = 8) {
  return products.filter((p) => p.tags.includes("bestseller")).slice(0, count);
}

export function getAllColors() {
  const map = new Map<string, string>();
  for (const product of products) {
    for (const color of product.colors) {
      if (!map.has(color.name)) map.set(color.name, color.hex);
    }
  }
  return Array.from(map, ([name, hex]) => ({ name, hex }));
}

export function getAllSizes(): Size[] {
  const set = new Set<Size>();
  for (const product of products) {
    for (const size of product.sizes) set.add(size);
  }
  return ALL_SIZES.filter((size) => set.has(size));
}
