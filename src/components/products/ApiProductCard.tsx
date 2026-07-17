import Image from "next/image";
import Link from "next/link";
import type { ApiProduct } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";

export default function ApiProductCard({
  product,
  badgeLabel,
}: {
  product: ApiProduct;
  badgeLabel?: string;
}) {
  const price = Number(product.base_price);
  const discountPrice = product.base_discount_price ? Number(product.base_discount_price) : null;
  const label = badgeLabel ?? product.tag?.name;

  return (
    <Link href={`/products/detail?slug=${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f4f2ee]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--muted)]">
            No image
          </div>
        )}
        {label && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium tracking-wide text-black">
            {label}
          </span>
        )}
      </div>
      <span className="mt-3 text-sm tracking-wide text-black">{product.name}</span>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-sm font-medium">{formatPrice(discountPrice ?? price)}</span>
        {discountPrice && (
          <span className="text-xs text-black/40 line-through">{formatPrice(price)}</span>
        )}
      </div>
    </Link>
  );
}
