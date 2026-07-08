import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsSearchParamsBridge from "@/components/products/ProductsSearchParamsBridge";

// --- AWS / Node server version (reads searchParams on the server) ---
// Revert to this when hosting on a Node server again (e.g. AWS). It replaces
// the Suspense + ProductsSearchParamsBridge below.
//
// import ProductsPageClient from "@/components/products/ProductsPageClient";
// import { SORT_OPTIONS, type SortKey } from "@/lib/constants";
// import { getAllSizes } from "@/lib/data/products";
// import type { Size } from "@/lib/types";
//
// interface ProductsPageProps {
//   searchParams: Promise<{ category?: string; search?: string; sort?: string; size?: string }>;
// }
//
// export default async function ProductsPage({ searchParams }: ProductsPageProps) {
//   const params = await searchParams;
//   const validSort = SORT_OPTIONS.find((o) => o.key === params.sort)?.key as SortKey | undefined;
//   const validSize = getAllSizes().find((s) => s === params.size) as Size | undefined;
//
//   return (
//     <ProductsPageClient
//       initialCategory={params.category ?? null}
//       initialSearch={params.search ?? ""}
//       initialSort={validSort ?? "newest"}
//       initialSize={validSize ?? null}
//     />
//   );
// }

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse Arborn's full collection of premium nightwear.",
  alternates: {
    canonical: "/products",
  },
};

// --- GitHub Pages static export version ---
// searchParams can't be read on the server with `output: "export"` (there is
// no server at request time), so the query string is read client-side inside
// ProductsSearchParamsBridge via useSearchParams instead.
export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsSearchParamsBridge />
    </Suspense>
  );
}
