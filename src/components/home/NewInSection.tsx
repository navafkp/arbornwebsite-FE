"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getProducts, type ApiProduct } from "@/lib/api-client";
import { PRICE_PRESETS } from "@/lib/constants";
import { HeartIcon } from "@/components/ui/decor";
import ApiProductCard from "@/components/products/ApiProductCard";

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export default function NewInSection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [sort, setSort] = useState<SortKey>("newest");
  const [pricePreset, setPricePreset] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<"sort" | "filter" | null>(null);

  useEffect(() => {
    // Showing all products for now instead of filtering to a "New" tag.
    getProducts({})
      .then((data) => {
        setProducts(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

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
    return list.slice(0, 6);
  }, [products, sort, pricePreset]);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-serif text-2xl">
          New In
          <HeartIcon className="h-4 w-4 text-accent" />
        </h2>
        <Link href="/products" className="flex items-center gap-1 text-xs font-medium text-accent">
          View all
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="relative mt-1 flex gap-2.5">
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
        <div className="mt-3 grid grid-cols-3 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full overflow-hidden rounded-[15px] border border-[#f2dfe2] bg-[#fffefd] shadow-[0_2px_9px_rgba(85,43,55,0.07)]">
              <div className="aspect-[3/4] animate-pulse bg-[#f9f3f2]" />
              <div className="h-12 border-t border-[#f8ebed] bg-[#fffafa]" />
            </div>
          ))}
        </div>
      )}

      {loadState === "error" && (
        <p className="mt-4 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          Couldn&rsquo;t load products. Please check your connection and try again.
        </p>
      )}

      {loadState === "ready" && visibleProducts.length === 0 && (
        <p className="mt-4 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          No products found here yet.
        </p>
      )}

      {loadState === "ready" && visibleProducts.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-1">
          {visibleProducts.map((product) => (
            <div key={product.id} className="mx-auto w-full">
              <ApiProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      <Link
        href="/products"
        className="mt-[13.3px] flex items-center justify-center gap-1 rounded-full border border-accent/40 py-1.5 text-[9px] font-medium text-accent"
      >
        View All Products
        <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
