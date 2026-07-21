import type { Metadata } from "next";
import CategoriesPageClient from "@/components/products/CategoriesPageClient";

export const metadata: Metadata = {
  title: "Shop by Collection",
  description: "Explore Arborn's nightwear collections and categories — curated by mood, style, and moment.",
  alternates: {
    canonical: "/categories",
  },
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
