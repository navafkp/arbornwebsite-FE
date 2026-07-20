"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { BowIcon } from "@/components/ui/decor";
import { withBasePath } from "@/lib/asset-path";

const LOGO_IMAGE = withBasePath("/arborn.webp");

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

export function PageHeader({ showBackButton = true }: { showBackButton?: boolean }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-[67px] items-center justify-center border-b border-black/5 bg-background px-4">
      {showBackButton && (
        <div className="absolute top-1/2 left-3 -translate-y-1/2">
          <BackButton variant="bare" />
        </div>
      )}

      <div className="flex flex-col items-center leading-none">
        <BowIcon className="mb-0.5 h-3 w-3 text-accent" />
        <Image src={LOGO_IMAGE} alt="Arborn" width={40} height={40} className="h-10 w-10 object-contain" />
        <p className="mt-0.5 font-serif text-[7px] tracking-[0.15em] text-[#D88FA0]">NIGHTWEAR</p>
      </div>
    </header>
  );
}
