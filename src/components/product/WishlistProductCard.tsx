"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { buildWhatsAppLink, buildOrderInquiryMessage } from "@/lib/whatsapp";
import RatingStars from "@/components/ui/RatingStars";
import ColorSwatch from "@/components/ui/ColorSwatch";
import WishlistButton from "@/components/product/WishlistButton";

export default function WishlistProductCard({ product }: { product: Product }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const color = product.colors[colorIndex];

  const whatsappLink = buildWhatsAppLink(
    buildOrderInquiryMessage({
      productName: product.name,
      color: color.name,
      size: product.sizes[sizeIndex],
      price: formatPrice(product.price),
    }),
  );

  return (
    <div className="flex gap-4 rounded-2xl border border-black/[0.06] p-4 sm:gap-5 sm:p-5">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f4f2ee] sm:h-36 sm:w-28"
      >
        <Image src={color.images[0]} alt={product.name} fill sizes="120px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/products/${product.slug}`} className="text-sm font-medium">
              {product.name}
            </Link>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-medium">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xs text-black/40 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
          <WishlistButton productId={product.id} className="static bg-transparent shadow-none" />
        </div>

        <RatingStars rating={product.rating} count={product.reviewCount} className="mt-1" />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {product.colors.map((c, i) => (
            <ColorSwatch
              key={c.name}
              hex={c.hex}
              name={c.name}
              selected={i === colorIndex}
              onClick={() => setColorIndex(i)}
            />
          ))}
          <span className="mx-1 h-4 w-px bg-black/10" />
          {product.sizes.map((size, i) => (
            <button
              key={size}
              type="button"
              onClick={() => setSizeIndex(i)}
              className={cn(
                "h-7 min-w-7 rounded-full border px-2 text-[11px] transition",
                i === sizeIndex
                  ? "border-accent bg-accent text-white"
                  : "border-black/15 text-black hover:border-black/40",
              )}
            >
              {size}
            </button>
          ))}
        </div>

        <a
          href={product.inStock ? whatsappLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!product.inStock}
          className={cn(
            "mt-4 flex items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-center text-xs font-medium tracking-wide text-white transition hover:bg-accent-dark",
            !product.inStock && "pointer-events-none cursor-not-allowed opacity-40",
          )}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
          </svg>
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
