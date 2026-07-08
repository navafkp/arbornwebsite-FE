"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import RatingStars from "@/components/ui/RatingStars";
import ColorSwatch from "@/components/ui/ColorSwatch";
import WishlistButton from "@/components/product/WishlistButton";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <QuickViewContent key={product.slug} product={product} onClose={onClose} />
    </div>
  );
}

function QuickViewContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const color = product.colors[colorIndex];

  const whatsappLink = buildWhatsAppLink(
    `Hi, I'd like to order the "${product.name}" — ${color.name}, size ${product.sizes[sizeIndex]} (${formatPrice(product.price)}). Please share availability and payment details.`,
  );

  return (
    <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-2xl bg-white sm:flex-row sm:rounded-2xl">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-1.5 text-black shadow-sm"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="relative h-72 w-full shrink-0 bg-[#f4f2ee] sm:h-auto sm:w-1/2">
        <Image
          src={color.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl">{product.name}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{product.shortDescription}</p>
          </div>
          <WishlistButton productId={product.id} />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-medium">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-black/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <RatingStars rating={product.rating} count={product.reviewCount} size="md" />

        <div>
          <p className="mb-2 text-xs tracking-wide text-[var(--muted)] uppercase">
            Color — {color.name}
          </p>
          <div className="flex gap-2">
            {product.colors.map((c, i) => (
              <ColorSwatch
                key={c.name}
                hex={c.hex}
                name={c.name}
                size="md"
                selected={i === colorIndex}
                onClick={() => setColorIndex(i)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs tracking-wide text-[var(--muted)] uppercase">
            Size — {product.sizes[sizeIndex]}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, i) => (
              <button
                key={size}
                type="button"
                onClick={() => setSizeIndex(i)}
                className={`h-9 min-w-9 rounded-full border px-3 text-xs transition ${
                  i === sizeIndex
                    ? "border-accent bg-accent text-white"
                    : "border-black/15 text-black hover:border-black/40"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <a
            href={product.inStock ? whatsappLink : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!product.inStock}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3 text-center text-xs font-medium tracking-wide text-white transition hover:bg-accent-dark ${
              !product.inStock ? "pointer-events-none cursor-not-allowed opacity-40" : ""
            }`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
            </svg>
            WhatsApp
          </a>
          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="flex-1 rounded-full border border-black/15 py-3 text-center text-xs font-medium tracking-wide text-black transition hover:border-black"
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
}
