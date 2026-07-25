"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useShop } from "@/lib/shop-context";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppLink, buildCartOrderMessage } from "@/lib/whatsapp";
import { markContactedViaWhatsApp, wasContactedViaWhatsApp } from "@/lib/whatsapp-contacted";
import CartLineItem from "@/components/cart/CartLineItem";
import LoginModal from "@/components/auth/LoginModal";
import GuestEmptyCartView from "@/components/cart/GuestEmptyCartView";
import CartRecommendations from "@/components/cart/CartRecommendations";
import FeatureStrip from "@/components/home/FeatureStrip";

export default function CartPage() {
  const { cart, cartSubtotal, cartLoading, refreshCart, removeManyFromCart } = useShop();
  const { hasBackendSession, hydrated, user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deletingSelected, setDeletingSelected] = useState(false);
  // Bumped after marking cart items as WhatsApp-contacted to force a
  // re-render — wasContactedViaWhatsApp reads localStorage directly and
  // isn't otherwise part of any state this component re-renders on.
  const [, forceRerender] = useState(0);

  function handleOrderViaWhatsApp() {
    cart.forEach((line) => markContactedViaWhatsApp(line.id));
    forceRerender((n) => n + 1);
  }

  useEffect(() => {
    // Dropping selections for items removed elsewhere (e.g. a line's own
    // remove button) so stale ids don't linger in the selection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds((prev) => prev.filter((id) => cart.some((line) => line.id === id)));
  }, [cart]);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  async function handleDeleteSelected() {
    setDeletingSelected(true);
    try {
      await removeManyFromCart(selectedIds);
      setSelectedIds([]);
    } catch {
      // A session-expiry (401) already triggers the login prompt below via
      // shop-context's logOut() — nothing more to do here.
    } finally {
      setDeletingSelected(false);
    }
  }

  useEffect(() => {
    // Synchronizing from an external system (auth's own hydration state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hydrated && !hasBackendSession) setLoginModalOpen(true);
  }, [hydrated, hasBackendSession]);

  if (!hydrated) return null;

  if (!hasBackendSession) {
    return (
      <>
        <GuestEmptyCartView onLoginClick={() => setLoginModalOpen(true)} />
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSuccess={refreshCart}
        />
      </>
    );
  }

  if (cartLoading && cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded bg-black/5" />
        <div className="mt-8 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-black/5" />
          ))}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <FeatureStrip />
        <div className="flex flex-col items-center py-16 text-center">
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
        <CartRecommendations />
      </div>
    );
  }

  const whatsappLink = buildWhatsAppLink(
    buildCartOrderMessage({
      items: cart.map((line) => ({
        name: line.product.name,
        color: line.color,
        size: line.size_display_text,
        quantity: line.quantity,
        price: formatPrice(Number(line.subtotal)),
      })),
      subtotal: formatPrice(cartSubtotal),
      customerName: user?.name,
      customerEmail: user?.email,
    }),
  );

  const allSelected = selectedIds.length === cart.length;
  const hasContactedItem = cart.some((line) => wasContactedViaWhatsApp(line.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <FeatureStrip />

      <h1 className="mt-6 font-serif text-3xl">Your Cart</h1>

      {hasContactedItem && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-accent-soft px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-accent">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
            </svg>
          </span>
          <p className="text-xs text-[#7a4650]">
            <span className="block font-medium">Already sorted this over WhatsApp?</span>
            Remove it anytime to keep your cart tidy.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-accent">{cart.length} {cart.length === 1 ? "Item" : "Items"}</span>
              <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelectedIds(allSelected ? [] : cart.map((line) => line.id))}
                  className="h-4 w-4 accent-accent"
                />
                Select all
              </label>
            </div>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={deletingSelected}
                className="text-xs font-medium text-red-600 underline underline-offset-2 disabled:opacity-40"
              >
                {deletingSelected ? "Removing..." : `Remove selected (${selectedIds.length})`}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {cart.map((line) => (
              <CartLineItem
                key={line.id}
                line={line}
                selected={selectedIds.includes(line.id)}
                onToggleSelect={() => toggleSelect(line.id)}
              />
            ))}
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-accent-soft/60 p-6">
          <h2 className="text-sm font-medium tracking-wide">Cart Summary</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal</span>
              <span className="text-black">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping</span>
              <span className="text-accent">Free</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-black/10 pt-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold text-accent">{formatPrice(cartSubtotal)}</span>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOrderViaWhatsApp}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-center text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
            </svg>
            Order via WhatsApp
          </a>
          <Link
            href="/products"
            className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-accent underline underline-offset-2"
          >
            Continue Shopping
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <CartRecommendations />
    </div>
  );
}
