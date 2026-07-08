"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAllSizes } from "@/lib/data/products";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const SIZE_LABELS: Record<string, string> = {
  XS: "Extra Small",
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large",
  XXL: "Double XL",
  "3XL": "Triple XL",
};

export default function SelectSizePage() {
  const router = useRouter();
  const sizes = getAllSizes();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (!selected) return;
    router.push(`/products?size=${selected}`);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="mb-8 flex h-9 w-9 items-center justify-center text-black"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
          What&rsquo;s your
          <br />
          <span className="text-accent">usual size?</span>
        </h1>
        <svg
          className="h-14 w-14 shrink-0 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        >
          <path
            d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">
        We&rsquo;ll show you products that fit you best.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelected(size)}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl border py-6 transition ${
              selected === size
                ? "border-accent bg-accent-soft"
                : "border-black/10 hover:border-black/25"
            }`}
          >
            <span className="text-xl font-medium">{size}</span>
            <span className="text-[11px] text-[var(--muted)]">{SIZE_LABELS[size]}</span>
          </button>
        ))}
      </div>

      <Link
        href="/products"
        className="mt-6 flex items-center justify-between rounded-2xl bg-accent-soft px-5 py-4 text-left transition hover:brightness-95"
      >
        <span className="text-sm">
          <span className="font-medium">Not sure about size? </span>
          <span className="text-[var(--muted)]">Check our size guide to find your perfect fit.</span>
        </span>
        <svg className="h-4 w-4 shrink-0 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
        <span className="text-accent" aria-hidden="true">♡</span> We care about your comfort
      </p>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <a
        href={buildWhatsAppLink("Hi, I'm confused about which size to choose. Can you help me find my fit?")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 text-center text-xs text-[var(--muted)] underline underline-offset-2 hover:text-black"
      >
        I&rsquo;m confused
      </a>
    </div>
  );
}
