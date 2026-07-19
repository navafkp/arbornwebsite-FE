"use client";

import { usePathname } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const hasPageHeader = normalizedPathname !== "/";

  return (
    <>
      {hasPageHeader && <PageHeader />}
      <main className={hasPageHeader ? "flex-1 pt-[72px]" : "flex-1"}>{children}</main>
    </>
  );
}

function PageHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-black/5 bg-background px-4 pt-4 pb-4">
      <div className="absolute top-1/2 left-3 -translate-y-1/2">
        <BackButton variant="bare" />
      </div>

      <div className="flex flex-col items-center">
        <p className="text-[20px] font-medium tracking-[0.35em] text-neutral-500 uppercase">
          ARBORN
        </p>
        <p className="mt-0 font-serif text-sm tracking-[0.25em] text-[#D88FA0]">NIGHTWEAR</p>
      </div>
    </header>
  );
}
