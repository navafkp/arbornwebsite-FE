"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import ContactForm from "@/components/contact/ContactForm";
import BackButton from "@/components/ui/BackButton";

// Static-export (GitHub Pages) version of the /contact page logic. There's no
// server at request time to read the URL's query string, so this reads it in
// the browser instead via useSearchParams. See src/app/contact/page.tsx for
// the server-rendered equivalent used with a Node server (AWS).
export default function ContactPageBridge() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");
  const size = searchParams.get("size");
  const product = productSlug ? getProductBySlug(productSlug) : undefined;

  const defaultMessage = product
    ? `Hi, I'd like to order the "${product.name}"${size ? ` in size ${size}` : ""}. Please share availability and payment details.`
    : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <BackButton className="mb-4" />
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
          Found something you love? Send us a message with your details and we&rsquo;ll help you
          place your order.
        </p>
      </div>

      {product && (
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-black/[0.06] p-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f4f2ee]">
            <Image
              src={product.colors[0].images[0]}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-[var(--muted)]">{formatPrice(product.price)}</p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-[var(--muted)] underline underline-offset-2 hover:text-black"
          >
            View
          </Link>
        </div>
      )}

      <ContactForm defaultMessage={defaultMessage} />
    </div>
  );
}
