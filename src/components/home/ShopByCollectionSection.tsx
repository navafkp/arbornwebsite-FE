"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getExplore, type ExploreItem } from "@/lib/api-client";
import { BowIcon, CloudShape, FlowerIcon, HeartIcon, LeafIcon } from "@/components/ui/decor";

type CollectionCard = ExploreItem & { kind: "category" | "tag" };

const BADGE_ICONS: { match: RegExp; icon: (className: string) => React.ReactNode }[] = [
  { match: /korean/i, icon: (c) => <BowIcon className={c} /> },
  { match: /short|nighty/i, icon: (c) => <CloudShape className={c} /> },
  { match: /feed/i, icon: (c) => <HeartIcon className={c} /> },
  { match: /floral|flower/i, icon: (c) => <FlowerIcon className={c} /> },
  { match: /cotton|leaf/i, icon: (c) => <LeafIcon className={c} /> },
];

function CollectionBadge({ name }: { name: string }) {
  const match = BADGE_ICONS.find((b) => b.match.test(name));
  if (!match) return null;

  return (
    <span className="absolute bottom-0 left-1/2 flex h-[21px] w-[21px] -translate-x-1/2 items-center justify-center rounded-full bg-white text-accent shadow-sm">
      {match.icon("h-2.5 w-2.5")}
    </span>
  );
}

export default function ShopByCollectionSection() {
  const [cards, setCards] = useState<CollectionCard[]>([]);

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
    <div className="mt-[13.3px]">
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

      <div className="no-scrollbar mt-3.5 flex gap-4 overflow-x-auto pb-1">
        {cards.slice(0, 6).map((card) => (
          <Link
            key={`${card.kind}-${card.id}`}
            href={`/products?${card.kind}=${card.slug}`}
            className="flex w-[64.7px] shrink-0 flex-col items-center gap-1.5 text-center"
          >
            <span className="relative block h-[64.7px] w-[64.7px] overflow-hidden rounded-full border border-[#f2dfe2] bg-[#f8f1ef]">
              <Image src={card.image_url} alt={card.name} fill sizes="65px" className="object-cover" />
              <CollectionBadge name={card.name} />
            </span>
            <span className="line-clamp-2 text-[11px] leading-tight text-[#241a1d]">{card.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
