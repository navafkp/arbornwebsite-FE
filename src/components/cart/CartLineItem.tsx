"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CartLine } from "@/lib/shop-context";
import { useShop } from "@/lib/shop-context";
import { formatPrice } from "@/lib/utils";

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
    } finally {
      setPending(false);
    }
  }

  async function handleRemove() {
    setPending(true);
    try {
      await removeFromCart(line.id);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-3 border-b border-black/5 py-5 last:border-0">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        aria-label={`Select ${line.product.name}`}
        className="mt-1 h-4 w-4 shrink-0 accent-accent"
      />
      <Link href={href} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f4f2ee]">
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
          <span className="text-sm font-medium">{formatPrice(Number(line.subtotal))}</span>
        </div>
      </div>
    </div>
  );
}
