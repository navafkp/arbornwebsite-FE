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
      {/* <span className="mt-3 text-sm tracking-wide text-black">{product.name}</span> */}
      {/* <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-sm font-medium">{formatPrice(discountPrice ?? price)}</span>
        {discountPrice && (
          <span className="text-xs text-black/40 line-through">{formatPrice(price)}</span>
        )}
      </div> */}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">
            {formatPrice(discountPrice ?? price)}
          </span>

          {discountPrice && (
            <span className="text-xs text-black/40 line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-gray-200 bg-red-500"></span>
          <span className="h-2 w-2 rounded-full border border-gray-200 bg-blue-500"></span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          Pattern
        </span>

        <div className="flex items-center">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 overflow-hidden border border-gray-200 ${i !== 0 ? "-ml-2" : ""
                }`}
            >
              <Image
                src={product.image_url ?? "/placeholder.png"}
                alt={`Pattern ${i + 1}`}
                width={10}
                height={10}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          ..

          {/* <div className="-ml-2 flex h-4 w-4 items-center justify-center border border-gray-200 bg-white text-[8px] text-gray-500">
            ..
          </div> */}
        </div>
      </div>


    </Link>
  );
}
