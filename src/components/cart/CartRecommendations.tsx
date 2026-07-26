"use client";

import { useEffect, useState } from "react";
import { getProducts, getSizes, type ApiProduct, type BackendSize } from "@/lib/api-client";
import { getPreferredSizes } from "@/lib/preferred-size";
import { HeartIcon } from "@/components/ui/decor";
import ApiProductCard from "@/components/products/ApiProductCard";

export default function CartRecommendations() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [sizeLabels, setSizeLabels] = useState<BackendSize[]>([]);

  useEffect(() => {
    getProducts({ page_size: 8 })
      .then((data) => setProducts(data.items))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    getSizes().then(setSizeLabels).catch(() => setSizeLabels([]));
  }, []);

  // Never recommend something out of stock. If the shopper has a saved
  // size, only recommend items that actually stock it — otherwise show
  // anything with stock.
  const preferredCodes = getPreferredSizes();
  const preferredSizeLabels = sizeLabels
    .filter((s) => s.codes.some((code) => preferredCodes.includes(code)))
    .map((s) => s.display_text);
  const visibleProducts = products.filter((p) => {
    const hasStock = (p.colors?.length ?? 0) > 0 || (p.sizes?.length ?? 0) > 0;
    if (!hasStock) return false;
    if (preferredSizeLabels.length === 0) return true;
    return (p.sizes ?? []).some((s) => preferredSizeLabels.includes(s));
  });

  return (
    <div className="mt-10">
      {visibleProducts.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-black/10" />
            <span className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
              <HeartIcon className="h-3.5 w-3.5 text-accent" />
              You might love these
              <HeartIcon className="h-3.5 w-3.5 text-accent" />
            </span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <div className="no-scrollbar mt-5 flex snap-x gap-2 overflow-x-auto pb-1 sm:gap-3">
            {visibleProducts.map((product) => (
              <div key={product.id} className="w-[42vw] shrink-0 snap-start sm:w-[180px]">
                <ApiProductCard product={product} showWishlist={false} compactPatternPreviews />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
