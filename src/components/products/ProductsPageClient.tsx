"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { PRICE_PRESETS, type SortKey } from "@/lib/constants";
import FilterSidebar, { EMPTY_FILTERS, type ProductFilters } from "@/components/filters/FilterSidebar";
import MobileFilterDrawer from "@/components/filters/MobileFilterDrawer";
import SortDropdown from "@/components/filters/SortDropdown";
import SearchBar from "@/components/layout/SearchBar";
import ProductGrid from "@/components/product/ProductGrid";
import QuickViewModal from "@/components/product/QuickViewModal";
import LoadMoreButton from "@/components/common/LoadMoreButton";
import type { Product, Size } from "@/lib/types";

const PAGE_SIZE = 8;

interface ProductsPageClientProps {
  initialCategory: string | null;
  initialSearch: string;
  initialSort: SortKey;
  initialSize: Size | null;
}

export default function ProductsPageClient({
  initialCategory,
  initialSearch,
  initialSort,
  initialSize,
}: ProductsPageClientProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    ...EMPTY_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
    sizes: initialSize ? [initialSize] : [],
  });
  const [sizeBanner, setSizeBanner] = useState<Size | null>(initialSize);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [search] = useState(initialSearch);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  function handleFiltersChange(next: ProductFilters) {
    if (sizeBanner && !(next.sizes.length === 1 && next.sizes[0] === sizeBanner)) {
      setSizeBanner(null);
    }
    setFilters(next);
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const pricePreset = PRICE_PRESETS.find((p) => p.key === filters.pricePreset);

    let list = products.filter((product) => {
      if (filters.categories.length && !filters.categories.includes(product.categorySlug)) {
        return false;
      }
      if (pricePreset && (product.price < pricePreset.min || product.price >= pricePreset.max)) {
        return false;
      }
      if (filters.sizes.length && !product.sizes.some((s) => filters.sizes.includes(s))) {
        return false;
      }
      if (
        filters.colors.length &&
        !product.colors.some((c) => filters.colors.includes(c.name))
      ) {
        return false;
      }
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      if (query) {
        const haystack = `${product.name} ${product.fabric} ${product.categorySlug}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "bestselling":
          return Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")) ||
            b.rating - a.rating;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return list;
  }, [filters, sort, search]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const activeCategory = filters.categories.length === 1 ? getCategoryBySlug(filters.categories[0]) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {sizeBanner && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-accent-soft px-4 py-3 text-sm">
          <span>
            Showing products for size: <strong>{sizeBanner}</strong>
          </span>
          <Link href="/select-size" className="text-xs font-medium text-accent-dark underline underline-offset-2">
            Change
          </Link>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">{activeCategory ? activeCategory.name : "All Products"}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
        <SearchBar defaultValue={search} className="w-full sm:max-w-xs" />
      </div>

      <div className="mb-8 flex items-center justify-between gap-3 border-y border-black/5 py-3">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-xs tracking-wide lg:hidden"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
          Filters
        </button>
        <div className="hidden text-xs tracking-widest text-[var(--muted)] uppercase lg:block">
          Refine
        </div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <FilterSidebar filters={filters} onChange={handleFiltersChange} />
        </aside>

        <div className="flex-1">
          <ProductGrid products={visibleProducts} detailed onQuickView={setQuickViewProduct} />
          <LoadMoreButton
            loadedCount={visibleProducts.length}
            totalCount={filtered.length}
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          />
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={handleFiltersChange}
        resultCount={filtered.length}
      />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
