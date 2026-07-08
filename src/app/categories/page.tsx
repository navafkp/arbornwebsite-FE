import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Arborn nightwear by category.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">Categories</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Find your perfect fit by category.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f4f2ee]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 640px) 30vw, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="mt-3 text-sm tracking-wide text-black">{category.name}</span>
            <span className="mt-0.5 text-xs text-[var(--muted)]">{category.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
