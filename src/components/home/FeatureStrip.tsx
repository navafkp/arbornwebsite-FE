import { HeartIcon } from "@/components/ui/decor";

export default function FeatureStrip() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-3xl bg-accent-soft px-5 py-5">
      <HeartIcon filled className="absolute top-4 left-8 h-3 w-3 text-accent/40" />
      <HeartIcon filled className="absolute top-9 left-16 h-2.5 w-2.5 text-accent/30" />
      <HeartIcon filled className="absolute bottom-5 left-5 h-2 w-2 text-accent/30" />

      <svg
        className="absolute right-6 bottom-4 h-9 w-9 text-accent/50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 3v12m0 0l-3.5-3.5M12 15l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 21c3-5 11-5 14 0" strokeLinecap="round" />
      </svg>

      <div className="relative flex items-center gap-4">
        <svg
          className="h-11 w-11 shrink-0 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="1" y="7" width="13" height="9" rx="1.2" />
          <path d="M14 10h4l3 3v3h-7z" strokeLinejoin="round" />
          <circle cx="6" cy="18.2" r="1.7" />
          <circle cx="17" cy="18.2" r="1.7" />
        </svg>

        <div>
          <p className="font-serif text-xl leading-tight text-accent">
            Free Shipping
          </p>
          <p className="text-lg leading-tight font-semibold text-foreground">
            All Over India
          </p>
          <span className="mt-1.5 inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-accent">
            No Minimum Order
          </span>
        </div>
      </div>
    </div>
  );
}
