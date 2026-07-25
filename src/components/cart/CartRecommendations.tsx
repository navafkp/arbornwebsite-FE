"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, getSizes, type ApiProduct, type BackendSize } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { HeartIcon } from "@/components/ui/decor";

function RecommendedCard({ product, sizes }: { product: ApiProduct; sizes: BackendSize[] }) {
  const price = Number(product.base_price);
  const discountPrice = product.base_discount_price ? Number(product.base_discount_price) : null;

  return (
    <article className="w-[42vw] shrink-0 snap-start overflow-hidden rounded-[8px] border border-[#f2dfe2] bg-[#fffefd] shadow-[0_2px_9px_rgba(85,43,55,0.07)] sm:w-[180px]">
      <Link href={`/products/detail?slug=${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f8f1ef]">
          {product.image_url && (
            <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 639px) 42vw, 180px" className="object-cover" />
          )}
        </div>
        <div className="px-2 pt-2 pb-2">
          <span className="block truncate text-xs font-medium">{product.name}</span>
          {product.tag?.name && (
            <span className="block truncate text-[10px] text-[var(--muted)]">{product.tag.name}</span>
          )}
          <span className="mt-1 block text-xs font-semibold text-accent">
            {formatPrice(discountPrice ?? price)}
          </span>
          {sizes.length > 0 && (
            <div className="mt-1.5 flex gap-1">
              {sizes.slice(0, 3).map((s, i) => (
                <span
                  key={s.size_code}
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium ${
                    i === 0 ? "bg-accent-soft text-accent" : "bg-black/5 text-black/60"
                  }`}
                >
                  {s.display_text}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default function CartRecommendations() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [sizes, setSizes] = useState<BackendSize[]>([]);

  useEffect(() => {
    getProducts({ page_size: 8 })
      .then((data) => setProducts(data.items))
      .catch(() => setProducts([]));
    getSizes()
      .then(setSizes)
      .catch(() => setSizes([]));
  }, []);

  return (
    <div className="mt-10">
      {products.length > 0 && (
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
            {products.map((product) => (
              <RecommendedCard key={product.id} product={product} sizes={sizes} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
