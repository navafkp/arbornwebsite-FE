"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSizes, type BackendSize } from "@/lib/api-client";
import { getPreferredSizes } from "@/lib/preferred-size";
import { withBasePath } from "@/lib/asset-path";
import { HeartIcon, SparkleIcon, FlowerIcon } from "@/components/ui/decor";

const BUST_ICON = withBasePath("/images/bust_measurement_icon.svg");

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
      <Link
        href="/select-size"
        className={`group relative mt-[3.1px] flex items-center overflow-hidden rounded-[22px] bg-gradient-to-br from-accent-soft to-[#fdf6f0] shadow-[0_8px_20px_rgba(91,53,61,0.08)] outline-none transition hover:shadow-[0_10px_24px_rgba(91,53,61,0.12)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${large ? "gap-4 p-4 sm:p-5" : "gap-3 p-3.5 sm:p-4"
          }`}
      >
        <HeartIcon className={`pointer-events-none absolute text-accent/40 ${large ? "top-3 left-14 h-3.5 w-3.5" : "top-2.5 left-12 h-3 w-3"}`} />
        <SparkleIcon className={`pointer-events-none absolute text-accent/50 ${large ? "top-4 right-14 h-3.5 w-3.5" : "top-3 right-12 h-3 w-3"}`} />
        <SparkleIcon className={`pointer-events-none absolute text-accent/30 ${large ? "top-8 right-10 h-2.5 w-2.5" : "top-6 right-8 h-2 w-2"}`} />
        <FlowerIcon className={`pointer-events-none absolute hidden text-accent/20 sm:block ${large ? "right-3 bottom-2 h-9 w-9" : "right-2 bottom-1.5 h-8 w-8"}`} />

        <span className={`relative flex shrink-0 items-center justify-center rounded-full bg-accent-soft ${large ? "h-20 w-20" : "h-16 w-16"}`}>
          <Image
            src={BUST_ICON}
            alt=""
            width={64}
            height={64}
            className={large ? "h-14 w-14" : "h-11 w-11"}
          />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className={`font-serif leading-tight text-foreground ${large ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
            Choose <span className="italic text-accent">your size</span>
          </h3>
          <p className={`mt-0.5 truncate text-[var(--muted)] ${large ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"}`}>
            For the maximum comfort
          </p>
        </div>

        <svg
          className={`relative shrink-0 text-accent transition group-hover:translate-x-0.5 ${large ? "h-[45.62px] w-[45.62px]" : "h-[38.02px] w-[38.02px]"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    );
  }

  return (
    <div
      className={`relative mt-[3.1px] overflow-hidden rounded-[16px] bg-gradient-to-br from-accent-soft to-[#fdf6f0] ${large ? "px-3 py-2.5 sm:px-3.5 sm:py-3" : "px-2.5 py-2 sm:px-3 sm:py-2.5"
        }`}
    >
      <HeartIcon className={`pointer-events-none absolute text-accent/30 ${large ? "top-1.5 right-16 h-2.5 w-2.5" : "top-1 right-14 h-2 w-2"}`} />
      <SparkleIcon className={`pointer-events-none absolute text-accent/40 ${large ? "bottom-1.5 left-10 h-2.5 w-2.5" : "bottom-1 left-9 h-2 w-2"}`} />

      <div className="relative flex items-center gap-2">
        <span className={`relative flex shrink-0 items-center justify-center rounded-full bg-accent-soft ${large ? "h-9 w-9" : "h-8 w-8"}`}>
          <Image src={BUST_ICON} alt="" width={64} height={64} className={large ? "h-6 w-6" : "h-5 w-5"} />
        </span>

        <div className="min-w-0 flex-1">
          <p className={`text-foreground/80 leading-none ${large ? "text-[12.5px] sm:text-sm" : "text-[11px] sm:text-xs"}`}>
            Your selected size:
          </p>
          <div className="mt-[5.4px]">
            {preferred.length === 1 ? (
              <span className={`flex shrink-0 items-center justify-center rounded-full bg-white font-bold text-accent ${large ? "h-6 w-6 text-[12px]" : "h-5 w-5 text-[10px]"}`}>
                {preferred[0].display_text}
              </span>
            ) : (
              <span className="truncate text-[9px] font-bold text-accent">{preferred.map((s) => s.display_text).join(", ")}</span>
            )}
          </div>
        </div>

        <Link
          href="/select-size"
          className={`relative flex shrink-0 items-center gap-1 rounded-full bg-white font-semibold text-accent shadow-sm outline-none transition hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${large ? "px-3 py-1.5 text-[11.5px]" : "px-2.5 py-1.5 text-[10px]"
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
