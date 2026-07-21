"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getExplore } from "@/lib/api-client";
import { HeartIcon } from "@/components/ui/decor";
import CollectionCircleRail, { type CollectionCircle } from "@/components/common/CollectionCircleRail";

export default function ShopByCollectionSection() {
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

  if (cards.length === 0) return null;

  return (
    <div className="mt-[7.6px]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-serif text-2xl">
          Shop by Collection
          <HeartIcon filled className="h-4 w-4 text-accent" />
        </h2>
        <Link href="/categories" className="flex items-center gap-1 text-xs font-medium text-accent">
          View all
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="mt-3.5" style={{ marginLeft: "-2.5%", marginRight: "-2.5%" }}><CollectionCircleRail items={cards} /></div>
    </div>
  );
}
