"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, getExplore, getSizes, type ApiProduct } from "@/lib/api-client";
import { getPreferredSize } from "@/lib/preferred-size";
import ApiProductCard from "@/components/products/ApiProductCard";
import BackButton from "@/components/ui/BackButton";

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ApiProductGrid({
  category,
  tag,
  size,
}: {
  category?: string;
  tag?: string;
  size?: number;
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
  const [activeSizeName, setActiveSizeName] = useState<string | null>(null);
  // The URL's own ?size= (e.g. from /select-size) wins when present;
  // otherwise fall back to whatever size the user already has saved, so
  // plain/category/tag browsing is still scoped to their size without
  // requiring them to go through /select-size again.
  const [effectiveSize, setEffectiveSize] = useState<number | undefined>(size);

  useEffect(() => {
    if (size) {
      setEffectiveSize(size);
      return;
    }
    const preferred = getPreferredSize();
    setEffectiveSize(preferred ? Number(preferred) : undefined);
  }, [size]);

  useEffect(() => {
    setLoadState("loading");
    getProducts({ category, tag, size: effectiveSize })
      .then((data) => {
        setProducts(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [category, tag, effectiveSize]);

  useEffect(() => {
    if (!tag) {
      setActiveTagName(null);
      return;
    }
    getExplore()
      .then(({ tags }) => setActiveTagName(tags.find((t) => t.slug === tag)?.name ?? null))
      .catch(() => setActiveTagName(null));
  }, [tag]);

  useEffect(() => {
    if (!effectiveSize) {
      setActiveSizeName(null);
      return;
    }
    getSizes()
      .then((sizes) => setActiveSizeName(sizes.find((s) => s.size_code === effectiveSize)?.display_text ?? null))
      .catch(() => setActiveSizeName(null));
  }, [effectiveSize]);

  const heading = category ? humanize(category) : tag ? (activeTagName ?? humanize(tag)) : "Products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BackButton className="mb-4" />

      {effectiveSize && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-accent-soft px-4 py-3 text-sm">
          <span>
            Showing products for size: <strong>{activeSizeName ?? effectiveSize}</strong>
          </span>
          <Link
            href="/select-size"
            className="text-xs font-medium text-accent-dark underline underline-offset-2"
          >
            Change
          </Link>
        </div>
      )}

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
