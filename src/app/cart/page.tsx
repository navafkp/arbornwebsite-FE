"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useShop } from "@/lib/shop-context";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppLink, buildCartOrderMessage } from "@/lib/whatsapp";
import { markContactedViaWhatsApp, wasContactedViaWhatsApp } from "@/lib/whatsapp-contacted";
import { getPreferredSizes } from "@/lib/preferred-size";
import CartGroupSection from "@/components/cart/CartGroupSection";
import LoginModal from "@/components/auth/LoginModal";
import GuestEmptyCartView from "@/components/cart/GuestEmptyCartView";
import CartRecommendations from "@/components/cart/CartRecommendations";
import FeatureStrip from "@/components/home/FeatureStrip";

export default function CartPage() {
  const { cart, cartSubtotal, cartLoading, refreshCart, removeManyFromCart, toggleWishlist, isWishlisted } = useShop();
  const { hasBackendSession, hydrated, user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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

  function selectAllInGroup(ids: number[], select: boolean) {
    setSelectedIds((prev) => (select ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id))));
  }

  async function removeSelectedGroup(ids: number[]) {
    await removeManyFromCart(ids);
  }

  // Adds each selected line's product to the wishlist (skipping ones
  // already there, since toggleWishlist would otherwise remove them) before
  // dropping the lines from the cart.
  async function moveSelectedGroupToWishlist(ids: number[]) {
    const lines = cart.filter((line) => ids.includes(line.id));
    await Promise.all(
      lines.filter((line) => !isWishlisted(line.product.id)).map((line) => toggleWishlist(line.product.id)),
    );
    await removeManyFromCart(ids);
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
          message="Sign in to view your cart."
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

  const hasContactedItem = cart.some((line) => wasContactedViaWhatsApp(line.id));

  // A cart line was added in whatever size was current at the time — the
  // shopper may have since changed their saved size elsewhere (product page,
  // /select-size). Free-size lines fit every size they list, so they always
  // match; everything else is compared against the current preference.
  const preferredSizeCodes = getPreferredSizes();
  function matchesPreferredSize(line: (typeof cart)[number]) {
    if (preferredSizeCodes.length === 0) return true;
    if (line.size_display_text.toLowerCase().includes("free size")) return true;
    return preferredSizeCodes.includes(line.size_code);
  }

  const outOfStockItems = cart.filter((line) => line.is_out_of_stock);
  const inStockItems = cart.filter((line) => !line.is_out_of_stock);
  const mismatchedIds = new Set(
    inStockItems.filter((line) => line.is_stock_insufficient || !matchesPreferredSize(line)).map((line) => line.id),
  );
  // cartSubtotal (from the backend's total_amount) covers every line —
  // out-of-stock items can't actually be bought, so the summary shouldn't
  // charge for them.
  const purchasableSubtotal = inStockItems.reduce((sum, line) => sum + Number(line.subtotal), 0);

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
            <span className="block font-medium">Your order is already on WhatsApp ❤️</span>
            Remove those items from your cart.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <span className="text-sm font-semibold text-accent">{cart.length} {cart.length === 1 ? "Item" : "Items"}</span>

          <CartGroupSection
            title="Available"
            items={inStockItems}
            mismatchedIds={mismatchedIds}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAllGroup={selectAllInGroup}
            onRemoveSelected={removeSelectedGroup}
            onMoveToWishlistSelected={moveSelectedGroupToWishlist}
          />
          <CartGroupSection
            title="Out of Stock"
            tone="danger"
            items={outOfStockItems}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAllGroup={selectAllInGroup}
            onRemoveSelected={removeSelectedGroup}
            onMoveToWishlistSelected={moveSelectedGroupToWishlist}
          />
        </div>

        <div className="h-fit rounded-2xl bg-accent-soft/60 p-6">
          <h2 className="text-sm font-medium tracking-wide">Cart Summary</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal</span>
              <span className="text-black">{formatPrice(purchasableSubtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping</span>
              <span className="text-accent">Free</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-black/10 pt-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold text-accent">{formatPrice(purchasableSubtotal)}</span>
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
          <p className="mt-3 text-center text-[11px] text-[var(--muted)]">Out of stock items excluded from cart</p>
        </div>
      </div>

      <CartRecommendations />
    </div>
  );
}
