"use client";

import { useEffect, useMemo, useState } from "react";
import { getProducts, getExplore, type ApiProduct } from "@/lib/api-client";
import { getPreferredSizes } from "@/lib/preferred-size";
import { PRICE_PRESETS } from "@/lib/constants";
import ApiProductCard from "@/components/products/ApiProductCard";
import BustSizeBanner from "@/components/home/BustSizeBanner";
import ArbornStories from "@/components/common/ArbornStories";

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

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
  const [sort, setSort] = useState<SortKey>("newest");
  const [pricePreset, setPricePreset] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<"sort" | "filter" | null>(null);

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

  const visibleProducts = useMemo(() => {
    let list = products;
    const preset = PRICE_PRESETS.find((p) => p.key === pricePreset);
    if (preset) {
      list = list.filter((p) => {
        const price = Number(p.base_discount_price ?? p.base_price);
        return price >= preset.min && price < preset.max;
      });
    }
    list = [...list];
    if (sort === "price-asc") {
      list.sort((a, b) => Number(a.base_discount_price ?? a.base_price) - Number(b.base_discount_price ?? b.base_price));
    } else if (sort === "price-desc") {
      list.sort((a, b) => Number(b.base_discount_price ?? b.base_price) - Number(a.base_discount_price ?? a.base_price));
    }
    return list;
  }, [products, sort, pricePreset]);

  const seoHeading = category ? humanize(category) : tag ? (activeTagName ?? humanize(tag)) : "Shop All Products";

  return (
    <div className="mx-auto max-w-7xl px-3 pt-4 pb-10 sm:px-6 lg:px-8">
      <h1 className="sr-only">{seoHeading}</h1>
      <BustSizeBanner />
      <ArbornStories />

      <div className="relative mt-3 flex gap-2.5">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === "filter" ? null : "filter"))}
            className="flex w-full items-center justify-center gap-[3.9px] rounded-full border border-black/15 py-[5.8px] text-[8.7px]"
          >
            <svg className="h-[9.7px] w-[9.7px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
            Filter
            {pricePreset && <span className="h-[3.9px] w-[3.9px] rounded-full bg-accent" />}
            <svg className="h-[7.8px] w-[7.8px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {openPanel === "filter" && (
            <div className="absolute top-full left-0 z-20 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => {
                    setPricePreset((p) => (p === preset.key ? null : preset.key));
                    setOpenPanel(null);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    pricePreset === preset.key ? "bg-accent-soft text-accent" : "hover:bg-black/[0.03]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === "sort" ? null : "sort"))}
            className="flex w-full items-center justify-center gap-[3.9px] rounded-full border border-black/15 py-[5.8px] text-[8.7px]"
          >
            <svg className="h-[9.7px] w-[9.7px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M7 4v16M4 7l3-3 3 3M17 20V4m3 13l-3 3-3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sort
            <svg className="h-[7.8px] w-[7.8px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {openPanel === "sort" && (
            <div className="absolute top-full right-0 z-20 mt-2 w-52 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSort(key);
                    setOpenPanel(null);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    sort === key ? "bg-accent-soft text-accent" : "hover:bg-black/[0.03]"
                  }`}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          )}
        </div>
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

      {loadState === "ready" && visibleProducts.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          No products found here yet.
        </p>
      )}

      {loadState === "ready" && visibleProducts.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4">
          {visibleProducts.map((product) => (
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
