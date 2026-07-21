"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WishlistButton from "@/components/product/WishlistButton";
import { getProductDetail, type ApiProduct } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";

type VariantCue = {
  id: number;
  colour?: string;
  imageUrl?: string;
};

const variantCueCache = new Map<string, VariantCue[]>();
const variantCueRequests = new Map<string, Promise<VariantCue[]>>();

function isUsableColourCode(colourCode: string) {
  return /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(colourCode.trim());
}

function loadVariantCues(slug: string) {
  const cached = variantCueCache.get(slug);
  if (cached) return Promise.resolve(cached);

  const inFlight = variantCueRequests.get(slug);
  if (inFlight) return inFlight;

  const request = getProductDetail(slug)
    .then(({ variants }) => {
      const cues = variants
        .map((variant) => {
          const colour = variant.color_code.trim();
          const primaryImage = variant.images.find((image) => image.is_primary)
            ?? [...variant.images].sort((a, b) => a.display_order - b.display_order)[0];

          return {
            id: variant.id,
            colour: isUsableColourCode(colour) ? colour : undefined,
            imageUrl: primaryImage?.image_url || undefined,
          };
        })
        .filter((cue) => cue.colour || cue.imageUrl);
      variantCueCache.set(slug, cues);
      return cues;
    })
    .catch(() => []);

  variantCueRequests.set(slug, request);
  return request;
}

function VariantPatternPreviews({ cues, compact = false }: { cues: VariantCue[]; compact?: boolean }) {
  if (cues.length === 0) return null;

  const visibleCues = cues.slice(0, 3);
  const remainingCount = cues.length - visibleCues.length;

  return (
    <>
      <span className="sr-only">Available in {cues.length} {cues.length === 1 ? "variant" : "variants"}</span>

      <div
        aria-hidden="true"
        className={`absolute z-[1] flex flex-col ${compact
          ? "right-[5.1px] bottom-[5.1px] w-[23.8px] sm:right-[6.8px] sm:bottom-[6.8px] sm:w-[27.2px]"
          : "right-1.5 bottom-1.5 w-7 sm:right-2 sm:bottom-2 sm:w-8"
        }`}
      >
        {visibleCues.map((cue, index) => (
          <span
            key={cue.id}
            className={`relative block aspect-square w-full overflow-hidden shadow-[0_1px_3px_rgba(85,43,55,0.3)] ${compact ? "rounded-[6.8px]" : "rounded-lg"} ${index > 0 ? "-mt-[25%]" : ""}`}
            style={{ backgroundColor: cue.colour, zIndex: index }}
          >
            {cue.imageUrl && <Image src={cue.imageUrl} alt="" fill sizes={compact ? "24px" : "28px"} className="object-cover" />}
          </span>
        ))}
        {remainingCount > 0 && (
          <span
            className={`relative -mt-[50%] flex aspect-square items-center justify-center bg-white font-semibold text-[#2a2022] shadow-[0_1px_3px_rgba(85,43,55,0.3)] ${compact ? "rounded-[6.8px] text-[6px] sm:text-[6.8px]" : "rounded-lg text-[7px] sm:text-[8px]"}`}
            style={{ zIndex: visibleCues.length }}
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
  badgeLabel,
  showWishlist = true,
  compactPatternPreviews = false,
}: {
  product: ApiProduct;
  badgeLabel?: string;
  showWishlist?: boolean;
  compactPatternPreviews?: boolean;
}) {
  const price = Number(product.base_price);
  const discountPrice = product.base_discount_price ? Number(product.base_discount_price) : null;
  const label = badgeLabel ?? product.tag?.name;
  const cardRef = useRef<HTMLElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [variantCues, setVariantCues] = useState<VariantCue[]>(() => variantCueCache.get(product.slug) ?? []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || variantCueCache.has(product.slug)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [product.slug]);

  useEffect(() => {
    if (!isNearViewport) return;
    let active = true;
    loadVariantCues(product.slug).then((cues) => {
      if (active) setVariantCues(cues);
    });
    return () => {
      active = false;
    };
  }, [isNearViewport, product.slug]);

  const footerColours = Array.from(
    new Map(
      variantCues
        .filter((cue): cue is VariantCue & { colour: string } => Boolean(cue.colour))
        .map((cue) => [cue.colour.toLowerCase(), cue.colour]),
    ).values(),
  );
  // Keep the price legible on narrow cards: mobile shows two swatches, while
  // larger cards retain a third preview colour.
  const visibleFooterColours = footerColours.slice(0, 3);
  const remainingMobileFooterColours = footerColours.length - 2;
  const remainingDesktopFooterColours = footerColours.length - 3;

  return (
    <article ref={cardRef} className="group relative min-w-0 overflow-hidden rounded-[8px] border border-[#f2dfe2] bg-[#fffefd] shadow-[0_2px_9px_rgba(85,43,55,0.07)] transition-shadow duration-300 hover:shadow-[0_6px_16px_rgba(85,43,55,0.11)]">
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
          {label && (
            <span className="absolute top-1.5 left-1.5 hidden max-w-[calc(100%-3.75rem)] truncate rounded-full bg-white/92 px-1.5 py-0.5 text-[8px] font-medium tracking-wide text-black/75 shadow-sm sm:block">
              {label}
            </span>
          )}
          <VariantPatternPreviews cues={variantCues} compact={compactPatternPreviews} />

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
      </Link>

      {showWishlist && (
        <WishlistButton
          productId={String(product.id)}
          className="absolute top-1.5 right-1.5 z-10 h-8 w-8 bg-white/95 shadow-[0_1px_5px_rgba(85,43,55,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 sm:top-2 sm:right-2 sm:h-8 sm:w-8"
        />
      )}
    </article>
  );
}
