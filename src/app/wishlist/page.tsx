"use client";

import Link from "next/link";
import { useShop } from "@/lib/shop-context";
import { products } from "@/lib/data/products";
import WishlistProductCard from "@/components/product/WishlistProductCard";
import BackButton from "@/components/ui/BackButton";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <BackButton className="mb-6 self-start" />
        <svg className="h-12 w-12 text-black/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path
            d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="mt-5 font-serif text-2xl">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Tap the heart on any product to save it here for later.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-accent px-7 py-3 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <BackButton className="mb-4" />
      <h1 className="font-serif text-3xl">Your Wishlist</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((product) => (
          <WishlistProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
