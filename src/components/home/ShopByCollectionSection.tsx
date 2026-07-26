"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getExplore } from "@/lib/api-client";
import CollectionCircleRail, { type CollectionCircle } from "@/components/common/CollectionCircleRail";

export default function ShopByCollectionSection({
  activeCategory,
  activeTag,
}: {
  activeCategory?: string;
  activeTag?: string;
} = {}) {
  const [cards, setCards] = useState<CollectionCircle[]>([]);

  useEffect(() => {
    getExplore()
      .then(({ categories, tags }) => {
        setCards([
          ...categories.map((c) => ({ ...c, kind: "category" as const })),
          ...tags.map((t) => ({ ...t, kind: "tag" as const })),
        ]);
      })
      .catch(() => setCards([]));
  }, []);

  return (
    <div className="mt-[7.6px]">
      <div className="relative flex items-center gap-3 text-accent">
        <span className="h-px flex-1 bg-[#d9c6c1]" />
        <h2 className="shrink-0 text-xs font-medium tracking-[0.12em] uppercase sm:text-sm">
          Shop by Collection
        </h2>
        <span className="h-px flex-1 bg-[#d9c6c1]" />
        {cards.length > 6 && (
          <Link
            href="/categories"
            className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-1 bg-background pl-2 text-xs font-medium text-accent"
          >
            View all
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>

      {cards.length > 0 ? (
        <div className="mt-6" style={{ marginLeft: "-2.5%", marginRight: "-2.5%" }}>
          <CollectionCircleRail items={cards} activeCategory={activeCategory} activeTag={activeTag} />
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          No collections found here yet.
        </p>
      )}
    </div>
  );
}
