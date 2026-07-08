"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/shop-context";
import { useShop } from "@/lib/shop-context";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export default function CartLineItem({ line }: { line: CartLine }) {
  const { updateQuantity, removeFromCart } = useShop();
  const product = getProductBySlug(line.productId);
  if (!product) return null;

  const color = product.colors.find((c) => c.name === line.color) ?? product.colors[0];

  return (
    <div className="flex gap-4 border-b border-black/5 py-5 last:border-0">
      <Link href={`/products/${product.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f4f2ee]">
        <Image src={color.images[0]} alt={product.name} fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/products/${product.slug}`} className="text-sm font-medium">
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {line.color} · Size {line.size}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(line.productId, line.size, line.color)}
            aria-label="Remove item"
            className="p-1 text-black/40 transition hover:text-black"
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
              onClick={() => updateQuantity(line.productId, line.size, line.color, line.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-5 w-5 items-center justify-center text-sm"
            >
              −
            </button>
            <span className="w-4 text-center text-xs">{line.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(line.productId, line.size, line.color, line.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-5 w-5 items-center justify-center text-sm"
            >
              +
            </button>
          </div>
          <span className="text-sm font-medium">{formatPrice(product.price * line.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
