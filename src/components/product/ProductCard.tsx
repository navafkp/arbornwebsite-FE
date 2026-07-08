"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import RatingStars from "@/components/ui/RatingStars";
import ColorSwatch from "@/components/ui/ColorSwatch";
import Badge from "@/components/ui/Badge";
import WishlistButton from "@/components/product/WishlistButton";

interface ProductCardProps {
  product: Product;
  detailed?: boolean;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, detailed, onQuickView }: ProductCardProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

  const activeColor = product.colors[colorIndex];
  const images = activeColor.images;

  const primaryTag = useMemo(() => product.tags[0], [product.tags]);

  function handleMobileScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setMobileImageIndex(index);
  }

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f2ee]">
        {primaryTag && (
          <Badge tag={primaryTag} className="absolute top-3 left-3 z-10" />
        )}

        <WishlistButton productId={product.id} className="absolute top-3 right-3 z-10" />

        <Link href={`/products/${product.slug}`} className="absolute inset-0 hidden sm:block">
          <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="relative h-full w-full"
          >
            <Image
              src={images[0]}
              alt={`${product.name} in ${activeColor.name}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={cn(
                "object-cover transition-opacity duration-500",
                hovering && images[1] ? "opacity-0" : "opacity-100",
              )}
              priority={false}
            />
            {images[1] && (
              <Image
                src={images[1]}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className={cn(
                  "object-cover transition-opacity duration-500",
                  hovering ? "opacity-100" : "opacity-0",
                )}
              />
            )}
          </div>
        </Link>

        <Link href={`/products/${product.slug}`} className="absolute inset-0 block sm:hidden">
          <div
            onScroll={handleMobileScroll}
            className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
          >
            {images.map((src, i) => (
              <div key={i} className="relative h-full w-full flex-shrink-0 snap-start">
                <Image
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 sm:hidden">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full transition-all",
                  i === mobileImageIndex ? "w-3 bg-black" : "bg-black/25",
                )}
              />
            ))}
          </div>
        </Link>

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute right-3 bottom-3 left-3 z-10 translate-y-2 rounded-full bg-white/95 py-2.5 text-xs font-medium tracking-wide text-black opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:right-3 sm:bottom-3 sm:left-3"
          >
            Quick View
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <Link href={`/products/${product.slug}`} className="text-[13.5px] text-black">
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-black/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <RatingStars rating={product.rating} count={product.reviewCount} />

        <div className="mt-1 flex items-center gap-1.5">
          {product.colors.map((color, i) => (
            <ColorSwatch
              key={color.name}
              hex={color.hex}
              name={color.name}
              selected={i === colorIndex}
              onClick={() => setColorIndex(i)}
            />
          ))}
        </div>

        {detailed && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted)]">
            <span className="rounded-full border border-black/10 px-2 py-0.5">
              {product.fabric}
            </span>
            <span>{product.sizes.join(" / ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
