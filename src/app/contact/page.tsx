import type { Metadata } from "next";
import { Suspense } from "react";
import ContactPageBridge from "@/components/contact/ContactPageBridge";

// --- AWS / Node server version (reads searchParams on the server) ---
// Revert to this when hosting on a Node server again (e.g. AWS). It replaces
// the Suspense + ContactPageBridge below.
//
// import Image from "next/image";
// import Link from "next/link";
// import { getProductBySlug } from "@/lib/data/products";
// import { formatPrice } from "@/lib/utils";
// import ContactForm from "@/components/contact/ContactForm";
//
// interface ContactPageProps {
//   searchParams: Promise<{ product?: string; size?: string }>;
// }
//
// export default async function ContactPage({ searchParams }: ContactPageProps) {
//   const params = await searchParams;
//   const product = params.product ? getProductBySlug(params.product) : undefined;
//
//   const defaultMessage = product
//     ? `Hi, I'd like to order the "${product.name}"${params.size ? ` in size ${params.size}` : ""}. Please share availability and payment details.`
//     : "";
//
//   return (
//     <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
//       <div className="mb-10 text-center">
//         <h1 className="font-serif text-4xl">Contact Us</h1>
//         <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
//           Found something you love? Send us a message with your details and we&rsquo;ll help you
//           place your order.
//         </p>
//       </div>
//
//       {product && (
//         <div className="mb-8 flex items-center gap-4 rounded-2xl border border-black/[0.06] p-4">
//           <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f4f2ee]">
//             <Image
//               src={product.colors[0].images[0]}
//               alt={product.name}
//               fill
//               sizes="64px"
//               className="object-cover"
//             />
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-medium">{product.name}</p>
//             <p className="text-xs text-[var(--muted)]">{formatPrice(product.price)}</p>
//           </div>
//           <Link
//             href={`/products/${product.slug}`}
//             className="text-xs text-[var(--muted)] underline underline-offset-2 hover:text-black"
//           >
//             View
//           </Link>
//         </div>
//       )}
//
//       <ContactForm defaultMessage={defaultMessage} />
//     </div>
//   );
// }

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Arborn to place an order or ask a question.",
};

// --- GitHub Pages static export version ---
// searchParams can't be read on the server with `output: "export"` (there is
// no server at request time), so the query string is read client-side inside
// ContactPageBridge via useSearchParams instead.
export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageBridge />
    </Suspense>
  );
}
