"use client";

import { useEffect, useState } from "react";
import { getProducts, getExplore, type ApiProduct } from "@/lib/api-client";
import ApiProductCard from "@/components/products/ApiProductCard";

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ApiProductGrid({
  category,
  tag,
}: {
  category?: string;
  tag?: string;
}) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  // The backend's per-product `tag` field is just that product's primary
  // tag, not necessarily the one being filtered by — a product tagged both
  // "New Arrival" and "Hot Selling" still shows up here with `tag: "New
  // Arrival"` when filtering by hot-selling. Resolve the actual filtered
  // tag's display name so every badge in this view is consistent with what
  // was clicked, instead of trusting each product's own (possibly
  // different) tag.
  const [activeTagName, setActiveTagName] = useState<string | null>(null);

  useEffect(() => {
    setLoadState("loading");
    getProducts({ category, tag })
      .then((data) => {
        setProducts(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [category, tag]);

  useEffect(() => {
    if (!tag) {
      setActiveTagName(null);
      return;
    }
    getExplore()
      .then(({ tags }) => setActiveTagName(tags.find((t) => t.slug === tag)?.name ?? null))
      .catch(() => setActiveTagName(null));
  }, [tag]);

  const heading = category ? humanize(category) : tag ? (activeTagName ?? humanize(tag)) : "Products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">{heading}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {loadState === "ready"
          ? `${products.length} ${products.length === 1 ? "product" : "products"}`
          : " "}
      </p>

      {loadState === "loading" && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] w-full animate-pulse rounded-xl bg-black/5" />
          ))}
        </div>
      )}

      {loadState === "error" && (
        <p className="mt-8 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          Couldn&rsquo;t load products. Please check your connection and try again.
        </p>
      )}

      {loadState === "ready" && products.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          No products found here yet.
        </p>
      )}

      {loadState === "ready" && products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ApiProductCard
              key={product.id}
              product={product}
              badgeLabel={tag ? (activeTagName ?? humanize(tag)) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
