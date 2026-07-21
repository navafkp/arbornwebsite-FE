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
    <div className="mt-[3.4px] flex items-center justify-between gap-1 rounded-[10px] bg-accent-soft px-[6.4px] py-[5.6px] sm:gap-1.5 sm:px-[11.2px] sm:py-2">
      <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
        <span className="flex h-[17.9px] w-[17.9px] shrink-0 items-center justify-center rounded-[7.2px] bg-white text-accent sm:h-[22.4px] sm:w-[22.4px] sm:rounded-[9.6px]">
          <svg className="h-[9px] w-[9px] sm:h-[11.2px] sm:w-[11.2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="m5 19 14-14 2 2L7 21H5v-2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m12 12 2 2m-5 1 2 2m4-8 2 2" strokeLinecap="round" />
          </svg>
        </span>
        <p className="flex min-w-0 items-baseline gap-[3.2px] text-[10px] leading-none sm:gap-[4.8px] sm:text-[10px]">
          <span className="shrink-0">{preferred.length > 0 ? "Shopping for:" : "Bust size:"}</span>
          <span className="truncate font-semibold text-accent">
            {preferred.length > 0
              ? preferred.map((s) => s.display_text).join(", ")
              : "Not set yet"}
          </span>
        </p>
      </div>

      <Link
        href="/select-size"
        className="relative flex shrink-0 items-center gap-[1.6px] rounded-[9.6px] border border-accent/30 bg-white px-[6.4px] py-1 text-[9px] font-medium leading-none text-black outline-none after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:gap-[3.2px] sm:px-[9.6px] sm:py-[5px] sm:text-[10px]"
      >
        {preferred.length > 0 ? "Change" : "Choose"}
        <svg className="h-2 w-2 sm:h-[9.6px] sm:w-[9.6px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
