"use client";

import Image from "next/image";
import Link from "next/link";
import type { ExploreItem } from "@/lib/api-client";
import { BowIcon, CloudShape, FlowerIcon, HeartIcon, LeafIcon } from "@/components/ui/decor";

export type CollectionCircle = ExploreItem & { kind: "category" | "tag" };

const BADGES: { match: RegExp; icon: (className: string) => React.ReactNode }[] = [
  { match: /korean/i, icon: (c) => <BowIcon className={c} /> },
  { match: /short|nighty/i, icon: (c) => <CloudShape className={c} /> },
  { match: /feed/i, icon: (c) => <HeartIcon className={c} /> },
  { match: /floral|flower/i, icon: (c) => <FlowerIcon className={c} /> },
  { match: /cotton|leaf/i, icon: (c) => <LeafIcon className={c} /> },
];

export default function CollectionCircleRail({ items, label = "Shop by collection" }: { items: CollectionCircle[]; label?: string }) {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1" role="list" aria-label={label}>
      {items.slice(0, 6).map((item) => {
        const badge = BADGES.find((candidate) => candidate.match.test(item.name));
        return (
          <Link key={`${item.kind}-${item.id}`} href={`/products?${item.kind}=${encodeURIComponent(item.slug)}`} role="listitem" className="group flex w-[59.3px] shrink-0 flex-col items-center gap-1.5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <span className="relative block h-[59.3px] w-[59.3px] overflow-hidden rounded-full border border-[#f2dfe2] bg-[#f8f1ef]">
              <Image src={item.image_url} alt="" fill sizes="59px" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
              {badge && <span className="absolute bottom-0 left-1/2 flex h-[19.2px] w-[19.2px] -translate-x-1/2 items-center justify-center rounded-full bg-white text-accent shadow-sm">{badge.icon("h-2.5 w-2.5")}</span>}
            </span>
            <span className="line-clamp-2 text-[11px] leading-tight text-[#241a1d]">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
