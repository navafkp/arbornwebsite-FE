"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, getSizes, type ApiProduct, type BackendSize } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { HeartIcon, FlowerIcon, ShoppingBagIllustration } from "@/components/ui/decor";
import WishlistButton from "@/components/product/WishlistButton";
import FeatureStrip from "@/components/home/FeatureStrip";

function RecommendedCard({ product, sizes }: { product: ApiProduct; sizes: BackendSize[] }) {
  const price = Number(product.base_price);
  const discountPrice = product.base_discount_price ? Number(product.base_discount_price) : null;

  return (
    <article className="relative overflow-hidden rounded-[8px] border border-[#f2dfe2] bg-[#fffefd] shadow-[0_2px_9px_rgba(85,43,55,0.07)]">
      <Link href={`/products/detail?slug=${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f8f1ef]">
          {product.image_url && (
            <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 639px) 25vw, 20vw" className="object-cover" />
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
      <WishlistButton productId={String(product.id)} className="absolute top-1.5 right-1.5 z-10 h-7 w-7 bg-white/95 shadow-sm" />
    </article>
  );
}

export default function GuestEmptyCartView() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [sizes, setSizes] = useState<BackendSize[]>([]);

  useEffect(() => {
    getProducts({})
      .then((data) => setProducts(data.slice(0, 4)))
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
        </div>

        <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
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

          <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
            {products.map((product) => (
              <RecommendedCard key={product.id} product={product} sizes={sizes} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <FeatureStrip />
      </div>

      <div className="mt-6 rounded-3xl border border-black/[0.06] bg-[#fffefd] p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h2 className="flex items-center gap-1.5 font-serif text-xl">
              Your Order Summary
              <HeartIcon className="h-4 w-4 text-accent" />
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="text-black">{formatPrice(0)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  Shipping
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5.5M12 8v.01" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-black">Free</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-black/5 pt-2.5 text-sm font-semibold">
                <span>Estimated Total</span>
                <span>{formatPrice(0)}</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-accent/40 bg-accent-soft/60 text-center">
            <FlowerIcon className="absolute -top-3 -left-3 h-8 w-8 text-accent/20" />
            <FlowerIcon className="absolute -right-3 -bottom-3 h-8 w-8 rotate-180 text-accent/20" />
            <p className="font-serif text-sm leading-tight text-accent italic">
              Treat
              <br />
              yourself
              <HeartIcon filled className="mx-auto mt-1 h-3 w-3 text-accent" />
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-center text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
        >
          Start Shopping
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
