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

  return (
    <div
      className={`relative mt-[3.1px] overflow-hidden rounded-[16px] bg-gradient-to-br from-accent-soft to-[#fdf6f0] ${
        large ? "px-3 py-2.5 sm:px-3.5 sm:py-3" : "px-2.5 py-2 sm:px-3 sm:py-2.5"
      }`}
    >
      <HeartIcon className={`pointer-events-none absolute text-accent/30 ${large ? "top-1.5 right-16 h-2.5 w-2.5" : "top-1 right-14 h-2 w-2"}`} />
      <SparkleIcon className={`pointer-events-none absolute text-accent/40 ${large ? "bottom-1.5 left-10 h-2.5 w-2.5" : "bottom-1 left-9 h-2 w-2"}`} />

      <div className="relative flex items-center gap-2">
        <span className={`relative flex shrink-0 items-center justify-center rounded-full bg-accent text-white ${large ? "h-9 w-9" : "h-8 w-8"}`}>
          <span className="pointer-events-none absolute inset-[2px] rounded-full border-2 border-dashed border-white/60" />
          <svg className={large ? "h-4 w-4" : "h-3.5 w-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="12" cy="12" r="7.5" />
            <path d="M12 6.5v1.4M16.2 8l-.7 1.2M7.8 8l.7 1.2M18.5 12h-1.4M6.9 12H5.5M16.2 16l-.7-1.2M7.8 16l.7-1.2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className={`flex items-baseline gap-1.5 leading-none ${large ? "text-[12.5px] sm:text-sm" : "text-[11px] sm:text-xs"}`}>
            <span className="shrink-0 text-foreground/80">Your selected size:</span>
            {preferred.length === 1 ? (
              <span className={`flex shrink-0 items-center justify-center rounded-full bg-white font-bold text-accent ${large ? "h-6 w-6 text-[12px]" : "h-5 w-5 text-[10px]"}`}>
                {preferred[0].display_text}
              </span>
            ) : (
              <span className="truncate font-bold text-accent">{preferred.map((s) => s.display_text).join(", ")}</span>
            )}
          </p>
          <p className={`mt-1 flex items-center gap-1 truncate text-[var(--muted)] ${large ? "text-[11px] sm:text-xs" : "text-[9.5px] sm:text-[10.5px]"}`}>
            <HeartIcon filled className={large ? "h-2.5 w-2.5 text-accent" : "h-2 w-2 text-accent"} />
            Thanks! We&rsquo;ll show you the best fits.
          </p>
        </div>

        <Link
          href="/select-size"
          className={`relative flex shrink-0 items-center gap-1 rounded-full bg-white font-semibold text-accent shadow-sm outline-none transition hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
            large ? "px-3 py-1.5 text-[11.5px]" : "px-2.5 py-1.5 text-[10px]"
          }`}
        >
          Change size
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
