"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";
import QuickViewModal from "@/components/product/QuickViewModal";

interface ProductRailSectionProps {
  title: string;
  viewAllHref: string;
  products: Product[];
  tinted?: boolean;
}

export default function ProductRailSection({
  title,
  viewAllHref,
  products,
  tinted,
}: ProductRailSectionProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <section className={tinted ? "bg-[#faf8f5]" : undefined}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-serif text-3xl">{title}</h2>
          <Link href={viewAllHref} className="text-xs tracking-wide text-[var(--muted)] hover:text-black">
            View All
          </Link>
        </div>

        <ProductGrid products={products} onQuickView={setQuickViewProduct} />
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
