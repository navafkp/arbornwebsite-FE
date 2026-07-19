import Link from "next/link";

export default function FloatingSizeAction({ hasPreferredSize }: { hasPreferredSize: boolean }) {
  const label = hasPreferredSize ? "Change size" : "Choose size";

  return (
    <Link
      href="/select-size"
      aria-label={label}
      title={label}
      className="group fixed right-5 bottom-36 z-50 inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-white/60 bg-accent px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(185,62,91,0.34),inset_0_1px_0_rgba(255,255,255,0.42)] transition duration-200 hover:-translate-y-1 hover:bg-accent-dark hover:shadow-[0_14px_28px_rgba(185,62,91,0.42),inset_0_1px_0_rgba(255,255,255,0.42)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:right-8 md:bottom-8"
    >
      <span>Size</span>
      <svg
        aria-hidden="true"
        className="h-5 w-5 transition-transform duration-200 group-hover:rotate-[-8deg]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      >
        <path d="m5 19 14-14 2 2L7 21H5v-2Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m12 12 2 2m-5 1 2 2m4-8 2 2" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
