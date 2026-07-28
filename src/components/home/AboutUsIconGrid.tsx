function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5c1.7-3.6 4.5-5.5 7.5-5.5s5.8 1.9 7.5 5.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5c0 8.3 6.7 15 15 15l2-4-5-2-1.5 2C11.5 14.5 9.5 12.5 8 10.5L10 9 8 4z" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      <path d="M21 3l-6 6" strokeLinecap="round" />
      <path d="M21 3l-1.5 5-2.5-2.5z" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleHairIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 4c-3 1-4.5 4-4 8 .3 2.5 1.7 5 4 7" strokeLinecap="round" />
      <circle cx="12" cy="10" r="4" />
      <path d="M18 6l.8 1.6L20 8l-1.2.6L18 10l-.6-1.4L16 8l1.4-.4z" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 6.5c-1.8-1.2-4.3-1.5-7.5-1v13c3.2-.5 5.7-.2 7.5 1 1.8-1.2 4.3-1.5 7.5-1v-13c-3.2-.5-5.7-.2-7.5 1z" strokeLinejoin="round" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5h16v10H9l-4 4v-4H4z" strokeLinejoin="round" />
      <path d="M10 9.5c0-1 .9-1.8 2-1.8s2 .8 2 1.8c0 1-1.2 1.3-1.9 2.1" strokeLinecap="round" />
      <circle cx="12" cy="14.3" r="0.4" fill="currentColor" />
    </svg>
  );
}

const ABOUT_US_ITEMS = [
  { label: "About Us", Icon: ProfileIcon },
  { label: "Contact Us", Icon: PhoneIcon },
  { label: "Our Vision", Icon: EyeIcon },
  { label: "Our Mission", Icon: TargetIcon },
  { label: "Meet the Founder", Icon: SparkleHairIcon },
  { label: "Our Journey", Icon: BookIcon },
  { label: "Quality Promise", Icon: ShieldCheckIcon },
  { label: "FAQs", Icon: FaqIcon },
];

// TEMPORARY: static placeholder grid, no destinations wired up yet — links
// will be added per item later.
export default function AboutUsIconGrid() {
  return (
    <section className="mt-6 sm:mt-8">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <span className="h-px flex-1 bg-accent/40" />
        <h2 className="shrink-0 px-2 font-serif text-xl font-bold tracking-[0.15em] text-accent uppercase sm:text-2xl">
          About Us
        </h2>
        <span className="h-px flex-1 bg-accent/40" />
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      </div>

      <div className="mt-6 grid grid-cols-4 gap-x-2 gap-y-6">
        {ABOUT_US_ITEMS.map(({ label, Icon }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-[67px] w-[67px] items-center justify-center rounded-full bg-accent-soft/60 text-accent sm:h-[73.9px] sm:w-[73.9px]">
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <span className="text-xs leading-tight font-medium text-foreground sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
