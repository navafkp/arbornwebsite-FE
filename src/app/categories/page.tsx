"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getExplore, type ExploreItem } from "@/lib/api-client";

type ExploreCard = ExploreItem & { kind: "category" | "tag" };

export default function CategoriesPage() {
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
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] text-[#241a1d] sm:text-4xl">Explore</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Find your perfect fit by category, mood, and moment.</p>
      </header>

      {loadState === "loading" && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-[1.35rem] bg-[#fffafa] p-1 shadow-[0_8px_22px_rgba(91,53,61,0.06)]">
              <div className="aspect-[4/5] w-full rounded-[1.1rem] bg-[#f5e8e9]" />
              <div className="px-2 pb-2 pt-3">
                <div className="h-3 w-2/3 rounded bg-black/5" />
                <div className="mt-2 h-2.5 w-full rounded bg-black/[0.035]" />
                <div className="mt-1.5 h-2.5 w-4/5 rounded bg-black/[0.035]" />
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
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {cards.map((card) => (
            <Link
              key={`${card.kind}-${card.id}`}
              href={`/products?${card.kind}=${card.slug}`}
              className="group block overflow-hidden rounded-[1.35rem] bg-[#fffafa] p-1 outline-none shadow-[0_8px_22px_rgba(91,53,61,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_15px_28px_rgba(91,53,61,0.14)] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#df7296] focus-visible:ring-offset-4"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.1rem] bg-[#f4e8e7]">
                <Image
                  src={card.image_url}
                  alt={card.name}
                  fill
                  sizes="(min-width: 640px) 30vw, 45vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045] group-focus-visible:scale-[1.045]"
                />
              </div>
              <div className="min-h-[5.6rem] px-2 pb-2 pt-3 sm:min-h-[5.85rem]">
                <span className="block h-5 truncate text-[15px] font-semibold leading-5 tracking-[-0.01em] text-[#281c20]">{card.name}</span>
                <span className="mt-1 block min-h-10 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{card.description}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
