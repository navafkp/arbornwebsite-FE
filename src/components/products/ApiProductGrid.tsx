"use client";

import { useEffect, useState } from "react";
import { getProducts, getExplore, type ApiProduct } from "@/lib/api-client";
import { getPreferredSizes } from "@/lib/preferred-size";
import ApiProductCard from "@/components/products/ApiProductCard";
import FloatingSizeAction from "@/components/ui/FloatingSizeAction";

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ApiProductGrid({
  category,
  tag,
  sizes = [],
}: {
  category?: string;
  tag?: string;
  sizes?: number[];
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
  // The URL's own ?size= (e.g. from /select-size) wins when present;
  // otherwise fall back to whatever size the user already has saved, so
  // plain/category/tag browsing is still scoped to their sizes without
  // requiring them to go through /select-size again.
  const [effectiveSizes, setEffectiveSizes] = useState<number[]>(sizes);

  useEffect(() => {
    if (sizes && sizes.length > 0) {
      setEffectiveSizes(sizes);
      return;
    }
    const preferred = getPreferredSizes();
    setEffectiveSizes(preferred);
  }, [sizes]);

  useEffect(() => {
    setLoadState("loading");
    getProducts({ category, tag, sizes: effectiveSizes })
      .then((data) => {
        setProducts(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [category, tag, effectiveSizes]);

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
    <div className="mx-auto max-w-7xl px-3 pt-4 pb-10 sm:px-6 lg:px-8">
      <div className="mt-2">
        <h1 className="font-serif text-2xl leading-tight sm:text-3xl">{heading}</h1>
        <p className="mt-0.5 hidden text-sm text-[var(--muted)] sm:block">
          {loadState === "ready"
            ? `${products.length} ${products.length === 1 ? "product" : "products"}`
            : " "}
        </p>
      </div>

      {loadState === "loading" && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-full overflow-hidden rounded-[15px] border border-[#f2dfe2] bg-[#fffefd] shadow-[0_2px_9px_rgba(85,43,55,0.07)]">
              <div className="aspect-[3/4] animate-pulse bg-[#f9f3f2]" />
              <div className="h-12 border-t border-[#f8ebed] bg-[#fffafa]" />
            </div>
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
        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4">
          {products.map((product) => (
            <ApiProductCard
              key={product.id}
              product={product}
              badgeLabel={tag ? (activeTagName ?? humanize(tag)) : undefined}
            />
          ))}
        </div>
      )}

      <FloatingSizeAction hasPreferredSize={effectiveSizes.length > 0} />

      <div className="fixed bottom-20 left-1/2 z-40 w-[90%] max-w-sm -translate-x-1/2 md:hidden">        <button
        type="button"
        // onClick={() => setMobileFiltersOpen(true)}
        className="flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-medium text-white shadow-xl"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M3 5h18M6 12h12M10 19h4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span>Filter & Sort</span>
      </button>
      </div>
    </div>
  );
}
