import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import WishlistButton from "@/components/product/WishlistButton";
import type { ApiProduct } from "@/lib/api-client";

export default function ProductOverlayCard({ product }: { product: ApiProduct }) {
  const price = Number(product.base_price);
  const discountPrice = product.base_discount_price ? Number(product.base_discount_price) : null;

  return (
    <Link href={`/products/detail?slug=${product.slug}`} className="group block w-36 shrink-0 sm:w-44">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#f4f2ee]">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="176px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}
        <WishlistButton productId={String(product.id)} className="absolute top-2 right-2" />
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-[13.2px] font-semibold text-white">
          {formatPrice(discountPrice ?? price)}
        </span>
      </div>

      <div className="mt-2 flex items-start justify-between gap-2">
        <span className="line-clamp-2 text-sm font-medium text-[#241a1d]">{product.name}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition group-hover:bg-accent-dark">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8h12l-1 12a1.5 1.5 0 01-1.5 1.4h-7A1.5 1.5 0 017 20L6 8z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
