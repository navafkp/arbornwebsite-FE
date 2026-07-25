"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CartLine } from "@/lib/shop-context";
import { useShop } from "@/lib/shop-context";
import { formatPrice } from "@/lib/utils";
import { wasContactedViaWhatsApp } from "@/lib/whatsapp-contacted";

export default function CartLineItem({
  line,
  selected,
  onToggleSelect,
}: {
  line: CartLine;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const { updateQuantity, removeFromCart } = useShop();
  const [pending, setPending] = useState(false);
  const href = `/products/detail/?slug=${line.product.slug}`;

  async function changeQuantity(quantity: number) {
    setPending(true);
    try {
      await updateQuantity(line.id, quantity);
    } catch {
      // A session-expiry (401) already triggers the page's own login
      // prompt via shop-context's logOut() — nothing more to do here.
    } finally {
      setPending(false);
    }
  }

  async function handleRemove() {
    setPending(true);
    try {
      await removeFromCart(line.id);
    } catch {
      // Same as above.
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-[#f2dfe2] bg-white p-3 shadow-[0_2px_9px_rgba(85,43,55,0.06)]">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        aria-label={`Select ${line.product.name}`}
        className="mt-1 h-4 w-4 shrink-0 accent-accent"
      />
      <Link href={href} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f4f2ee]">
        <Image src={line.image_url} alt={line.product.name} fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={href} className="text-sm font-medium">
              {line.product.name}
            </Link>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {line.color} · Size {line.size_display_text}
            </p>
            {line.is_out_of_stock ? (
              <p className="mt-0.5 text-xs text-red-600">Out of stock</p>
            ) : line.is_stock_insufficient ? (
              <p className="mt-0.5 text-xs text-red-600">Only {line.stock_quantity} left</p>
            ) : null}
            {wasContactedViaWhatsApp(line.id) && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-green-700">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
                </svg>
                Contacted via WhatsApp
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={pending}
            aria-label="Remove item"
            className="p-1 text-black/40 transition hover:text-black disabled:opacity-40"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 rounded-full border border-black/10 px-2 py-1">
            <button
              type="button"
              onClick={() => changeQuantity(line.quantity - 1)}
              disabled={pending}
              aria-label="Decrease quantity"
              className="flex h-5 w-5 items-center justify-center text-sm disabled:opacity-40"
            >
              −
            </button>
            <span className="w-4 text-center text-xs">{line.quantity}</span>
            <button
              type="button"
              onClick={() => changeQuantity(line.quantity + 1)}
              disabled={pending}
              aria-label="Increase quantity"
              className="flex h-5 w-5 items-center justify-center text-sm disabled:opacity-40"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-accent">{formatPrice(Number(line.subtotal))}</span>
        </div>
      </div>
    </div>
  );
}
