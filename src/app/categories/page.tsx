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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">Categories</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Find your perfect fit by category.</p>

      {loadState === "loading" && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] w-full animate-pulse rounded-xl bg-black/5" />
          ))}
        </div>
      )}

      {loadState === "error" && (
        <p className="mt-8 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          Couldn&rsquo;t load categories and tags. Please check your connection and try again.
        </p>
      )}

      {loadState === "ready" && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={`${card.kind}-${card.id}`}
              href={`/products?${card.kind}=${card.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f4f2ee]">
                <Image
                  src={card.image_url}
                  alt={card.name}
                  fill
                  sizes="(min-width: 640px) 30vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="mt-3 text-sm tracking-wide text-black">{card.name}</span>
              <span className="mt-0.5 text-xs text-[var(--muted)]">{card.description}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
