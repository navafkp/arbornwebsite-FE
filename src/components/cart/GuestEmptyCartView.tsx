"use client";

import Link from "next/link";
import { HeartIcon, ShoppingBagIllustration } from "@/components/ui/decor";
import CartRecommendations from "@/components/cart/CartRecommendations";
import FeatureStrip from "@/components/home/FeatureStrip";

export default function GuestEmptyCartView({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
      <FeatureStrip />
      <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
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
          <button
            type="button"
            onClick={onLoginClick}
            className="mt-3 block w-full text-center text-sm font-medium text-accent underline underline-offset-2 sm:text-left"
          >
            Login to use cart
          </button>
        </div>

        <div className="relative mx-auto h-[179.2px] w-[179.2px] sm:h-[204.8px] sm:w-[204.8px]">
          <span className="absolute inset-0 rounded-full bg-accent-soft blur-2xl" />
          <ShoppingBagIllustration className="relative h-full w-full" />
        </div>
      </div>

      <CartRecommendations />
    </div>
  );
}
