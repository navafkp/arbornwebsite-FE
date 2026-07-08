"use client";

import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  detailed?: boolean;
  onQuickView?: (product: Product) => void;
  className?: string;
}

export default function ProductGrid({
  products,
  detailed,
  onQuickView,
  className,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-[var(--muted)]">
          No products match your filters right now.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          <ProductCard product={product} detailed={detailed} onQuickView={onQuickView} />
        </div>
      ))}
    </div>
  );
}
