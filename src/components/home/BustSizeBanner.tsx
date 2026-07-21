"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSizes, type BackendSize } from "@/lib/api-client";
import { getPreferredSizes } from "@/lib/preferred-size";
import { BowIcon, HeartIcon } from "@/components/ui/decor";

export default function BustSizeBanner({ large = false }: { large?: boolean }) {
  const [sizes, setSizes] = useState<BackendSize[]>([]);

  useEffect(() => {
    getSizes()
      .then(setSizes)
      .catch(() => setSizes([]));
  }, []);

  const preferredCodes = getPreferredSizes();
  const preferred = preferredCodes
    .map((code) => sizes.find((s) => s.size_code === code))
    .filter((s): s is BackendSize => Boolean(s));
  const hasSize = preferred.length > 0;

  // Once a size is chosen this collapses to a plain info bar. Until then,
  // it's a bigger (50% larger), decorated prompt so it's hard to miss.
  const containerClass = hasSize
    ? large
      ? "mt-[3.1px] flex items-center justify-between gap-1 rounded-[12.1px] bg-accent-soft px-[7.7px] py-[6.8px] sm:gap-1.5 sm:px-[13.5px] sm:py-[9.7px]"
      : "mt-[3.1px] flex items-center justify-between gap-1 rounded-[11px] bg-accent-soft px-[7px] py-[6.2px] sm:gap-1.5 sm:px-[12.3px] sm:py-[8.8px]"
    : large
      ? "relative mt-[3.1px] flex items-center justify-between gap-1.5 overflow-hidden rounded-[18.2px] bg-accent-soft px-[11.6px] py-[10.2px] sm:gap-2 sm:px-[20.3px] sm:py-[14.6px]"
      : "relative mt-[3.1px] flex items-center justify-between gap-1.5 overflow-hidden rounded-[16.5px] bg-accent-soft px-[10.5px] py-[9.3px] sm:gap-2 sm:px-[18.5px] sm:py-[13.2px]";

  const iconWrapClass = hasSize
    ? large
      ? "flex h-[21.7px] w-[21.7px] shrink-0 items-center justify-center rounded-[8.7px] bg-white text-accent sm:h-[27.1px] sm:w-[27.1px] sm:rounded-[11.7px]"
      : "flex h-[19.7px] w-[19.7px] shrink-0 items-center justify-center rounded-[7.9px] bg-white text-accent sm:h-[24.6px] sm:w-[24.6px] sm:rounded-[10.6px]"
    : large
      ? "flex h-[32.6px] w-[32.6px] shrink-0 items-center justify-center rounded-[13.1px] bg-white text-accent sm:h-[40.7px] sm:w-[40.7px] sm:rounded-[17.6px]"
      : "flex h-[29.6px] w-[29.6px] shrink-0 items-center justify-center rounded-[11.9px] bg-white text-accent sm:h-[36.9px] sm:w-[36.9px] sm:rounded-[15.9px]";

  const iconSvgClass = hasSize
    ? large
      ? "h-[10.9px] w-[10.9px] sm:h-[13.5px] sm:w-[13.5px]"
      : "h-[9.9px] w-[9.9px] sm:h-[12.3px] sm:w-[12.3px]"
    : large
      ? "h-[16.4px] w-[16.4px] sm:h-[20.3px] sm:w-[20.3px]"
      : "h-[14.9px] w-[14.9px] sm:h-[18.5px] sm:w-[18.5px]";

  const textClass = hasSize
    ? large
      ? "flex min-w-0 items-baseline gap-[3.9px] text-[12.1px] leading-none sm:gap-[5.8px] sm:text-[12.1px]"
      : "flex min-w-0 items-baseline gap-[3.5px] text-[11px] leading-none sm:gap-[5.3px] sm:text-[11px]"
    : large
      ? "flex min-w-0 items-baseline gap-[5.9px] text-[18.2px] leading-none sm:gap-[8.7px] sm:text-[18.2px]"
      : "flex min-w-0 items-baseline gap-[5.3px] text-[16.5px] leading-none sm:gap-[8px] sm:text-[16.5px]";

  const buttonClass = hasSize
    ? large
      ? "relative flex shrink-0 items-center gap-[2px] rounded-[11.7px] border border-accent/30 bg-white px-[7.7px] py-[1.2px] text-[10.9px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[3.9px] sm:px-[11.7px] sm:py-[6.1px] sm:text-[12.1px]"
      : "relative flex shrink-0 items-center gap-[1.8px] rounded-[10.6px] border border-accent/30 bg-white px-[7px] py-[1.1px] text-[9.9px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[3.5px] sm:px-[10.6px] sm:py-[5.5px] sm:text-[11px]"
    : large
      ? "relative flex shrink-0 items-center gap-[3px] rounded-[17.6px] border border-accent/30 bg-white px-[11.6px] py-[1.8px] text-[16.4px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[5.9px] sm:px-[17.6px] sm:py-[9.2px] sm:text-[18.2px]"
      : "relative flex shrink-0 items-center gap-[2.7px] rounded-[15.9px] border border-accent/30 bg-white px-[10.5px] py-[1.7px] text-[14.9px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[5.3px] sm:px-[15.9px] sm:py-[8.3px] sm:text-[16.5px]";

  const chevronClass = hasSize
    ? large
      ? "h-[9.7px] w-[9.7px] sm:h-[11.7px] sm:w-[11.7px]"
      : "h-[8.8px] w-[8.8px] sm:h-[10.6px] sm:w-[10.6px]"
    : large
      ? "h-[14.6px] w-[14.6px] sm:h-[17.6px] sm:w-[17.6px]"
      : "h-[13.2px] w-[13.2px] sm:h-[15.9px] sm:w-[15.9px]";

  return (
    <div className={containerClass}>
      {!hasSize && (
        <>
          <BowIcon className="pointer-events-none absolute top-1 left-6 h-3 w-3 text-accent/40 sm:h-3.5 sm:w-3.5" />
          <HeartIcon filled className="pointer-events-none absolute right-10 bottom-1 h-2.5 w-2.5 text-accent/30 sm:h-3 sm:w-3" />
          <HeartIcon filled className="pointer-events-none absolute top-1/2 right-2 h-2 w-2 -translate-y-1/2 text-accent/25 sm:h-2.5 sm:w-2.5" />
        </>
      )}

      <div className="relative flex min-w-0 items-center gap-1 sm:gap-1.5">
        <span className={iconWrapClass}>
          <svg className={iconSvgClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="m5 19 14-14 2 2L7 21H5v-2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m12 12 2 2m-5 1 2 2m4-8 2 2" strokeLinecap="round" />
          </svg>
        </span>
        <p className={textClass}>
          {hasSize ? (
            <>
              <span className="shrink-0">Size:</span>
              <span className="truncate font-semibold text-accent">
                {preferred.map((s) => s.display_text).join(", ")}
              </span>
            </>
          ) : (
            <span className="truncate font-semibold text-accent">Choose your size</span>
          )}
        </p>
      </div>

      <Link href="/select-size" className={`relative ${buttonClass}`}>
        {hasSize ? "Change" : "Choose"}
        <svg className={chevronClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
