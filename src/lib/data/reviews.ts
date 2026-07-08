import type { Review } from "@/lib/types";
import { products } from "./products";

function avatar(seed: number) {
  return `https://i.pravatar.cc/150?img=${seed}`;
}

const TEMPLATES: Omit<Review, "id" | "productId">[] = [
  {
    author: "Ananya R.",
    avatar: avatar(47),
    rating: 5,
    date: "2026-06-18",
    title: "Softer than I expected",
    comment:
      "The fabric feels premium and the fit is true to size. Already ordered a second colour.",
  },
  {
    author: "Meera K.",
    avatar: avatar(32),
    rating: 4,
    date: "2026-06-02",
    title: "Great everyday piece",
    comment:
      "Comfortable for daily wear, holds up well after a few washes. Would love more colour options.",
  },
  {
    author: "Priya S.",
    avatar: avatar(29),
    rating: 5,
    date: "2026-05-21",
    title: "Exactly like the photos",
    comment:
      "Was a little skeptical ordering nightwear online but this exceeded expectations. Fits perfectly.",
  },
  {
    author: "Kavya N.",
    avatar: avatar(21),
    rating: 4,
    date: "2026-05-10",
    title: "Lovely fabric",
    comment: "Breathable and soft. Runs slightly loose so consider sizing down.",
  },
  {
    author: "Ritika J.",
    avatar: avatar(16),
    rating: 5,
    date: "2026-04-27",
    title: "My new favourite",
    comment: "Bought this after my sister recommended it — worth every rupee.",
  },
];

export const reviews: Review[] = products.flatMap((product, pIndex) =>
  TEMPLATES.slice(0, 3 + (pIndex % 2)).map((t, i) => ({
    ...t,
    id: `${product.id}-review-${i}`,
    productId: product.id,
  })),
);

export function getReviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export const testimonials: Review[] = [
  {
    id: "testimonial-1",
    productId: products[4].id,
    author: "Sanjana P.",
    avatar: avatar(44),
    rating: 5,
    date: "2026-06-20",
    title: "Comfort I didn't know I needed",
    comment:
      "Arborn has become my go-to for gifting and for myself. The quality is consistently excellent.",
  },
  {
    id: "testimonial-2",
    productId: products[8].id,
    author: "Divya M.",
    avatar: avatar(25),
    rating: 5,
    date: "2026-06-05",
    title: "Feels luxurious",
    comment:
      "The satin range feels so much more premium than the price suggests. Beautifully packaged too.",
  },
  {
    id: "testimonial-3",
    productId: products[0].id,
    author: "Neha T.",
    avatar: avatar(38),
    rating: 4,
    date: "2026-05-15",
    title: "Fast delivery, great fit",
    comment: "Ordered on a whim and was pleasantly surprised. Sizing chart is spot on.",
  },
];
