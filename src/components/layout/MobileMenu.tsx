"use client";

import Link from "next/link";
import { useEffect } from "react";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/30 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <nav
        className={cn(
          "absolute top-0 left-0 flex h-full w-[82%] max-w-xs flex-col bg-white px-6 py-6 shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-serif text-xl tracking-[0.15em]">ARBORN</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 text-black/70 transition hover:text-black"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-1 text-sm">
          <li>
            <Link
              href="/products"
              onClick={onClose}
              className="block border-b border-black/5 py-3 tracking-wide"
            >
              All Products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/products?category=${category.slug}`}
                onClick={onClose}
                className="block border-b border-black/5 py-3 tracking-wide"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-1 pt-6 text-sm text-[var(--muted)]">
          <Link href="/wishlist" onClick={onClose} className="py-2">
            Wishlist
          </Link>
          <Link href="/cart" onClick={onClose} className="py-2">
            Cart
          </Link>
          <Link href="/profile" onClick={onClose} className="py-2">
            My Profile
          </Link>
          <Link href="/contact" onClick={onClose} className="py-2">
            Contact Us
          </Link>
        </div>
      </nav>
    </div>
  );
}
