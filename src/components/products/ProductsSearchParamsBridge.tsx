"use client";

import { useSearchParams } from "next/navigation";
import ApiProductGrid from "@/components/products/ApiProductGrid";

// Reads URL search params client-side (needed for static export / GitHub Pages
// where there is no server at request time) and passes them to ApiProductGrid.
// ApiProductGrid will also pick up the user's saved size from localStorage if
// no ?size= is present in the URL.
export default function ProductsSearchParamsBridge() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const sizeParams = searchParams.getAll("size");
  // /select-size sends a numeric size_code (e.g. ?size=1); ignore letters.
  const sizeCodes = sizeParams
    .flatMap((s) => s.split(","))
    .map(Number)
    .filter((n) => !isNaN(n));

  return (
    <ApiProductGrid category={category} tag={tag} sizes={sizeCodes} />
  );
}
