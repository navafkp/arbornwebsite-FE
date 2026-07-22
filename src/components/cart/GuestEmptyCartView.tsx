"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, getSizes, type ApiProduct, type BackendSize } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { HeartIcon, ShoppingBagIllustration } from "@/components/ui/decor";
import FeatureStrip from "@/components/home/FeatureStrip";

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

export default function GuestEmptyCartView() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [sizes, setSizes] = useState<BackendSize[]>([]);

  useEffect(() => {
    getProducts({})
      .then((data) => setProducts(data.slice(0, 8)))
      .catch(() => setProducts([]));
    getSizes()
      .then(setSizes)
      .catch(() => setSizes([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
        <div className="text-center sm:text-left">
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
            Your cart is <span className="italic text-accent">empty</span>{" "}
            <HeartIcon className="inline h-6 w-6 text-accent" />
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Explore our collection and find something you&rsquo;ll love.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-accent px-7 py-3 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
          >
            Explore Collection
          </Link>
          <Link
            href="/login?next=%2Fcart"
            className="mt-3 block text-sm font-medium text-accent underline underline-offset-2"
          >
            Login to use cart
          </Link>
        </div>

        <div className="relative mx-auto h-[179.2px] w-[179.2px] sm:h-[204.8px] sm:w-[204.8px]">
          <span className="absolute inset-0 rounded-full bg-accent-soft blur-2xl" />
          <ShoppingBagIllustration className="relative h-full w-full" />
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-10">
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
        </div>
      )}

      <div className="mt-4">
        <FeatureStrip />
      </div>
    </div>
  );
}
