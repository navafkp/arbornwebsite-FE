"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getProductDetail,
  type ApiProductDetail as ApiProductDetailData,
  type ApiReview,
  type ApiProductVariant,
} from "@/lib/api-client";
import { cn, formatPrice } from "@/lib/utils";
import { getPreferredSizes } from "@/lib/preferred-size";
import { buildOrderInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import ColorSwatch from "@/components/ui/ColorSwatch";
import RatingStars from "@/components/ui/RatingStars";
import ProductOverlayCard from "@/components/products/ProductOverlayCard";
import { useAuth } from "@/lib/auth-context";
import InstagramReelCard from "@/components/products/InstagramReelCard";
import { HeartIcon } from "@/components/ui/decor";
import BustSizeBanner from "@/components/home/BustSizeBanner";
import FeatureStrip from "@/components/home/FeatureStrip";

// Approximates the "torn paper" edge at the bottom of the main product
// image: a zigzag clip-path so it isn't a plain straight-edged rectangle.
function tornEdgeClipPath(teeth = 16, dip = 3) {
  const points = ["0% 0%", "100% 0%", "100% 100%"];
  for (let i = teeth; i >= 0; i--) {
    const x = (i / teeth) * 100;
    const y = i % 2 === 0 ? 100 : 100 - dip;
    points.push(`${x}% ${y}%`);
  }
  points.push("0% 100%");
  return `polygon(${points.join(", ")})`;
}

const TORN_EDGE = tornEdgeClipPath();

const TRUST_ITEMS = [
  {
    label: "Soft & Breathable",
    icon: (
      <path
        d="M4 12c2-4 6-6 8-6s6 2 8 6c-2 4-6 6-8 6s-6-2-8-6z M12 9v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Premium Fabric",
    icon: (
      <>
        <path d="M6 10a4 4 0 018 0 3.5 3.5 0 013.5 3.5H6.5A3.5 3.5 0 016 10z" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "Loved by Thousands",
    icon: (
      <path
        d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z"
        strokeLinejoin="round"
      />
    ),
  },
];

function squigglePath() {
  return "M0 5 Q 12 0, 25 5 T 50 5 T 75 5 T 100 5";
}

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Temporary local fallback while product reviews are not available from the API.
// These are intentionally only used for products with no backend reviews.
const SAMPLE_REVIEWS: ApiReview[] = [
  {
    id: -1,
    user_name: "Maya R.",
    rating: 5,
    title: "Soft enough for slow mornings",
    review: "The fabric feels lovely against the skin and the fit is easy without looking oversized. My new weekend favourite.",
  },
  {
    id: -2,
    user_name: "Anika S.",
    rating: 4,
    title: "Pretty, comfortable and light",
    review: "The print is even sweeter in person. It is breathable for sleeping and still polished enough for a lazy breakfast at home.",
  },
];

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
  const { isLoggedIn } = useAuth();

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
  const displayedReviews = product.reviews.length > 0 ? product.reviews : SAMPLE_REVIEWS;
  // TEMP: preview fallback until the backend sends instagram_reel_url — remove this fallback once it does.
  const instagramReelUrl = product.instagram_reel_url ?? "https://www.instagram.com/reel/Da-dYBpIcb2/?igsh=bWdvZzIzdmppNTF1";
  const instagramThumbnailUrl = product.instagram_thumbnail_url;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-1.5 pb-10 sm:px-6 lg:px-8">
        <BustSizeBanner large />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <div className="relative">
              {product.tags.length > 0 && (
                <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-[#b4425f] shadow-sm">
                  {humanize(product.tags[0])}
                  <HeartIcon filled className="h-3 w-3" />
                </span>
              )}
              {allImages.length > 0 ? (
              <div
                ref={galleryRef}
                onScroll={handleGalleryScroll}
                className="no-scrollbar relative flex aspect-[3/4] w-full snap-x snap-mandatory gap-0 overflow-x-auto bg-[#f4f2ee]"
                style={{ clipPath: TORN_EDGE }}
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
                {instagramReelUrl && (
                  <div className="relative h-full w-full flex-shrink-0 snap-start">
                    <InstagramReelCard url={instagramReelUrl} thumbnailUrl={instagramThumbnailUrl} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-[#f4f2ee] text-sm text-[var(--muted)]">
                No image
              </div>
            )}
            </div>

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

            {instagramReelUrl && (
              <a
                href={instagramReelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 flex items-center gap-3.5 rounded-3xl border border-[#f3d9e2] bg-gradient-to-br from-[#fff5f8] to-[#fdf1e9] px-3.5 py-3 shadow-[0_8px_20px_rgba(91,53,61,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(91,53,61,0.12)]"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-inner">
                  {instagramThumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={instagramThumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow transition group-hover:scale-105">
                      <svg className="ml-0.5 h-3.5 w-3.5 text-[#241a1d]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 font-serif text-base leading-tight text-[#241a1d]">
                    Watch this style on Instagram
                    <HeartIcon filled className="h-3.5 w-3.5 shrink-0 text-accent" />
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">Tap to view the reel</span>
                </span>
                <svg className="h-4 w-4 shrink-0 text-accent transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
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
                className="text-xs font-semibold tracking-widest text-accent uppercase"
              >
                {product.category.name}
              </Link>
              <h1 className="mt-1 flex items-center gap-2 font-serif text-3xl">
                {product.name}
                <HeartIcon filled className="h-6 w-6 shrink-0 text-accent" />
              </h1>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[26.4px] font-semibold">{formatPrice(discountPrice ?? price)}</span>
              {discountPrice && (
                <span className="text-sm text-black/40 line-through">{formatPrice(price)}</span>
              )}
            </div>

            {product.short_description && (
              <p className="relative inline-flex w-fit items-center gap-1.5 text-sm text-[#b4425f]">
                <span className="relative z-0">
                  <span className="absolute inset-x-0 bottom-0.5 -z-10 h-2.5 bg-accent-soft" />
                  {product.short_description}
                </span>
                <HeartIcon filled className="h-3.5 w-3.5 shrink-0 text-accent" />
              </p>
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

            <FeatureStrip />

            {variant && variant.sizes.length > 0 && !sizeMatchExists && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-wide text-[var(--muted)] uppercase">Size</span>
                  <Link href="/select-size" className="flex items-center gap-1 text-xs text-[var(--muted)]">
                    Size Guide
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="m5 19 14-14 2 2L7 21H5v-2Z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="m12 12 2 2m-5 1 2 2m4-8 2 2" strokeLinecap="round" />
                    </svg>
                  </Link>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variant.sizes.map((s) => (
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
                  ))}
                </div>
              </div>
            )}

            {variant && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <span className={cn("h-1.5 w-1.5 rounded-full", inStock ? "bg-green-500" : "bg-black/30")} />
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
                  "flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-4 text-center text-sm font-semibold tracking-widest text-white uppercase transition hover:bg-accent-dark",
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

            <div className="grid grid-cols-3 gap-2 border-t border-black/5 pt-4">
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-6 w-6 text-accent">
                    {item.icon}
                  </svg>
                  <span className="text-[10px] leading-tight text-[var(--muted)]">{item.label}</span>
                </div>
              ))}
            </div>

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
      </div>

      {product.related_products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="relative flex items-center gap-1.5 font-serif text-2xl">
              <span className="relative">
                More Patterns Like This
                <svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-2 w-full text-accent">
                  <path d={squigglePath()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <HeartIcon filled className="h-4 w-4 text-accent" />
            </h2>
            <Link href="/products" className="flex items-center gap-1 text-xs font-medium text-accent">
              View all
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-1">
            {product.related_products.map((p) => (
              <ProductOverlayCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {product.recommended_products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="relative flex items-center gap-1.5 font-serif text-2xl">
              <span className="relative">
                Recommended for You
                <svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-2 w-full text-accent">
                  <path d={squigglePath()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <HeartIcon filled className="h-4 w-4 text-accent" />
            </h2>
            <Link href="/products" className="flex items-center gap-1 text-xs font-medium text-accent">
              View all
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-1">
            {product.recommended_products.map((p) => (
              <ProductOverlayCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h2 className="relative flex w-fit items-center gap-1.5 font-serif text-2xl">
            <span className="relative">
              Review
              <svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-2 w-full text-accent">
                <path d={squigglePath()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <button
            type="button"
            aria-label="Add your review"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#f3c8d5] bg-[#fff1f5] px-3 py-1.5 text-xs font-medium text-[#b94f71] transition-colors hover:border-[#e9a8bd] hover:bg-[#ffe7ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d95f88]"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none">
              <path
                d="M9.9 2.1 13.9 6l-7 7-4.1.7.8-4.1 7-7Z"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinejoin="round"
              />
              <path d="m8.5 3.5 4 3.9" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
            </svg>
            Add your review
          </button>
        </div>

        {/* {!isLoggedIn && (
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-flex rounded-full bg-accent px-5 py-3 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
            >
              Login to review
            </Link>
          </div>
        )} */}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {displayedReviews.map((review, i) => {
            const reviewerName = review.user_name?.trim() || "Arborn customer";
            const initials = reviewerName
              .split(/\s+/)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <article
                key={review.id ?? i}
                className="relative overflow-hidden rounded-[1.4rem] border border-[#f0e3e6] bg-[#fffdfb] p-5 shadow-[0_10px_26px_rgba(84,48,57,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-xs font-semibold tracking-wide text-[#b4425f]">
                    {initials}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-black">{reviewerName}</p>
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-[#b4425f]">
                        Verified Buyer
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <RatingStars rating={review.rating} />
                  {review.title && (
                    <h3 className="mt-3 flex items-center gap-1.5 font-serif text-lg leading-snug text-black">
                      <span className="line-clamp-2">{review.title}</span>
                      <HeartIcon filled className="h-3.5 w-3.5 shrink-0 text-accent" />
                    </h3>
                  )}
                  {review.review && (
                    <p className="mt-2 line-clamp-4 max-w-prose text-sm leading-6 text-[var(--muted)]">{review.review}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
