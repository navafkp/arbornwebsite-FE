"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getExplore, type ExploreItem } from "@/lib/api-client";
import { HeartIcon, SparkleIcon } from "@/components/ui/decor";

type ExploreCard = ExploreItem & { kind: "category" | "tag" };

// Cycled per card index so a dynamic (API-driven) list of any length still
// alternates through the same pastel label/button palette seen in the design.
const THEMES = [
  { label: "Cozy & Cute", pillBg: "#f6d9df", pillText: "#b4425f", buttonBg: "#df7296", buttonText: "#fff" },
  { label: "Soft & Dreamy", pillBg: "#f9e4e0", pillText: "#b4425f", buttonBg: "#f3ece3", buttonText: "#5b3a41" },
  { label: "New & Pretty", pillBg: "#f6d9df", pillText: "#b4425f", buttonBg: "#df7296", buttonText: "#fff" },
  { label: "Most Loved", pillBg: "#e3e6c4", pillText: "#5c6330", buttonBg: "#8a8f4f", buttonText: "#fff" },
];

// Approximates the "torn paper" edge between the image and the text panel:
// a zigzag clip-path along the bottom of the image.
function tornEdgeClipPath(teeth = 14, dip = 5) {
  const points = ["0% 0%", "100% 0%", "100% 100%"];
  for (let i = teeth; i >= 0; i--) {
    const x = (i / teeth) * 100;
    const y = i % 2 === 0 ? 100 : 100 - dip;
    points.push(`${x}% ${y}%`);
  }
  points.push("0% 100%");
  return `polygon(${points.join(", ")})`;
}

const TORN_EDGE = tornEdgeClipPath();

function SquiggleWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="absolute -bottom-1 left-0 h-2 w-full text-[#df7296]"
      >
        <path d="M0 5 Q 12 0, 25 5 T 50 5 T 75 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function CategoriesPageClient() {
  const [cards, setCards] = useState<ExploreCard[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    getExplore()
      .then(({ categories, tags }) => {
        setCards([
          ...categories.map((c) => ({ ...c, kind: "category" as const })),
          ...tags.map((t) => ({ ...t, kind: "tag" as const })),
        ]);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <header className="max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d97696]">Curated for you</p>
        <h1 className="mt-1 flex items-center gap-2 font-serif text-4xl tracking-[-0.03em] text-[#241a1d] sm:text-5xl">
          Explore
          <HeartIcon filled className="h-7 w-7 text-[#df7296]" />
          <SparkleIcon className="h-4 w-4 text-[#df7296]/70" />
        </h1>
        <p className="mt-2 text-base leading-6 text-[var(--muted)] italic">
          Find your perfect fit by <SquiggleWord>category</SquiggleWord>, <SquiggleWord>mood</SquiggleWord>, and{" "}
          <SquiggleWord>moment</SquiggleWord>.
        </p>
      </header>

      {loadState === "loading" && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-[1.5rem] bg-[#fdf8f2] shadow-[0_8px_22px_rgba(91,53,61,0.06)]">
              <div className="aspect-[4/5] w-full bg-[#f5e8e9]" />
              <div className="px-4 pt-3 pb-4">
                <div className="h-4 w-2/3 rounded bg-black/5" />
                <div className="mt-2 h-2.5 w-full rounded bg-black/[0.035]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {loadState === "error" && (
        <p className="mt-8 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          Couldn&rsquo;t load categories and tags. Please check your connection and try again.
        </p>
      )}

      {loadState === "ready" && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5">
          {cards.map((card, index) => {
            const theme = THEMES[index % THEMES.length];
            return (
              <Link
                key={`${card.kind}-${card.id}`}
                href={`/products?${card.kind}=${card.slug}`}
                className="group relative block overflow-hidden rounded-[1.5rem] bg-[#fdf8f2] shadow-[0_8px_22px_rgba(91,53,61,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_15px_28px_rgba(91,53,61,0.14)] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#df7296] focus-visible:ring-offset-4 focus-visible:outline-none"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ clipPath: TORN_EDGE }}>
                  <Image
                    src={card.image_url}
                    alt={card.name}
                    fill
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045] group-focus-visible:scale-[1.045]"
                  />
                </div>

                <div className="relative -mt-3 px-4 pt-2 pb-4">
                  <h3 className="flex items-center gap-1 font-serif text-xl font-semibold tracking-[-0.01em] text-[#281c20]">
                    {card.name}
                    <span style={{ color: theme.pillText }}>
                      <HeartIcon filled className="h-3.5 w-3.5" />
                    </span>
                  </h3>
                  <p className="mt-1 line-clamp-2 pr-11 text-sm leading-5 text-[var(--muted)]">{card.description}</p>

                  <span
                    className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm"
                    style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
