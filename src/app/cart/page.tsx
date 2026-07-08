"use client";

import Link from "next/link";
import { useShop } from "@/lib/shop-context";
import { formatPrice } from "@/lib/utils";
import CartLineItem from "@/components/cart/CartLineItem";

export default function CartPage() {
  const { cart, cartSubtotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <svg className="h-12 w-12 text-black/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M6 8h12l-1 12a1.5 1.5 0 01-1.5 1.4h-7A1.5 1.5 0 017 20L6 8z" strokeLinejoin="round" />
          <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
        </svg>
        <h1 className="mt-5 font-serif text-2xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Explore our collection and find something you&rsquo;ll love.
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

  const shippingNote = cartSubtotal >= 999 ? "Free" : formatPrice(79);
  const estimatedTotal = cartSubtotal >= 999 ? cartSubtotal : cartSubtotal + 79;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">Your Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cart.map((line) => (
            <CartLineItem key={`${line.productId}-${line.size}-${line.color}`} line={line} />
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-black/[0.06] p-6">
          <h2 className="text-sm font-medium tracking-wide">Order Summary</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal</span>
              <span className="text-black">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping</span>
              <span className="text-black">{shippingNote}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-black/5 pt-3 text-sm font-medium">
              <span>Total</span>
              <span>{formatPrice(estimatedTotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-accent py-3.5 text-center text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-xs text-[var(--muted)] underline underline-offset-2 hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
