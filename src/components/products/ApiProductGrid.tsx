"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts, getExplore, getSizes, type ApiProduct } from "@/lib/api-client";
import { getPreferredSizes, clearPreferredSize } from "@/lib/preferred-size";
import ApiProductCard from "@/components/products/ApiProductCard";
import BackButton from "@/components/ui/BackButton";

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
  const router = useRouter();
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
  const [activeSizeNames, setActiveSizeNames] = useState<string[]>([]);
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

  useEffect(() => {
    if (effectiveSizes.length === 0) {
      setActiveSizeNames([]);
      return;
    }
    getSizes()
      .then((data) => {
        const names = effectiveSizes.map((code) => {
          const matched = data.find((s) => s.size_code === code);
          return matched ? matched.display_text : String(code);
        });
        setActiveSizeNames(names);
      })
      .catch(() => setActiveSizeNames([]));
  }, [effectiveSizes]);

  const heading = category ? humanize(category) : tag ? (activeTagName ?? humanize(tag)) : "Products";

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 lg:px-8">
      {/* <BackButton className="mb-4" /> */}


      <div className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-background px-4 pt-4 pb-4">
        {/* Left Back Button */}

        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <BackButton />
        </div>

        {/* Center Logo */}
        <div className="flex flex-col items-center">
          <p className="text-[20px] font-medium tracking-[0.35em] uppercase text-neutral-500">
            ARBORN
          </p>

          <h1 className="mt-0 font-serif text-sm tracking-[0.25em] text-[#D88FA0]">
            NIGHTWEAR
          </h1>
        </div>
      </div>
      <div className="h-[72px]" />




      <div
        className={
          effectiveSizes.length === 0
            ? "sticky top-[74px] z-40 mb-6"
            : "mb-6"
        }
      >
        {effectiveSizes.length > 0 ? (

          <div className="flex items-center justify-between gap-2 rounded-lg border border-black/5 bg-accent-soft px-3 py-2 shadow-sm">
            <span className="truncate text-xs">
              Showing products for size{" "}
              <strong>
                {activeSizeNames.length > 0 ? activeSizeNames.join(", ") : "..."}
              </strong>
            </span>

            <Link
              href="/select-size"
              className="text-[11px] font-medium text-accent-dark underline underline-offset-2"
            >
              Change
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-dashed border-pink-200 bg-accent-soft px-4 py-3 shadow-lg backdrop-blur">
            <span className="text-sm">Choose your size for a better fit.</span>

            <Link
              href="/select-size"
              className="text-[11px] font-medium text-accent-dark underline underline-offset-2"
            >
              Choose Size
            </Link>
          </div>
        )}
      </div>



      <div className="mt-2">
        <h1 className="font-serif text-3xl">{heading}</h1>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          {loadState === "ready"
            ? `${products.length} ${products.length === 1 ? "product" : "products"}`
            : " "}
        </p>
      </div>

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
