import type { Metadata } from "next";
import { Suspense } from "react";
import ApiProductDetail from "@/components/products/ApiProductDetail";

// This is a single static route shared by every product (see the note
// below), so this metadata is necessarily generic — it can't carry a given
// product's own name/price/image the way per-product metadata normally
// would. Getting real per-product titles/descriptions/OG tags requires
// moving to a `/products/[slug]/` route with generateStaticParams +
// generateMetadata pulling real data at build time.
export const metadata: Metadata = {
  title: "Product Details",
  description: "Explore this piece from Arborn's nightwear collection — premium, comfortable, and made for you.",
};

// Static-export (GitHub Pages) equivalent of a `/products/[slug]` detail
// page for products that live in the real backend rather than the mock
// catalog. Static export can only pre-render paths known at build time
// (see generateStaticParams in src/app/products/[slug]/page.tsx), so
// backend products — whose slugs aren't known then — go through this
// single static route instead, reading `?slug=` client-side.
export default function ProductDetailPage() {
  return (
    <Suspense fallback={null}>
      <ApiProductDetail />
    </Suspense>
  );
}
