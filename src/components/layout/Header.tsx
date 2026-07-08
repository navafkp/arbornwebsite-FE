"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";
import { useShop } from "@/lib/shop-context";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount } = useShop();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 p-2 text-black"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 justify-start md:flex-none">
          <Logo />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="text-[13px] tracking-wide text-black/70 transition hover:text-black"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 md:flex-none md:gap-3">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className={cn(
              "p-2 text-black/80 transition hover:text-black",
              searchOpen && "text-black",
            )}
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>
          <Link
            href="/profile"
            aria-label="Profile"
            className="hidden p-2 text-black/80 transition hover:text-black sm:inline-flex"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20c1.6-3.3 4.4-5 7.5-5s5.9 1.7 7.5 5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 text-black/80 transition hover:text-black"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 8h12l-1 12a1.5 1.5 0 01-1.5 1.4h-7A1.5 1.5 0 017 20L6 8z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-black/5 transition-[max-height,opacity] duration-300",
          searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <SearchBar autoFocus={searchOpen} onSubmitted={() => setSearchOpen(false)} />
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
