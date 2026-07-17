"use client";

import { useSearchParams } from "next/navigation";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import ApiProductGrid from "@/components/products/ApiProductGrid";
import { SORT_OPTIONS, type SortKey } from "@/lib/constants";
import { getAllSizes } from "@/lib/data/products";
import type { Size } from "@/lib/types";

// Static-export (GitHub Pages) version of the /products page logic. There's
// no server at request time to read the URL's query string, so this reads it
// in the browser instead via useSearchParams. See src/app/products/page.tsx
// for the server-rendered equivalent used with a Node server (AWS).
export default function ProductsSearchParamsBridge() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const size = searchParams.get("size");
  // /select-size sends the backend's numeric size_code (e.g. ?size=1);
  // older links may still carry a mock Size letter (e.g. ?size=M), which
  // falls through to the mock catalog below instead.
  const sizeCode = size && /^\d+$/.test(size) ? Number(size) : undefined;

  // Category/tag/size entry points (e.g. from /categories or /select-size)
  // hit the real backend for live product data. Everything else still uses
  // the mock catalog until the rest of the API (price/color filters, sort,
  // search) exists.
  if (category || tag || sizeCode) {
    return (
      <ApiProductGrid category={category ?? undefined} tag={tag ?? undefined} size={sizeCode} />
    );
  }

  const validSort = SORT_OPTIONS.find((o) => o.key === sort)?.key as SortKey | undefined;
  const validSize = getAllSizes().find((s) => s === size) as Size | undefined;

  return (
    <ProductsPageClient
      initialCategory={category}
      initialSearch={search ?? ""}
      initialSort={validSort ?? "newest"}
      initialSize={validSize ?? null}
    />
  );
}
