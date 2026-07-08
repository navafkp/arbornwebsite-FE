import Link from "next/link";
import { categories } from "@/lib/data/categories";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white pb-[calc(4.5rem_+_env(safe-area-inset-bottom))] lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-xl tracking-[0.18em]">ARBORN</span>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">
              Comfort made for you. Premium nightwear, thoughtfully designed.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-widest text-black uppercase">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="transition hover:text-black"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-widest text-black uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
              <li>
                <Link href="/products" className="transition hover:text-black">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/profile" className="transition hover:text-black">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-black">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-widest text-black uppercase">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
              <li>hello@arborn.com</li>
              <li>+91 98765 43210</li>
              <li>Mon–Sat, 10am–7pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-6 text-xs text-[var(--muted)] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Arborn Nightwear. All rights reserved.</p>
          <p>Secure. Simple. Hassle Free.</p>
        </div>
      </div>
    </footer>
  );
}
