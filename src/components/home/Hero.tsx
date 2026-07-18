"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BowIcon, SparkleIcon, HeartIcon, CloudShape } from "@/components/ui/decor";
import ScrollHint from "@/components/ui/ScrollHint";
import { withBasePath } from "@/lib/asset-path";
import { getPreferredSizes } from "@/lib/preferred-size";

const HERO_IMAGE = withBasePath("/images/arborn-nightwear.png");
const LOGO_IMAGE = withBasePath("/arborn.webp");

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
      <HeartIcon className="h-3 w-3 text-accent" />
    </p>
  );
}

function StartShoppingButton({ className }: { className?: string }) {
  const [href, setHref] = useState("/select-size");

  useEffect(() => {
    // One-time sync from localStorage (an external system) on mount. Starting
    // state at the default href keeps SSR/client markup identical, avoiding a
    // hydration mismatch that a lazy useState initializer would cause.
    const preferredSizes = getPreferredSizes();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (preferredSizes.length > 0) {
      setHref(`/products?size=${preferredSizes.join("&size=")}`);
    }
  }, []);

  return (
    <Link href={href} className={className}>
      Start Shopping
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

const VISITED_KEY = "arborn_visited";

export default function Hero() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(VISITED_KEY)) {
        // Returning visitor — redirect immediately, no need to show hero.
        const sizes = localStorage.getItem("arborn_preferred_size");
        if (sizes) {
          router.replace(`/products?size=${sizes.split(",").join("&size=")}`);
        } else {
          router.replace("/products");
        }
      } else {
        // First visit — mark visited and show the hero.
        localStorage.setItem(VISITED_KEY, "1");
        setReady(true);
      }
    } catch {
      // localStorage unavailable — just show the hero.
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-3 pb-8 sm:px-6 md:px-8 md:py-16 lg:px-12">
        {/* Mobile-only brand lockup + headline (text sits above the photo, not overlaid) */}
        <div className="relative md:hidden">
          <CloudShape className="absolute -top-2 -left-2 h-8 w-16 text-white/70" />
          <SparkleIcon className="absolute top-6 right-8 h-4 w-4 text-accent/70" />
          <SparkleIcon className="absolute top-24 right-2 h-3 w-3 text-accent/50" />

          <div className="flex flex-col items-center pt-2 text-center">
            <BowIcon className="h-10 w-10 text-accent" />
            <Image
              src={LOGO_IMAGE}
              alt="Arborn"
              width={200}
              height={200}
              className="mt-1 h-24 w-24 object-contain"
            />
            <span className="mt-0.5 text-[10px] tracking-[0.4em] text-[var(--muted)]">
              NIGHTWEAR
            </span>
          </div>

          <h1 className="relative mt-3 font-serif text-4xl leading-[1.05] font-bold text-foreground">
            Hello,
            <br />
            <span className="text-accent">Beautiful!</span>{" "}
            <HeartIcon filled className="inline h-7 w-7 text-accent align-middle" />
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--muted)]">
            Cozy nights start here
            <HeartIcon className="h-3.5 w-3.5 text-accent" />
          </p>
        </div>

        <div className="md:grid md:grid-cols-2 md:items-center md:gap-16 lg:gap-24">
          {/* Desktop-only text column */}
          <div className="hidden md:block">
            <p className="mb-5 text-xs tracking-[0.3em] text-[var(--muted)] uppercase">
              Arborn Nightwear
            </p>
            <h1 className="font-serif text-5xl leading-[1.08] font-bold text-foreground lg:text-6xl">
              Hello,
              <br />
              <span className="text-accent">Beautiful!</span>
            </h1>
            <p className="mt-5 max-w-sm text-base text-[var(--muted)]">
              Cozy nights start here.
            </p>

            <StartShoppingButton className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark" />

            <TrustRow className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-black/5 pt-9" />

            <SecureLine className="mt-9 flex items-center gap-2 text-xs text-[var(--muted)]" />
          </div>

          <div className="relative mt-3 aspect-[11/10] w-full overflow-hidden rounded-3xl md:mt-0 md:aspect-[3/4]">
            <Image
              src={HERO_IMAGE}
              alt="Woman relaxing in Arborn nightwear"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Mobile-only content below the image */}
        <div className="md:hidden">
          <StartShoppingButton className="mt-4 flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark" />

          <SecureLine className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[var(--muted)]" />
        </div>
      </div>

      <ScrollHint className="bottom-4 md:hidden" />
    </section>
  );
}
