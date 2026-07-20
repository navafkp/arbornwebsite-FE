"use client";

// Static placeholder — there's no location/address system in the app yet, so
// this always shows the same location. "Change" is a no-op link for now.
const PLACEHOLDER_LOCATION = "Kerala, India";

export default function ShippingBanner() {
  return (
    <div className="mt-3 flex flex-nowrap items-center justify-between gap-2 rounded-2xl bg-accent-soft px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3.5">
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-accent sm:h-10 sm:w-10">
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="1" y="7" width="13" height="9" rx="1.2" />
            <path d="M14 10h4l3 3v3h-7z" strokeLinejoin="round" />
            <circle cx="6" cy="18.2" r="1.7" />
            <circle cx="17" cy="18.2" r="1.7" />
          </svg>
        </span>
        <p className="min-w-0 text-xs leading-tight whitespace-nowrap sm:text-sm">
          Shipping to:
          <br />
          <span className="font-semibold">{PLACEHOLDER_LOCATION}</span>
        </p>
      </div>

      <p className="min-w-0 flex-1 truncate text-center text-[10px] text-[var(--muted)] sm:text-xs">
        Not deliverable? Let us know
      </p>

      <button
        type="button"
        className="flex shrink-0 items-center gap-1 rounded-full border border-accent/30 bg-white px-3 py-1.5 text-[11px] font-medium text-black sm:px-4 sm:py-2 sm:text-xs"
      >
        Change
        <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
