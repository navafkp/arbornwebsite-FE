"use client";

import Image from "next/image";
import { useState } from "react";
import SearchBar from "@/components/layout/SearchBar";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { withBasePath } from "@/lib/asset-path";

const INSTAGRAM_URL = "#";
const LOGO_IMAGE = withBasePath("/arborn.webp");

export default function HomeHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={`fixed top-0 right-0 left-0 z-50 flex h-[67px] items-center justify-between bg-background px-4 ${searchOpen ? "border-b border-black/5" : ""}`}>
      {searchOpen ? (
        <>
          <SearchBar
            autoFocus
            onSubmitted={() => setSearchOpen(false)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black/60"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="relative z-30 flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full text-accent"
          >
            <svg className="h-[23.1px] w-[23.1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>

          <div className="pointer-events-none absolute top-[-0.5px] left-1/2 -translate-x-1/2">
            <Image src={LOGO_IMAGE} alt="Arborn" width={64} height={64} className="h-16 w-16 object-contain" />
          </div>
          <p className="pointer-events-none absolute top-[67px] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[10px] leading-none font-bold tracking-[0.15em] text-[#D88FA0]">NIGHTWEAR</p>

          <div className="relative z-30 flex items-center gap-1">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full text-accent"
            >
              <svg className="h-[23.1px] w-[23.1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={buildWhatsAppLink("Hi Arborn! I have a question.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full text-black"
            >
              <svg className="h-[23.1px] w-[23.1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3a9 9 0 00-7.6 13.8L3 21l4.4-1.4A9 9 0 1012 3z" strokeLinejoin="round" />
                <path d="M8.5 9c0 4 2.5 6.5 6.5 6.5.6 0 1-.4.9-1l-.2-1a.9.9 0 00-.7-.7l-1.5-.3a.9.9 0 00-.9.3l-.3.4c-1-.5-1.8-1.3-2.3-2.3l.4-.3a.9.9 0 00.3-.9L10.4 8.5a.9.9 0 00-.7-.7l-1-.2c-.6-.1-1.2.4-1.2 1z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute top-[67px] right-0 left-0 z-20 h-px -translate-y-1/2 bg-black/5" />
        </>
      )}
    </header>
  );
}
