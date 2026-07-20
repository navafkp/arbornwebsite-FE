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
    <div className="mt-[11.4px] flex items-center justify-between gap-2 rounded-2xl bg-accent-soft px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3.5">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-accent sm:h-10 sm:w-10">
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="m5 19 14-14 2 2L7 21H5v-2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m12 12 2 2m-5 1 2 2m4-8 2 2" strokeLinecap="round" />
          </svg>
        </span>
        <p className="min-w-0 text-xs leading-tight sm:text-sm">
          Shopping for:
          <br />
          <span className="block truncate">
            Bust size:{" "}
            <span className="font-semibold text-accent">
              {preferred.length > 0
                ? preferred.map((s) => `${s.display_text} (${s.measurement})`).join(", ")
                : "Not set yet"}
            </span>
          </span>
        </p>
      </div>

      <Link
        href="/select-size"
        className="flex shrink-0 items-center gap-1 rounded-full border border-accent/30 bg-white px-3 py-1.5 text-[11px] font-medium text-black sm:px-4 sm:py-2 sm:text-xs"
      >
        {preferred.length > 0 ? "Change" : "Choose"}
        <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
