import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/data/images";

const TRUST_ITEMS = [
  {
    label: "Soft & Breathable",
    icon: (
      <path
        d="M4 12c2-4 6-6 8-6s6 2 8 6c-2 4-6 6-8 6s-6-2-8-6z M12 9v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Premium Quality",
    icon: <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" strokeLinejoin="round" />,
  },
  {
    label: "Made with Love",
    icon: (
      <path
        d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z"
        strokeLinejoin="round"
      />
    ),
  },
];

function TrustRow({ className }: { className?: string }) {
  return (
    <div className={className}>
      {TRUST_ITEMS.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            className="h-6 w-6 text-accent"
          >
            {item.icon}
          </svg>
          <span className="text-[11px] leading-tight text-[var(--muted)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function SecureLine({ className }: { className?: string }) {
  return (
    <p className={className}>
      <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
      </svg>
      Secure. Simple. Hassle Free.
    </p>
  );
}

function StartShoppingButton({ className }: { className?: string }) {
  return (
    <Link href="/select-size" className={className}>
      Start Shopping
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-16 lg:px-12">
        {/* Mobile-only brand lockup above the image */}
        <div className="relative mb-6 flex flex-col items-center text-center md:hidden">
          <span className="font-serif text-2xl tracking-[0.18em] text-foreground">ARBORN</span>
          <span className="mt-0.5 text-[10px] tracking-[0.4em] text-[var(--muted)]">
            NIGHTWEAR
          </span>
          <svg
            className="absolute top-0 right-[calc(50%-3.2rem)] h-4 w-4 text-accent sm:right-[calc(50%-3.6rem)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
          </svg>
        </div>

        <div className="md:grid md:grid-cols-2 md:items-center md:gap-16 lg:gap-24">
          {/* Desktop-only text column */}
          <div className="hidden md:block">
            <p className="mb-5 text-xs tracking-[0.3em] text-[var(--muted)] uppercase">
              Arborn Nightwear
            </p>
            <h1 className="font-serif text-5xl leading-[1.08] text-foreground lg:text-6xl">
              Comfort Made for
              <br />
              <span className="text-accent">You</span> <span aria-hidden="true">♡</span>
            </h1>
            <p className="mt-5 max-w-sm text-base text-[var(--muted)]">
              Soft. Stylish. Made for every you.
            </p>

            <StartShoppingButton className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark" />

            <TrustRow className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-black/5 pt-9" />

            <SecureLine className="mt-9 flex items-center gap-2 text-xs text-[var(--muted)]" />
          </div>

          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl md:aspect-[4/5]">
            <Image
              src={img(0, 1100)}
              alt="Woman relaxing in Arborn nightwear"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />

            {/* Mobile-only overlay heading on top of the image */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/25 to-transparent md:hidden" />
            <div className="absolute inset-x-0 top-0 p-6 md:hidden">
              <h2 className="font-serif text-4xl leading-[1.05] text-foreground">
                Comfort
                <br />
                Made for
                <br />
                <span className="text-accent">You</span> <span aria-hidden="true">♡</span>
              </h2>
              <p className="mt-3 max-w-[16ch] text-sm text-[var(--muted)]">
                Soft. Stylish. Made for every you.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-only content below the image */}
        <div className="md:hidden">
          <TrustRow className="mt-8 grid grid-cols-3 gap-4" />

          <StartShoppingButton className="mt-8 flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark" />

          <SecureLine className="mt-5 flex items-center justify-center gap-2 text-xs text-[var(--muted)]" />
        </div>
      </div>
    </section>
  );
}
