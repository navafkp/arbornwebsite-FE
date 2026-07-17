import { Suspense } from "react";
import ApiProductDetail from "@/components/products/ApiProductDetail";

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
