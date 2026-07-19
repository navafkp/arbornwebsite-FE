"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getProductDetail,
  getSizes,
  type ApiProductDetail as ApiProductDetailData,
  type ApiProductVariant,
} from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import { getPreferredSizes, clearPreferredSize } from "@/lib/preferred-size";
import { buildOrderInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import ColorSwatch from "@/components/ui/ColorSwatch";
import RatingStars from "@/components/ui/RatingStars";
import ApiProductCard from "@/components/products/ApiProductCard";
import BackButton from "@/components/ui/BackButton";

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Which color variants to show: only the ones that offer the user's saved
// size, so a product with e.g. an XL-only red and an L-available blue only
// shows blue. Falls back to every variant if none of them have that size
// (or no size is saved) — hiding everything would leave nothing to buy.
function getVisibleVariantIndices(variants: ApiProductVariant[], preferredSizeCodes: number[]) {
  const all = variants.map((_, i) => i);
  if (preferredSizeCodes.length === 0) return all;
  const matching = all.filter((i) => variants[i].sizes.some((s) => preferredSizeCodes.includes(s.size_code)));
  return matching.length > 0 ? matching : all;
}

export default function ApiProductDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<ApiProductDetailData | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error" | "not-found">(
    "loading",
  );
  const [mainImageIndex, setMainImageIndex] = useState(0);
  // Set only when a color has no images of its own, so there's nothing to
  // scroll the shared gallery to — the gallery keeps showing whatever was
  // last visible, and this fills in for price/size purposes instead.
  const [manualVariantIndex, setManualVariantIndex] = useState<number | null>(null);
  const [selectedSizeCode, setSelectedSizeCode] = useState<number | null>(null);
  const [preferredSizeCodes, setPreferredSizeCodes] = useState<number[]>([]);
  const [preferredSizeNames, setPreferredSizeNames] = useState<string[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) {
      setLoadState("not-found");
      return;
    }
    setLoadState("loading");
    const preferredCodes = getPreferredSizes();
    getProductDetail(slug, preferredCodes)
      .then((data) => {
        const visibleIndices = getVisibleVariantIndices(data.variants, preferredCodes);
        const initialVariant = data.variants[visibleIndices[0] ?? 0];
        const initialSize =
          preferredCodes.length > 0 && initialVariant?.sizes.some((s) => preferredCodes.includes(s.size_code))
            ? initialVariant.sizes.find(s => preferredCodes.includes(s.size_code))?.size_code ?? null
            : (initialVariant?.sizes[0]?.size_code ?? null);

        setProduct(data);
        setPreferredSizeCodes(preferredCodes);
        setManualVariantIndex(null);
        // The first visible variant's images always start at position 0 in
        // the (filtered) gallery, since it's built by iterating visible
        // variants in order.
        setMainImageIndex(0);
        setSelectedSizeCode(initialSize);
        setLoadState("ready");
        galleryRef.current?.scrollTo({ left: 0 });
      })
      .catch(() => setLoadState("error"));
  }, [slug]);

  useEffect(() => {
    if (preferredSizeCodes.length === 0) {
      setPreferredSizeNames([]);
      return;
    }
    getSizes()
      .then((sizes) => {
        const names = preferredSizeCodes.map(
          (code) => sizes.find((s) => s.size_code === code)?.display_text ?? String(code)
        );
        setPreferredSizeNames(names);
      })
      .catch(() => setPreferredSizeNames([]));
  }, [preferredSizeCodes]);


  function scrollToImage(index: number) {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  function handleGalleryScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setMainImageIndex((current) => (current === index ? current : index));
  }

  const visibleVariantIndices = useMemo(() => {
    if (!product) return [];
    return getVisibleVariantIndices(product.variants, preferredSizeCodes);
  }, [product, preferredSizeCodes]);

  // Only the visible variants' images, combined into one scrollable gallery
  // instead of swapping the whole gallery out per color — grouped by
  // variant (in visible order), primary image first within each group.
  const allImages = useMemo(() => {
    if (!product) return [];
    return visibleVariantIndices.flatMap((variantIndex) =>
      [...product.variants[variantIndex].images]
        .sort((a, b) => {
          if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
          return a.display_order - b.display_order;
        })
        .map((img) => ({ ...img, variantIndex })),
    );
  }, [product, visibleVariantIndices]);

  const activeVariantIndex =
    allImages[mainImageIndex]?.variantIndex ?? manualVariantIndex ?? visibleVariantIndices[0] ?? 0;
  const variant = product?.variants[activeVariantIndex];

  // Reset size/price selection whenever scrolling the gallery (or picking an
  // imageless color) lands on a different variant — locking back to the
  // saved size if this variant offers it, else falling back to its first.
  useEffect(() => {
    const v = product?.variants[activeVariantIndex];
    if (!v) return;
    const matchedSize = v.sizes.find(s => preferredSizeCodes.includes(s.size_code));
    setSelectedSizeCode(matchedSize ? matchedSize.size_code : (v.sizes[0]?.size_code ?? null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVariantIndex, preferredSizeCodes]);

  function selectVariant(index: number) {
    const firstImage = allImages.findIndex((img) => img.variantIndex === index);
    if (firstImage >= 0) {
      setMainImageIndex(firstImage);
      setManualVariantIndex(null);
      scrollToImage(firstImage);
    } else {
      setManualVariantIndex(index);
    }
  }

  if (loadState === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-black/5" />
          <div className="flex flex-col gap-3">
            <div className="h-6 w-2/3 animate-pulse rounded bg-black/5" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-black/5" />
          </div>
        </div>
      </div>
    );
  }

  if (loadState === "not-found" || loadState === "error" || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <p className="rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          {loadState === "not-found"
            ? "No product specified."
            : "Couldn't load this product. Please check your connection and try again."}
        </p>
      </div>
    );
  }

  const price = Number(variant?.price ?? product.base_price);
  const discountPrice = variant?.discount_price
    ? Number(variant.discount_price)
    : product.base_discount_price
      ? Number(product.base_discount_price)
      : null;

  const selectedSize = variant?.sizes.find((s) => s.size_code === selectedSizeCode);
  const inStock = (variant?.stock_quantity ?? 0) > 0;
  const whatsappLink = buildWhatsAppLink(
    buildOrderInquiryMessage({
      productName: product.name,
      color: variant?.color ?? "—",
      size: selectedSize?.display_text ?? "—",
      price: formatPrice(discountPrice ?? price),
    }),
  );

  const sizeMatchExists =
    preferredSizeCodes.length > 0 &&
    product.variants.some((v) => v.sizes.some((s) => preferredSizeCodes.includes(s.size_code)));

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton className="mb-4" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            {allImages.length > 0 ? (
              <div
                ref={galleryRef}
                onScroll={handleGalleryScroll}
                className="no-scrollbar relative flex aspect-[3/4] w-full snap-x snap-mandatory gap-0 overflow-x-auto rounded-xl bg-[#f4f2ee]"
              >
                {allImages.map((img, i) => (
                  <div key={img.id} className="relative h-full w-full flex-shrink-0 snap-start">
                    <Image
                      src={img.image_url}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-[#f4f2ee] text-sm text-[var(--muted)]">
                No image
              </div>
            )}

            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      setMainImageIndex(i);
                      setManualVariantIndex(null);
                      scrollToImage(i);
                    }}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === mainImageIndex}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-offset-2 transition ${i === mainImageIndex ? "ring-accent" : "ring-black/10 hover:ring-black/30"
                      }`}
                  >
                    <Image src={img.image_url} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              {/* TODO: re-enable when reviews are live
              <RatingStars
                rating={product.review_summary.average_rating}
                count={product.review_summary.review_count}
                className="mb-2"
              />
              */}
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs tracking-widest text-[var(--muted)] uppercase"
              >
                {product.category.name}
              </Link>
              <h1 className="mt-1 font-serif text-3xl">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-lg font-medium">{formatPrice(discountPrice ?? price)}</span>
              {discountPrice && (
                <span className="text-sm text-black/40 line-through">{formatPrice(price)}</span>
              )}
            </div>

            {preferredSizeCodes.length > 0 ? (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-accent-soft px-3 py-3 text-xs sm:px-4 sm:text-sm">
                <span className="truncate">
                  {sizeMatchExists ? (
                    <>
                      Showing your size{preferredSizeNames.length > 1 ? "s" : ""}: <strong>{preferredSizeNames.length > 0 ? preferredSizeNames.join(", ") : "..."}</strong>
                    </>
                  ) : (
                    <>
                      Not available in size{preferredSizeNames.length > 1 ? "s" : ""} <strong>{preferredSizeNames.length > 0 ? preferredSizeNames.join(", ") : "..."}</strong> —
                      showing all sizes
                    </>
                  )}
                </span>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <Link
                    href="/select-size"
                    className="text-xs font-medium text-accent-dark underline underline-offset-2"
                  >
                    Change
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-dashed border-accent/40 px-4 py-3 text-sm">
                <span>Choose your size for a better fit.</span>
                <Link
                  href="/select-size"
                  className="text-xs font-medium text-accent-dark underline underline-offset-2"
                >
                  Choose size
                </Link>
              </div>
            )}

            {product.short_description && (
              <p className="text-sm text-[var(--muted)]">{product.short_description}</p>
            )}

            {visibleVariantIndices.length > 1 && (
              <div>
                <span className="text-xs tracking-wide text-[var(--muted)] uppercase">
                  Color: <span className="normal-case text-black">{variant?.color}</span>
                </span>
                <div className="mt-2 flex items-center gap-2">
                  {visibleVariantIndices.map((i) => {
                    const v = product.variants[i];
                    return (
                      <ColorSwatch
                        key={v.id}
                        hex={v.color_code}
                        name={v.color}
                        size="md"
                        selected={i === activeVariantIndex}
                        onClick={() => selectVariant(i)}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {variant && variant.sizes.length > 0 && (
              <div>
                <span className="text-xs tracking-wide text-[var(--muted)] uppercase">Size</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(sizeMatchExists
                    ? variant.sizes.filter((s) => preferredSizeCodes.includes(s.size_code))
                    : variant.sizes
                  ).map((s) =>
                    sizeMatchExists ? (
                      <span
                        key={s.size_code}
                        title={s.measurement}
                        className="rounded-full border border-accent bg-accent-soft px-4 py-2 text-xs font-medium"
                      >
                        {s.display_text}
                      </span>
                    ) : (
                      <button
                        key={s.size_code}
                        type="button"
                        onClick={() => setSelectedSizeCode(s.size_code)}
                        title={s.measurement}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${selectedSizeCode === s.size_code
                          ? "border-accent bg-accent-soft"
                          : "border-black/15 hover:border-black/30"
                          }`}
                      >
                        {s.display_text}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {variant && (
              <p className="text-xs text-[var(--muted)]">
                {inStock ? "In stock" : "Out of stock"}
              </p>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <a
                href={inStock ? whatsappLink : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!inStock}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-center text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark",
                  !inStock && "pointer-events-none cursor-not-allowed opacity-40",
                )}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.2-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
                </svg>
                Order from WhatsApp
              </a>
            </div>
            <p className="text-center text-[11px] text-[var(--muted)] sm:text-left">
              Chat with us to confirm size, color and delivery.
            </p>

            {product.description && (
              <p className="text-sm whitespace-pre-line">{product.description}</p>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tagSlug) => (
                  <Link
                    key={tagSlug}
                    href={`/products?tag=${tagSlug}`}
                    className="rounded-full border border-black/10 px-2.5 py-1 text-[11px] text-[var(--muted)]"
                  >
                    {humanize(tagSlug)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {product.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl">Reviews</h2>
            <div className="mt-4 flex flex-col gap-4">
              {product.reviews.map((review, i) => (
                <div key={review.id ?? i} className="rounded-xl border border-black/10 p-4">
                  <RatingStars rating={review.rating} />
                  {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
                  {review.review && (
                    <p className="mt-1 text-sm text-[var(--muted)]">{review.review}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {product.related_products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl">More Patterns Like This</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {product.related_products.map((p) => (
              <ApiProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {product.recommended_products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl">Recommended for You</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {product.recommended_products.map((p) => (
              <ApiProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
