"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSizes, type BackendSize } from "@/lib/api-client";
import { getPreferredSizes } from "@/lib/preferred-size";
import { HeartIcon, SparkleIcon, FlowerIcon } from "@/components/ui/decor";

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

  if (!hasSize) {
    return (
      <div
        className={`relative mt-[3.1px] overflow-hidden rounded-[22px] bg-gradient-to-br from-accent-soft to-[#fdf6f0] shadow-[0_8px_20px_rgba(91,53,61,0.08)] ${large ? "p-4 sm:p-5" : "p-3.5 sm:p-4"
          }`}
      >
        <HeartIcon className={`pointer-events-none absolute text-accent/40 ${large ? "top-3 left-14 h-3.5 w-3.5" : "top-2.5 left-12 h-3 w-3"}`} />
        <HeartIcon className={`pointer-events-none absolute text-accent/30 ${large ? "bottom-3 left-16 h-3 w-3" : "bottom-2 left-14 h-2.5 w-2.5"}`} />
        <SparkleIcon className={`pointer-events-none absolute text-accent/50 ${large ? "top-4 right-24 h-3.5 w-3.5" : "top-3 right-20 h-3 w-3"}`} />
        <FlowerIcon className={`pointer-events-none absolute hidden text-accent/20 sm:block ${large ? "right-3 bottom-2 h-9 w-9" : "right-2 bottom-1.5 h-8 w-8"}`} />

        <div className="relative flex items-center gap-3">
          <span className={`relative flex shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-inner ${large ? "h-14 w-14" : "h-12 w-12"}`}>
            <span className="pointer-events-none absolute inset-[3px] rounded-full border-2 border-dashed border-white/60" />
            <svg className={large ? "h-6 w-6" : "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="12" r="7.5" />
              <path d="M12 6.5v1.4M16.2 8l-.7 1.2M7.8 8l.7 1.2M18.5 12h-1.4M6.9 12H5.5M16.2 16l-.7-1.2M7.8 16l.7-1.2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            <h3 className={`font-serif leading-tight text-foreground ${large ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
              Choose <span className="italic text-accent">your size</span>
            </h3>
            <p className={`mt-0.5 truncate text-[var(--muted)] ${large ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"}`}>
              For the maximum comfort
            </p>
          </div>

          <Link
            href="/select-size"
            className={`relative flex shrink-0 items-center gap-1 rounded-full bg-accent font-semibold text-white outline-none transition hover:bg-accent-dark focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${large ? "px-4 py-2.5 text-sm" : "px-3.5 py-2 text-xs"
              }`}
          >
            Choose
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const containerClass = large
    ? "mt-[3.1px] flex items-center justify-between gap-1 rounded-[12.1px] bg-accent-soft px-[7.7px] py-[6.8px] sm:gap-1.5 sm:px-[13.5px] sm:py-[9.7px]"
    : "mt-[3.1px] flex items-center justify-between gap-1 rounded-[11px] bg-accent-soft px-[7px] py-[6.2px] sm:gap-1.5 sm:px-[12.3px] sm:py-[8.8px]";

  const iconWrapClass = large
    ? "flex h-[21.7px] w-[21.7px] shrink-0 items-center justify-center rounded-[8.7px] bg-white text-accent sm:h-[27.1px] sm:w-[27.1px] sm:rounded-[11.7px]"
    : "flex h-[19.7px] w-[19.7px] shrink-0 items-center justify-center rounded-[7.9px] bg-white text-accent sm:h-[24.6px] sm:w-[24.6px] sm:rounded-[10.6px]";

  const iconSvgClass = large
    ? "h-[10.9px] w-[10.9px] sm:h-[13.5px] sm:w-[13.5px]"
    : "h-[9.9px] w-[9.9px] sm:h-[12.3px] sm:w-[12.3px]";

  const textClass = large
    ? "flex min-w-0 items-baseline gap-[3.9px] text-[12.1px] leading-none sm:gap-[5.8px] sm:text-[12.1px]"
    : "flex min-w-0 items-baseline gap-[3.5px] text-[11px] leading-none sm:gap-[5.3px] sm:text-[11px]";

  const buttonClass = large
    ? "relative flex shrink-0 items-center gap-[2px] rounded-[11.7px] border border-accent/30 bg-white px-[7.7px] py-[1.2px] text-[10.9px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[3.9px] sm:px-[11.7px] sm:py-[6.1px] sm:text-[12.1px]"
    : "relative flex shrink-0 items-center gap-[1.8px] rounded-[10.6px] border border-accent/30 bg-white px-[7px] py-[1.1px] text-[9.9px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[3.5px] sm:px-[10.6px] sm:py-[5.5px] sm:text-[11px]";

  const chevronClass = large
    ? "h-[9.7px] w-[9.7px] sm:h-[11.7px] sm:w-[11.7px]"
    : "h-[8.8px] w-[8.8px] sm:h-[10.6px] sm:w-[10.6px]";

  return (
    <div className={containerClass}>
      <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
        <span className={iconWrapClass}>
          <svg className={iconSvgClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="m5 19 14-14 2 2L7 21H5v-2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m12 12 2 2m-5 1 2 2m4-8 2 2" strokeLinecap="round" />
          </svg>
        </span>
        <p className={textClass}>
          <span className="shrink-0">Size:</span>
          <span className="truncate font-semibold text-accent">
            {preferred.map((s) => s.display_text).join(", ")}
          </span>
        </p>
      </div>

      <Link href="/select-size" className={buttonClass}>
        Change
        <svg className={chevronClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
