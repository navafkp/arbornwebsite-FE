"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import RatingStars from "@/components/ui/RatingStars";
import ColorSwatch from "@/components/ui/ColorSwatch";
import WishlistButton from "@/components/product/WishlistButton";
import ImageGallery from "@/components/product/ImageGallery";
import AccordionItem from "@/components/product/AccordionItem";
import SizeGuideTable from "@/components/product/SizeGuideTable";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const color = product.colors[colorIndex];

  const whatsappLink = buildWhatsAppLink(
    `Hi, I'd like to order the "${product.name}" — ${color.name}, size ${product.sizes[sizeIndex]} (${formatPrice(product.price)}). Please share availability and payment details.`,
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <ImageGallery images={color.images} alt={`${product.name} — ${color.name}`} />

      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-serif text-3xl">{product.name}</h1>
          <WishlistButton productId={product.id} size="md" className="static bg-transparent shadow-none" />
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">{product.shortDescription}</p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-xl font-medium">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-black/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <RatingStars rating={product.rating} count={product.reviewCount} size="md" className="mt-3" />

        <div className="mt-6">
          <p className="mb-2.5 text-xs font-medium tracking-widest text-black uppercase">
            Color — <span className="font-normal text-[var(--muted)] normal-case">{color.name}</span>
          </p>
          <div className="flex gap-2.5">
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

        <div className="mt-6">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-xs font-medium tracking-widest text-black uppercase">
              Size — {product.sizes[sizeIndex]}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, i) => (
              <button
                key={size}
                type="button"
                onClick={() => setSizeIndex(i)}
                aria-pressed={i === sizeIndex}
                className={cn(
                  "h-10 min-w-10 rounded-full border px-3.5 text-xs transition",
                  i === sizeIndex
                    ? "border-accent bg-accent text-white"
                    : "border-black/15 text-black hover:border-black/40",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--muted)]">
          Fabric: <span className="text-black">{product.fabric}</span> ·{" "}
          {product.inStock ? "In Stock" : "Out of Stock"}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={product.inStock ? whatsappLink : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!product.inStock}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-center text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark",
              !product.inStock && "pointer-events-none cursor-not-allowed opacity-40",
            )}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
        <p className="mt-3 text-center text-[11px] text-[var(--muted)] sm:text-left">
          Chat with us to confirm size, color and delivery.
        </p>

        <div className="mt-10">
          <AccordionItem title="Description" defaultOpen>
            <p>{product.description}</p>
          </AccordionItem>
          <AccordionItem title="Size Guide">
            <SizeGuideTable sizes={product.sizes} />
          </AccordionItem>
          <AccordionItem title="Care Instructions">
            <ul className="list-disc space-y-1.5 pl-4">
              {product.careInstructions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </AccordionItem>
          <AccordionItem title="Shipping Information">
            <p>{product.shippingInfo}</p>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}
