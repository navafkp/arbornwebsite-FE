"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getProducts, type ApiProduct } from "@/lib/api-client";
import { getPreferredSizes, hasMadeSizeDecision } from "@/lib/preferred-size";
import ApiProductCard from "@/components/products/ApiProductCard";

export default function NewInSection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  // Static export prerenders with no localStorage, so this starts pointing
  // at the size picker and only switches to a direct product-list link
  // (skipping the picker) once we know a size is already stored.
  const [viewMoreHref, setViewMoreHref] = useState("/select-size");

  useEffect(() => {
    // Showing all products for now instead of filtering to a "New" tag.
    getProducts({})
      .then((data) => {
        setProducts(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  useEffect(() => {
    // A decision (size picked OR explicitly skipped) means never ask again —
    // not just "is a size stored", since skipping clears the stored size but
    // still counts as a decision already made.
    if (!hasMadeSizeDecision()) return;
    const preferredSizes = getPreferredSizes();
    const href = preferredSizes.length > 0 ? `/products?size=${preferredSizes.join(",")}` : "/products";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewMoreHref(href);
  }, []);

  const visibleProducts = useMemo(() => products.slice(0, 6), [products]);

  return (
    <div className="mt-[6.5px]">
      {loadState === "loading" && (
        <div className="mt-[10.8px] grid grid-cols-3 gap-1">
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
        <div className="mt-[10.8px] grid grid-cols-3 gap-1">
          {visibleProducts.map((product) => (
            <div key={product.id} className="mx-auto w-[90.3%]">
              <ApiProductCard product={product} showWishlist={false} compactPatternPreviews />
            </div>
          ))}
        </div>
      )}

      <Link
        href={viewMoreHref}
        className="mt-3 flex items-center justify-center gap-[4.2px] rounded-full border border-accent bg-accent py-[6.3px] text-[9.5px] font-bold text-white outline-none transition hover:border-accent-dark hover:bg-accent-dark focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        View More
        <svg className="h-[8.4px] w-[8.4px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
