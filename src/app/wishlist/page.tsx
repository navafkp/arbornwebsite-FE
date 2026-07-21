"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WishlistButton from "@/components/product/WishlistButton";
import { getExplore, getProducts, type ApiProduct, type ExploreItem } from "@/lib/api-client";
import { useShop } from "@/lib/shop-context";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import CollectionCircleRail from "@/components/common/CollectionCircleRail";
import ArbornStories from "@/components/common/ArbornStories";

type Inspiration = ExploreItem & { kind: "category" | "tag" };

function HeartIcon({ filled = false, className = "" }: { filled?: boolean; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M16 2c.8 8 4.2 12.2 12 14-7.8 1.8-11.2 6-12 14-.8-8-4.2-12.2-12-14C11.8 14.2 15.2 10 16 2Z" />
    </svg>
  );
}

function WishlistSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6" aria-label="Loading wishlist" aria-busy="true">
      <div className="mx-auto h-60 max-w-sm animate-pulse rounded-[2rem] bg-[var(--accent-soft)]/65 motion-reduce:animate-none" />
      <div className="mx-auto mt-8 h-8 w-56 animate-pulse rounded bg-[var(--border)] motion-reduce:animate-none" />
      <div className="mx-auto mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-[var(--border)] motion-reduce:animate-none" />
      <div className="mx-auto mt-8 h-12 w-56 animate-pulse rounded-full bg-[var(--accent-soft)] motion-reduce:animate-none" />
      <span className="sr-only">Loading your saved items</span>
    </div>
  );
}

function EditorialCollage({ products, inspiration }: { products: ApiProduct[]; inspiration: Inspiration[] }) {
  const images = [
    ...products.flatMap((product) => product.image_url ? [{ src: product.image_url, alt: product.name }] : []),
    ...inspiration.map((item) => ({ src: item.image_url, alt: item.name })),
  ].slice(0, 2);

  return (
    <div className="relative mx-auto h-[218px] w-full max-w-[350px] sm:h-[250px]" aria-hidden="true">
      <HeartIcon className="absolute left-[6%] top-[24%] h-6 w-6 -rotate-12 text-[#eea5b4]" />
      <HeartIcon className="absolute right-[5%] top-[48%] h-6 w-6 rotate-12 text-[#eea5b4]" />
      <Sparkle className="absolute right-[14%] top-[16%] h-9 w-9 text-[#eacdbf]" />

      <div className="absolute bottom-3 left-[9%] h-[132px] w-[124px] -rotate-[7deg] bg-white p-2 pb-7 shadow-[0_7px_18px_rgba(90,55,58,0.13)] sm:h-[150px] sm:w-[140px]">
        <span className="absolute -top-2 left-[37%] z-10 h-5 w-14 -rotate-2 bg-[#e9ddc9]/70" />
        <div className="relative h-full w-full overflow-hidden bg-[#f4e8e4]">
          {images[0] && <Image src={images[0].src} alt="" fill sizes="140px" className="object-cover" />}
        </div>
      </div>

      <div className="absolute bottom-2 right-[8%] h-[138px] w-[130px] rotate-[7deg] bg-white p-2 pb-7 shadow-[0_7px_18px_rgba(90,55,58,0.13)] sm:h-[156px] sm:w-[146px]">
        <span className="absolute -top-2 right-[29%] z-10 h-5 w-14 rotate-3 bg-[#e9ddc9]/70" />
        <div className="relative h-full w-full overflow-hidden bg-[#f4e8e4]">
          {images[1] && <Image src={images[1].src} alt="" fill sizes="146px" className="object-cover" />}
        </div>
      </div>

      <div className="absolute left-1/2 top-[13%] z-10 flex h-[142px] w-[142px] -translate-x-1/2 rotate-[5deg] items-center justify-center border-[7px] border-white bg-[#e8c4c3] shadow-[0_9px_22px_rgba(90,55,58,0.17)] sm:h-[158px] sm:w-[158px]">
        <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-2 bg-[#eadfca]/80" />
        <HeartIcon className="h-16 w-16 -rotate-[5deg] text-white" />
      </div>
    </div>
  );
}

function InspirationRail({ items, loading, error, retry }: { items: Inspiration[]; loading: boolean; error: boolean; retry: () => void }) {
  return (
    <section className="mt-11 sm:mt-14" aria-labelledby="inspiration-heading">
      <div className="flex items-center gap-3 text-center text-accent">
        <span className="h-px flex-1 bg-[#d9c6c1]" />
        <h2 id="inspiration-heading" className="shrink-0 text-xs font-medium tracking-[0.12em] uppercase sm:text-sm">Looking for inspiration?</h2>
        <span className="h-px flex-1 bg-[#d9c6c1]" />
      </div>

      {loading ? (
        <div className="mt-5 flex gap-4" aria-label="Loading inspiration" aria-busy="true">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-[59px] w-[59px] shrink-0 animate-pulse rounded-full bg-[var(--border)] motion-reduce:animate-none" />)}
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-white/60 p-5 text-center text-sm text-[var(--muted)]">
          Inspiration could not be loaded. <button type="button" onClick={retry} className="min-h-11 px-2 font-semibold text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Try again</button>
        </div>
      ) : items.length === 0 ? (
        <p className="mt-5 text-center text-sm text-[var(--muted)]">Explore our latest nightwear collections for something you’ll love.</p>
      ) : (
        <div className="-mx-4 mt-5 px-4 sm:mx-0 sm:px-0"><CollectionCircleRail items={items} label="Inspiration collections" /></div>
      )}
    </section>
  );
}

function SavedCard({ product }: { product: ApiProduct }) {
  const price = Number(product.base_discount_price ?? product.base_price);
  const original = product.base_discount_price ? Number(product.base_price) : null;
  return (
    <article className="relative overflow-hidden rounded-[18px] border border-[#eedddc] bg-white/85 shadow-[0_3px_14px_rgba(83,45,52,0.07)]">
      <Link href={`/products/detail?slug=${encodeURIComponent(product.slug)}`} className="grid grid-cols-[112px_minmax(0,1fr)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[150px_minmax(0,1fr)]">
        <div className="relative aspect-[3/4] bg-[#f3e5e2]">
          {product.image_url ? <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 640px) 112px, 150px" className="object-cover" /> : <span className="flex h-full items-center justify-center p-3 text-center text-xs text-[var(--muted)]">Image unavailable</span>}
        </div>
        <div className="flex min-w-0 flex-col justify-center px-4 py-5 pr-12">
          {product.tag?.name && <span className="mb-2 text-[10px] font-semibold tracking-[0.12em] text-accent uppercase">{product.tag.name}</span>}
          <h2 className="line-clamp-2 font-serif text-xl leading-5 sm:text-2xl sm:leading-6">{product.name}</h2>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm font-semibold">{formatPrice(price)}</span>
            {original !== null && <span className="text-xs text-[var(--muted)] line-through">{formatPrice(original)}</span>}
          </div>
          <span className="mt-3 text-xs text-[var(--muted)]">View colours and sizes</span>
        </div>
      </Link>
      <WishlistButton productId={String(product.id)} className="absolute right-3 top-3 h-11 w-11 border border-[#f0dfe0] bg-white text-accent shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" size="md" />
    </article>
  );
}

export default function WishlistPage() {
  const { hydrated: authHydrated, hasBackendSession } = useAuth();
  const { wishlist, hydrated } = useShop();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [inspiration, setInspiration] = useState<Inspiration[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [inspirationLoading, setInspirationLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [inspirationError, setInspirationError] = useState(false);
  const stateHeadingRef = useRef<HTMLHeadingElement>(null);

  const loadProducts = useCallback(() => {
    setProductsLoading(true);
    setProductsError(false);
    getProducts({}).then(setProducts).catch(() => setProductsError(true)).finally(() => setProductsLoading(false));
  }, []);

  const loadInspiration = useCallback(() => {
    setInspirationLoading(true);
    setInspirationError(false);
    getExplore().then(({ categories, tags }) => setInspiration([
      ...categories.map((item) => ({ ...item, kind: "category" as const })),
      ...tags.map((item) => ({ ...item, kind: "tag" as const })),
    ])).catch(() => setInspirationError(true)).finally(() => setInspirationLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getProducts({}), getExplore()]).then(([productResult, exploreResult]) => {
      if (!active) return;
      if (productResult.status === "fulfilled") setProducts(productResult.value);
      else setProductsError(true);
      setProductsLoading(false);

      if (exploreResult.status === "fulfilled") {
        const { categories, tags } = exploreResult.value;
        setInspiration([
          ...categories.map((item) => ({ ...item, kind: "category" as const })),
          ...tags.map((item) => ({ ...item, kind: "tag" as const })),
        ]);
      } else setInspirationError(true);
      setInspirationLoading(false);
    });
    return () => { active = false; };
  }, []);

  const items = useMemo(() => products.filter((product) => wishlist.includes(String(product.id))), [products, wishlist]);
  const previousItemCount = useRef(items.length);

  useEffect(() => {
    if (items.length < previousItemCount.current) stateHeadingRef.current?.focus();
    previousItemCount.current = items.length;
  }, [items.length]);

  if (!authHydrated || (hasBackendSession && (!hydrated || productsLoading))) return <WishlistSkeleton />;

  if (!hasBackendSession) {
    return (
      <div className="mx-auto w-full max-w-3xl px-3 pb-5 pt-4 sm:px-6 sm:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-[#ead8d5] bg-white/60 shadow-[0_14px_44px_rgba(96,55,62,0.08)]" aria-labelledby="wishlist-login-heading">
          <div className="px-5 pb-8 pt-4 text-center sm:px-12 sm:pb-10 sm:pt-7">
            <EditorialCollage products={products} inspiration={inspiration} />
            <h1 id="wishlist-login-heading" className="-mt-1 font-serif text-[2.5rem] leading-[0.94] sm:text-[3.5rem]">
              Log in to use your<br /><span className="text-accent">wishlist</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base">Save the nightwear you love and find it again whenever you’re ready.</p>
            <div className="mx-auto mt-6 flex max-w-xs flex-col items-stretch gap-2">
              <Link href="/login?next=%2Fwishlist" aria-label="Continue with Google to use your wishlist" className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none">Continue with Google</Link>
              <Link href="/products" className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-accent underline decoration-accent/30 underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Explore Products <span className="ml-1" aria-hidden="true">→</span></Link>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-[#ead8d5] bg-[#faecec]/75 px-2 py-4 sm:px-6 sm:py-5" aria-label="Account benefits">
            <div className="flex min-w-0 flex-col items-center gap-2 border-r border-[#dfc7c5] px-2 text-center">
              <HeartIcon className="h-6 w-6 text-accent" />
              <p className="text-[10px] font-medium leading-3.5 text-[#513b40] sm:text-xs">Save your favourites</p>
            </div>
            <div className="flex min-w-0 flex-col items-center gap-2 border-r border-[#dfc7c5] px-2 text-center">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 9a5 5 0 0 1 10 0c0 6 2.5 6.5 2.5 8H4.5C4.5 15.5 7 15 7 9Z" strokeLinejoin="round"/><path d="M10 20h4" strokeLinecap="round"/></svg>
              <p className="text-[10px] font-medium leading-3.5 text-[#513b40] sm:text-xs">Get restock alerts</p>
            </div>
            <div className="flex min-w-0 flex-col items-center gap-2 px-2 text-center">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round"/></svg>
              <p className="text-[10px] font-medium leading-3.5 text-[#513b40] sm:text-xs">Shop faster next time</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (productsError) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6" aria-labelledby="wishlist-error-heading">
        <HeartIcon className="h-12 w-12 text-[var(--accent-soft)]" filled />
        <h1 id="wishlist-error-heading" className="mt-5 font-serif text-3xl">We couldn’t open your wishlist</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">Your saved items are still safe. Check your connection and try loading them again.</p>
        <button type="button" onClick={loadProducts} className="mt-6 min-h-11 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Try Again</button>
      </section>
    );
  }

  if (items.length > 0) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="wishlist-heading">
        <h1 ref={stateHeadingRef} tabIndex={-1} id="wishlist-heading" className="font-serif text-4xl outline-none sm:text-5xl">Your Wishlist</h1>
        <p className="mt-1 text-sm text-[var(--muted)]" role="status" aria-live="polite" aria-atomic="true">{items.length} {items.length === 1 ? "item" : "items"} saved for later</p>
        <div className="mt-7 grid gap-4 sm:mt-9 sm:grid-cols-2">{items.map((product) => <SavedCard key={product.id} product={product} />)}</div>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8">
      <section className="text-center" aria-labelledby="wishlist-empty-heading">
        <EditorialCollage products={products} inspiration={inspiration} />
        <h1 ref={stateHeadingRef} tabIndex={-1} id="wishlist-empty-heading" className="mt-4 font-serif text-[2rem] leading-none outline-none sm:text-[2.75rem]">Your <span className="text-accent">wishlist</span> is empty</h1>
        <p className="sr-only" role="status" aria-live="polite">Wishlist is empty.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base">Tap the heart on any product to save it here<br className="hidden min-[360px]:block" /> for later.</p>
        <Link href="/products" className="mx-auto mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-9 py-3 text-sm font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Explore Collections</Link>
      </section>
      <InspirationRail items={inspiration} loading={inspirationLoading} error={inspirationError} retry={loadInspiration} />
      <div className="mt-5 border-t border-[#eadbd7] pt-3 sm:mt-6 sm:pt-4">
        <ArbornStories />
      </div>
    </div>
  );
}
