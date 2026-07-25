"use client";

import Image from "next/image";
import Link from "next/link";
import WishlistButton from "@/components/product/WishlistButton";
import { type ApiProduct } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";

// Small stacked-thumbnail preview of *other, related* products (siblings
// under the same parent group) — not this product's own color variants.
// That's why it's driven by related_product_images, separately from colors.
function RelatedProductPreviews({ images, compact = false }: { images: string[]; compact?: boolean }) {
  if (images.length === 0) return null;

  const visibleImages = images.slice(0, 3);
  const remainingCount = images.length - visibleImages.length;

  return (
    <>
      <span className="sr-only">{images.length} related {images.length === 1 ? "style" : "styles"}</span>

      <div
        aria-hidden="true"
        className={`absolute z-[1] flex flex-col ${compact
          ? "right-[5.1px] bottom-[5.1px] w-[23.8px] sm:right-[6.8px] sm:bottom-[6.8px] sm:w-[27.2px]"
          : "right-1.5 bottom-1.5 w-7 sm:right-2 sm:bottom-2 sm:w-8"
        }`}
      >
        {visibleImages.map((imageUrl, index) => (
          <span
            key={index}
            className={`relative block aspect-square w-full overflow-hidden bg-[#f4f2ee] shadow-[0_1px_3px_rgba(85,43,55,0.3)] ${compact ? "rounded-[6.8px]" : "rounded-lg"} ${index > 0 ? "-mt-[25%]" : ""}`}
            style={{ zIndex: index }}
          >
            <Image src={imageUrl} alt="" fill sizes={compact ? "24px" : "28px"} className="object-cover" />
          </span>
        ))}
        {remainingCount > 0 && (
          <span
            className={`relative -mt-[50%] flex aspect-square items-center justify-center bg-white font-semibold text-[#2a2022] shadow-[0_1px_3px_rgba(85,43,55,0.3)] ${compact ? "rounded-[6.8px] text-[6px] sm:text-[6.8px]" : "rounded-lg text-[7px] sm:text-[8px]"}`}
            style={{ zIndex: visibleImages.length }}
          >
            +{remainingCount}
          </span>
        )}
      </div>
    </>
  );
}

export default function ApiProductCard({
  product,
  showWishlist = true,
  compactPatternPreviews = false,
}: {
  product: ApiProduct;
  showWishlist?: boolean;
  compactPatternPreviews?: boolean;
}) {
  const price = Number(product.base_price);
  const discountPrice = product.base_discount_price ? Number(product.base_discount_price) : null;

  // Rendered straight from the listing response now — no extra per-card
  // detail fetch. colors and related_product_images are two independent
  // fields: colors are this product's own variants (for the footer dots);
  // related_product_images are sibling products' photos (for the stack).
  const colors = product.colors ?? [];
  const relatedImages = product.related_product_images ?? [];

  const footerColours = Array.from(new Map(colors.map((c) => [c.toLowerCase(), c])).values());
  // Keep the price legible on narrow cards: mobile shows two swatches, while
  // larger cards retain a third preview colour.
  const visibleFooterColours = footerColours.slice(0, 3);
  const remainingMobileFooterColours = footerColours.length - 2;
  const remainingDesktopFooterColours = footerColours.length - 3;

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[8px] border border-[#f2dfe2] bg-[#fffefd] shadow-[0_2px_9px_rgba(85,43,55,0.07)] transition-shadow duration-300 hover:shadow-[0_6px_16px_rgba(85,43,55,0.11)]">
      <Link
        href={`/products/detail?slug=${product.slug}`}
        aria-label={`View ${product.name}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f8f1ef]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 33vw, (max-width: 1023px) 25vw, 20vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[var(--muted)]">
              No image available
            </div>
          )}
          <RelatedProductPreviews images={relatedImages} compact={compactPatternPreviews} />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 pt-6 pb-1.5">
            <span className="block truncate text-[11px] font-medium leading-tight text-white sm:text-[13px]">
              {product.name}
            </span>
          </div>
        </div>

        <div className="grid min-h-6 grid-cols-[minmax(0,1fr)_auto] items-center gap-0.5 border-t border-[#f8ebed] bg-[#fffafa] px-1.5 py-0.5 sm:min-h-[27px] sm:gap-1 sm:px-2 sm:py-1">
          <div className="min-w-0">
            <span className="block whitespace-nowrap text-[11px] leading-3 font-semibold tracking-[-0.045em] text-[#1e1719] sm:text-[13.2px] sm:leading-4 sm:tracking-[-0.035em]">
              {formatPrice(discountPrice ?? price)}
            </span>
            {discountPrice && (
              <span className="block truncate text-[7px] leading-[10px] text-black/40 line-through sm:text-[9px]">
                {formatPrice(price)}
              </span>
            )}
          </div>
          {visibleFooterColours.length > 0 && (
            <div aria-hidden="true" className="flex shrink-0 items-center justify-end gap-[1px] whitespace-nowrap sm:gap-0.5">
              {visibleFooterColours.map((colour, index) => (
                <span
                  key={`${colour}-${index}`}
                  className={`h-[9px] w-[9px] shrink-0 rounded-full border border-white shadow-[0_1px_2px_rgba(85,43,55,0.16)] sm:h-[14px] sm:w-[14px] ${index === 2 ? "hidden sm:block" : ""}`}
                  style={{ backgroundColor: colour }}
                />
              ))}
              {remainingMobileFooterColours > 0 && (
                <span className="ml-px shrink-0 text-[6px] font-semibold leading-none text-[#2a2022] sm:hidden">+{remainingMobileFooterColours}</span>
              )}
              {remainingDesktopFooterColours > 0 && (
                <span className="ml-0.5 hidden shrink-0 text-[7px] leading-none font-semibold text-[#2a2022] sm:inline">+{remainingDesktopFooterColours}</span>
              )}
            </div>
          )}
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="flex gap-1 bg-[#fffafa] px-1.5 pb-1.5 sm:px-2">
            {product.sizes.slice(0, 3).map((size, i) => (
              <span
                key={size}
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-medium sm:h-5 sm:w-5 sm:text-[9px] ${
                  i === 0 ? "bg-accent-soft text-accent" : "bg-black/5 text-black/60"
                }`}
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="flex h-4 items-center justify-center rounded-full bg-black/5 px-1 text-[8px] font-medium text-black/60 sm:h-5 sm:text-[9px]">
                +{product.sizes.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>

      {showWishlist && (
        <WishlistButton
          productId={String(product.id)}
          className="absolute top-1.5 right-1.5 z-10 h-[24.624px] w-[24.624px] bg-white/95 shadow-[0_1px_5px_rgba(85,43,55,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 sm:top-2 sm:right-2 sm:h-[24.624px] sm:w-[24.624px]"
        />
      )}
    </article>
  );
}
