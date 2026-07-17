"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProductDetail, type ApiProductDetail as ApiProductDetailData } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import ColorSwatch from "@/components/ui/ColorSwatch";
import RatingStars from "@/components/ui/RatingStars";
import ApiProductCard from "@/components/products/ApiProductCard";

function humanize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ApiProductDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<ApiProductDetailData | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error" | "not-found">(
    "loading",
  );
  const [variantIndex, setVariantIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSizeCode, setSelectedSizeCode] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoadState("not-found");
      return;
    }
    setLoadState("loading");
    getProductDetail(slug)
      .then((data) => {
        setProduct(data);
        setVariantIndex(0);
        setMainImageIndex(0);
        setSelectedSizeCode(data.variants[0]?.sizes[0]?.size_code ?? null);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [slug]);

  function selectVariant(index: number) {
    setVariantIndex(index);
    setMainImageIndex(0);
    setSelectedSizeCode(product?.variants[index]?.sizes[0]?.size_code ?? null);
  }

  const variant = product?.variants[variantIndex];

  const images = useMemo(() => {
    if (!variant) return [];
    return [...variant.images].sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return a.display_order - b.display_order;
    });
  }, [variant]);

  const mainImage = images[mainImageIndex] ?? images[0];

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

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f4f2ee]">
              {mainImage ? (
                <Image
                  src={mainImage.image_url}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[var(--muted)]">
                  No image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setMainImageIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === mainImageIndex}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-offset-2 transition ${
                      i === mainImageIndex ? "ring-accent" : "ring-black/10 hover:ring-black/30"
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

            {product.review_summary.review_count > 0 && (
              <RatingStars
                rating={product.review_summary.average_rating}
                count={product.review_summary.review_count}
              />
            )}

            {product.short_description && (
              <p className="text-sm text-[var(--muted)]">{product.short_description}</p>
            )}

            {product.variants.length > 0 && (
              <div>
                <span className="text-xs tracking-wide text-[var(--muted)] uppercase">
                  Color: <span className="normal-case text-black">{variant?.color}</span>
                </span>
                <div className="mt-2 flex items-center gap-2">
                  {product.variants.map((v, i) => (
                    <ColorSwatch
                      key={v.id}
                      hex={v.color_code}
                      name={v.color}
                      size="md"
                      selected={i === variantIndex}
                      onClick={() => selectVariant(i)}
                    />
                  ))}
                </div>
              </div>
            )}

            {variant && variant.sizes.length > 0 && (
              <div>
                <span className="text-xs tracking-wide text-[var(--muted)] uppercase">Size</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variant.sizes.map((s) => (
                    <button
                      key={s.size_code}
                      type="button"
                      onClick={() => setSelectedSizeCode(s.size_code)}
                      title={s.measurement}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                        selectedSizeCode === s.size_code
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
              <p className="text-xs text-[var(--muted)]">
                {variant.stock_quantity > 0 ? "In stock" : "Out of stock"}
              </p>
            )}

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
          <h2 className="font-serif text-2xl">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {product.related_products.map((p) => (
              <ApiProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
