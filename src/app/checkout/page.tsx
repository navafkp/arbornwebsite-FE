"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useShop } from "@/lib/shop-context";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useShop();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });

  function handlePlaceOrder(e: FormEvent) {
    e.preventDefault();
    setOrderId(`AB-${10000 + (cart.length * 37 + form.pincode.length * 13)}`);
    setPlaced(true);
    clearCart();
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-5 font-serif text-3xl">Order Placed!</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Thank you, {form.name.split(" ")[0] || "there"}. Your order{" "}
          <span className="font-medium text-black">#{orderId}</span> has been received. We&rsquo;ll
          reach out on {form.phone || "your phone"} to confirm delivery details.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-accent px-7 py-3 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-2xl">Nothing to check out</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Your cart is currently empty.</p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-accent px-7 py-3 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const shipping = cartSubtotal >= 999 ? 0 : 79;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4 lg:col-span-2">
          <h2 className="text-sm font-medium tracking-wide">Shipping Details</h2>
          <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
            Full Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
            Mobile Number
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
            Address
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="resize-none rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
              City
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-[var(--muted)]">
              Pincode
              <input
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="rounded-lg border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-accent"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-full bg-accent py-3.5 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
          >
            Place Order
          </button>
          <p className="text-center text-[11px] text-[var(--muted)]">
            Cash on delivery. No online payment required at this time.
          </p>
        </form>

        <div className="h-fit rounded-2xl border border-black/[0.06] p-6">
          <h2 className="text-sm font-medium tracking-wide">Order Summary</h2>
          <div className="mt-4 flex flex-col gap-3">
            {cart.map((line) => {
              const product = getProductBySlug(line.productId);
              if (!product) return null;
              return (
                <div key={`${line.productId}-${line.size}-${line.color}`} className="flex justify-between text-xs">
                  <span className="text-[var(--muted)]">
                    {product.name} × {line.quantity}
                    <br />
                    {line.color} / {line.size}
                  </span>
                  <span className="text-black">{formatPrice(product.price * line.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-3 text-sm">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal</span>
              <span className="text-black">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping</span>
              <span className="text-black">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-2 font-medium">
              <span>Total</span>
              <span>{formatPrice(cartSubtotal + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
