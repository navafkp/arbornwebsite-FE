"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSizes, type BackendSize } from "@/lib/api-client";
import { getPreferredSizes } from "@/lib/preferred-size";

export default function BustSizeBanner() {
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

  return (
    <div className="mt-[3.1px] flex items-center justify-between gap-1 rounded-[11px] bg-accent-soft px-[7px] py-[6.2px] sm:gap-1.5 sm:px-[12.3px] sm:py-[8.8px]">
      <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
        <span className="flex h-[19.7px] w-[19.7px] shrink-0 items-center justify-center rounded-[7.9px] bg-white text-accent sm:h-[24.6px] sm:w-[24.6px] sm:rounded-[10.6px]">
          <svg className="h-[9.9px] w-[9.9px] sm:h-[12.3px] sm:w-[12.3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="m5 19 14-14 2 2L7 21H5v-2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m12 12 2 2m-5 1 2 2m4-8 2 2" strokeLinecap="round" />
          </svg>
        </span>
        <p className="flex min-w-0 items-baseline gap-[3.5px] text-[11px] leading-none sm:gap-[5.3px] sm:text-[11px]">
          {preferred.length > 0 ? (
            <>
              <span className="shrink-0">Shopping for:</span>
              <span className="truncate font-semibold text-accent">
                {preferred.map((s) => s.display_text).join(", ")}
              </span>
            </>
          ) : (
            <span className="truncate font-semibold text-accent">Choose your size</span>
          )}
        </p>
      </div>

      <Link
        href="/select-size"
        className="relative flex shrink-0 items-center gap-[1.8px] rounded-[10.6px] border border-accent/30 bg-white px-[7px] py-[1.1px] text-[9.9px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[3.5px] sm:px-[10.6px] sm:py-[5.5px] sm:text-[11px]"
      >
        {preferred.length > 0 ? "Change" : "Choose"}
        <svg className="h-[8.8px] w-[8.8px] sm:h-[10.6px] sm:w-[10.6px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
