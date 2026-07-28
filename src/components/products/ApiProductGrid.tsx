"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getExplore, getSizes, type ApiProduct, type BackendSize } from "@/lib/api-client";
import { getPreferredSizes, clearPreferredSize } from "@/lib/preferred-size";
import { PRICE_PRESETS } from "@/lib/constants";
import ApiProductCard from "@/components/products/ApiProductCard";
import BustSizeBanner from "@/components/home/BustSizeBanner";
import ShopByCollectionSection from "@/components/home/ShopByCollectionSection";
import { OpenBoxHeartIllustration, HeartIcon } from "@/components/ui/decor";

type SortKey = "low-high" | "high-low";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PRODUCTS_PAGE_SIZE) || 20;

const SORT_LABELS: Record<SortKey, string> = {
  "low-high": "Price: Low to High",
  "high-low": "Price: High to Low",
};

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ApiProductGrid({
  category,
  tag,
  search,
  sizes = [],
}: {
  category?: string;
  tag?: string;
  search?: string;
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
  const [sizeLabels, setSizeLabels] = useState<BackendSize[]>([]);
  const [sort, setSort] = useState<SortKey | null>(null);
  const [pricePreset, setPricePreset] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<"sort" | "filter" | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (sizes && sizes.length > 0) {
      setEffectiveSizes(sizes);
      return;
    }
    const preferred = getPreferredSizes();
    setEffectiveSizes(preferred);
  }, [sizes]);

  useEffect(() => {
    getSizes().then(setSizeLabels).catch(() => setSizeLabels([]));
  }, []);

  // The backend already filters by ?size= server-side, but as a safety net
  // never render a card that has no stock anywhere, or that doesn't stock
  // the shopper's selected size — same reasoning as the detail page's
  // "More Patterns Like This" filter.
  const preferredSizeLabels = sizeLabels
    .filter((s) => s.codes.some((code) => effectiveSizes.includes(code)))
    .map((s) => s.display_text);
  const visibleProducts = products.filter((p) => {
    const hasStock = (p.colors?.length ?? 0) > 0 || (p.sizes?.length ?? 0) > 0;
    if (!hasStock) return false;
    if (preferredSizeLabels.length === 0) return true;
    return (p.sizes ?? []).some((s) => preferredSizeLabels.includes(s));
  });

  // Sort/price filter are scoped to whatever's being browsed right now —
  // switching to a different collection (category/tag) or search is a new
  // browsing context, not a continuation, so any leftover selection here
  // shouldn't carry over to it.
  useEffect(() => {
    setSort(null);
    setPricePreset(null);
  }, [category, tag, search]);

  const activePreset = PRICE_PRESETS.find((p) => p.key === pricePreset);
  const priceMin = activePreset && activePreset.min > 0 ? activePreset.min : undefined;
  const priceMax = activePreset && activePreset.max !== Infinity ? activePreset.max : undefined;

  useEffect(() => {
    setLoadState("loading");
    setPage(1);
    getProducts({
      category,
      tag,
      search,
      sizes: effectiveSizes,
      sort: sort ?? undefined,
      price_min: priceMin,
      price_max: priceMax,
      page: 1,
      page_size: PAGE_SIZE,
    })
      .then((data) => {
        setProducts(data.items);
        setHasNext(data.has_next);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [category, tag, search, effectiveSizes, sort, priceMin, priceMax]);

  function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    getProducts({
      category,
      tag,
      search,
      sizes: effectiveSizes,
      sort: sort ?? undefined,
      price_min: priceMin,
      price_max: priceMax,
      page: nextPage,
      page_size: PAGE_SIZE,
    })
      .then((data) => {
        setProducts((prev) => {
          const seenIds = new Set(prev.map((product) => product.id));
          return [...prev, ...data.items.filter((product) => !seenIds.has(product.id))];
        });
        setHasNext(data.has_next);
        setPage(nextPage);
      })
      .catch(() => setHasNext(false))
      .finally(() => setLoadingMore(false));
  }

  // Drops the size scoping entirely (regardless of whether it came from the
  // URL's ?size= or the saved preference) so a shopper stuck on an empty,
  // size-filtered view can see everything instead.
  function clearSizeSelection() {
    clearPreferredSize();
    setEffectiveSizes([]);
  }

  useEffect(() => {
    if (!tag) {
      setActiveTagName(null);
      return;
    }
    getExplore()
      .then(({ tags }) => setActiveTagName(tags.find((t) => t.slug === tag)?.name ?? null))
      .catch(() => setActiveTagName(null));
  }, [tag]);

  const seoHeading = category ? humanize(category) : tag ? (activeTagName ?? humanize(tag)) : "Shop All Products";

  return (
    <div className="mx-auto max-w-7xl px-3 pt-0.5 pb-10 sm:px-6 lg:px-8">
      <h1 className="sr-only">{seoHeading}</h1>
      <BustSizeBanner />
      <ShopByCollectionSection activeCategory={category} activeTag={tag} />

      <div className="relative mt-[7.2px] flex gap-2.5">
        <div className="relative flex-1">
          <div
            className={`flex w-full items-center justify-center gap-[3.9px] rounded-full border py-[5.8px] text-[8.7px] ${
              activePreset ? "border-accent bg-accent-soft text-accent" : "border-black/15"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenPanel((p) => (p === "filter" ? null : "filter"))}
              className="flex min-w-0 flex-1 items-center justify-center gap-[3.9px] truncate"
            >
              <svg className="h-[9.7px] w-[9.7px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              {activePreset ? activePreset.label : "Filter"}
              <svg className="h-[7.8px] w-[7.8px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {activePreset && (
              <button
                type="button"
                onClick={() => setPricePreset(null)}
                aria-label="Clear price filter"
                className="mr-2 flex h-[13.6px] w-[13.6px] shrink-0 items-center justify-center rounded-full bg-accent-dark text-white"
              >
                <svg className="h-[7.8px] w-[7.8px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

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
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${pricePreset === preset.key ? "bg-accent-soft text-accent" : "hover:bg-black/[0.03]"
                    }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <div
            className={`flex w-full items-center justify-center gap-[3.9px] rounded-full border py-[5.8px] text-[8.7px] ${
              sort ? "border-accent bg-accent-soft text-accent" : "border-black/15"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenPanel((p) => (p === "sort" ? null : "sort"))}
              className="flex min-w-0 flex-1 items-center justify-center gap-[3.9px] truncate"
            >
              <svg className="h-[9.7px] w-[9.7px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M7 4v16M4 7l3-3 3 3M17 20V4m3 13l-3 3-3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {sort ? SORT_LABELS[sort] : "Sort"}
              <svg className="h-[7.8px] w-[7.8px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {sort && (
              <button
                type="button"
                onClick={() => setSort(null)}
                aria-label="Clear sort"
                className="mr-2 flex h-[13.6px] w-[13.6px] shrink-0 items-center justify-center rounded-full bg-accent-dark text-white"
              >
                <svg className="h-[7.8px] w-[7.8px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {openPanel === "sort" && (
            <div className="absolute top-full right-0 z-20 mt-2 w-52 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSort((s) => (s === key ? null : key));
                    setOpenPanel(null);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${sort === key ? "bg-accent-soft text-accent" : "hover:bg-black/[0.03]"
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
        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4">
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
        <div className="mt-8 flex flex-col items-center px-4 text-center">
          <OpenBoxHeartIllustration className="h-36 w-36" />
          <h2 className="mt-2 font-serif text-xl">No products found</h2>
          <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">
            Don&rsquo;t worry, we have plenty of other styles you&rsquo;ll love!{" "}
            <HeartIcon filled className="inline h-3.5 w-3.5 text-accent" />
          </p>
          {effectiveSizes.length > 0 && (
            <Link
              href="/select-size"
              className="mt-5 w-full max-w-xs rounded-full bg-accent py-3 text-center text-sm font-semibold tracking-wide text-white transition hover:bg-accent-dark"
            >
              Explore other sizes
            </Link>
          )}
          {effectiveSizes.length > 0 || pricePreset ? (
            <button
              type="button"
              onClick={() => {
                if (effectiveSizes.length > 0) clearSizeSelection();
                setPricePreset(null);
              }}
              className="mt-3 text-sm font-medium text-accent underline underline-offset-2"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/categories"
              className="mt-5 w-full max-w-xs rounded-full bg-accent py-3 text-center text-sm font-semibold tracking-wide text-white transition hover:bg-accent-dark"
            >
              Browse Collections
            </Link>
          )}
        </div>
      )}

      {loadState === "ready" && visibleProducts.length > 0 && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4">
            {visibleProducts.map((product) => (
              <ApiProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasNext && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="mx-auto mt-6 flex items-center justify-center rounded-full border border-accent px-6 py-2.5 text-xs font-semibold text-accent transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
