"use client";

import { useEffect } from "react";
import FilterSidebar, { type ProductFilters } from "./FilterSidebar";
import { cn } from "@/lib/utils";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  resultCount: number;
}

export default function MobileFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  resultCount,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        className={cn("absolute inset-0 bg-black/30 transition-opacity", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <span className="text-sm font-medium">Filters</span>
          <button type="button" onClick={onClose} aria-label="Close filters" className="p-1">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <FilterSidebar filters={filters} onChange={onChange} />
        </div>
        <div className="border-t border-black/5 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-accent py-3 text-xs font-medium tracking-wide text-white transition hover:bg-accent-dark"
          >
            Show {resultCount} {resultCount === 1 ? "Result" : "Results"}
          </button>
        </div>
      </div>
    </div>
  );
}
