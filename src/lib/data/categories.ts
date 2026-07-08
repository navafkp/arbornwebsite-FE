import type { Category } from "@/lib/types";
import { img } from "./images";

export const categories: Category[] = [
  {
    slug: "night-suits",
    name: "Night Suits",
    image: img(0, 700),
    description: "Effortless co-ord sets for a restful night in.",
  },
  {
    slug: "cotton",
    name: "Cotton",
    image: img(3, 700),
    description: "Breathable, soft-touch cotton for everyday comfort.",
  },
  {
    slug: "satin",
    name: "Satin",
    image: img(5, 700),
    description: "Silky-smooth satin with a luxurious drape.",
  },
  {
    slug: "shorts",
    name: "Shorts",
    image: img(7, 700),
    description: "Lightweight shorts sets for warm, easy nights.",
  },
  {
    slug: "premium",
    name: "Premium Collection",
    image: img(9, 700),
    description: "Elevated fabrics and finishes for special comfort.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
