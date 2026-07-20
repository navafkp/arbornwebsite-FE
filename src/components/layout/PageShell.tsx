"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { BowIcon } from "@/components/ui/decor";
import SearchBar from "@/components/layout/SearchBar";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { withBasePath } from "@/lib/asset-path";

const LOGO_IMAGE = withBasePath("/arborn.webp");
const INSTAGRAM_URL = "#";

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const hasPageHeader = normalizedPathname !== "/";

  return (
    <>
      {hasPageHeader && <PageHeader />}
      <main className={hasPageHeader ? "flex-1 pt-[67px]" : "flex-1"}>{children}</main>
    </>
  );
}

export function PageHeader({
  showBackButton = true,
  showSearch = true,
}: {
  showBackButton?: boolean;
  showSearch?: boolean;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  if (searchOpen) {
    return (
      <header className="fixed top-0 right-0 left-0 z-50 flex h-[67px] items-center border-b border-black/5 bg-background px-4">
        <SearchBar autoFocus onSubmitted={() => setSearchOpen(false)} className="flex-1" />
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
      </header>
    );
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-[67px] items-center justify-between border-b border-black/5 bg-background px-4">
      <div className="flex items-center gap-1">
        {showBackButton && <BackButton variant="bare" />}
        {showSearch && (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full text-accent"
          >
            <svg className="h-[23.1px] w-[23.1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col items-center leading-none">
        <BowIcon className="mb-0.5 h-3 w-3 text-accent" />
        <Image src={LOGO_IMAGE} alt="Arborn" width={40} height={40} className="h-10 w-10 object-contain" />
        <p className="mt-0.5 font-serif text-[10px] font-bold tracking-[0.15em] text-[#D88FA0]">NIGHTWEAR</p>
      </div>

      <div className="flex items-center gap-1">
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
          className="flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full text-[#25D366]"
        >
          <svg className="h-[23.1px] w-[23.1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3a9 9 0 00-7.6 13.8L3 21l4.4-1.4A9 9 0 1012 3z" strokeLinejoin="round" />
            <path d="M8.5 9c0 4 2.5 6.5 6.5 6.5.6 0 1-.4.9-1l-.2-1a.9.9 0 00-.7-.7l-1.5-.3a.9.9 0 00-.9.3l-.3.4c-1-.5-1.8-1.3-2.3-2.3l.4-.3a.9.9 0 00.3-.9L10.4 8.5a.9.9 0 00-.7-.7l-1-.2c-.6-.1-1.2.4-1.2 1z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}
