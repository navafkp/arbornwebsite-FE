"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { setPreferredSize } from "@/lib/preferred-size";
import { getSizes, type BackendSize } from "@/lib/api-client";
import { BowIcon, SparkleIcon, HeartIcon, CloudShape, BunnyIllustration } from "@/components/ui/decor";
import ScrollHint from "@/components/ui/ScrollHint";

export default function SelectSizePage() {
  const router = useRouter();
  const [sizes, setSizes] = useState<BackendSize[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<number | null>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getSizes()
      .then((data) => {
        setSizes(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  function handleContinue() {
    if (!selected) return;
    // /products reads this size_code straight into the real products API
    // (?size=<code>), so store the code itself rather than the display text.
    setPreferredSize(String(selected));
    router.push(`/products?size=${selected}`);
  }

  function handleSelectSize(sizeCode: number) {
    setSelected(sizeCode);
    continueRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-xl flex-col overflow-hidden px-4 py-5 sm:px-6">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent-dark"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-2xl leading-tight font-bold sm:text-3xl">
          What&rsquo;s your
          <br />
          <span className="text-accent">bust size?</span>{" "}
          <HeartIcon filled className="inline h-5 w-5 text-accent align-middle" />
        </h1>
        <BunnyIllustration className="h-16 w-16 shrink-0" />
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--muted)]">
        Choose your bust size for the best fit.
        <HeartIcon className="h-3.5 w-3.5 text-accent" />
      </p>

      {loadState === "loading" && (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[74px] animate-pulse rounded-2xl bg-black/5" />
          ))}
        </div>
      )}

      {loadState === "error" && (
        <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
          Couldn&rsquo;t load sizes. Please check your connection and try again.
        </p>
      )}

      {loadState === "ready" && (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {sizes.map(({ size_code, display_text, measurement }) => (
            <button
              key={size_code}
              type="button"
              onClick={() => handleSelectSize(size_code)}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-2xl border py-3 transition ${
                selected === size_code
                  ? "border-accent bg-accent-soft"
                  : "border-black/10 hover:border-black/25"
              }`}
            >
              {selected === size_code && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <BowIcon className="h-4 w-4 text-accent" />
              <span className="text-base font-medium">{display_text}</span>
              <span className="text-[10px] text-[var(--muted)]">{measurement}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-accent/40 px-4 py-3.5">
        <span className="mt-0.5 text-accent">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 4h16v6a8 8 0 01-16 0V4z" strokeLinejoin="round" />
            <path d="M8 4v3M12 4v4M16 4v3" strokeLinecap="round" />
          </svg>
        </span>
        <p className="text-sm">
          If your lower body is heavier,{" "}
          <span className="font-medium text-accent">choose one size bigger.</span>{" "}
          <HeartIcon filled className="inline h-3 w-3 text-accent" />
        </p>
      </div>

      <a
        href={buildWhatsAppLink("Hi, I'm not sure about my size — could you help me find the right fit?")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-3 rounded-2xl bg-accent-soft px-4 py-4 text-left transition hover:brightness-95"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-accent">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.8A8 8 0 1121 12z" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="flex-1 text-sm">
          <span className="font-medium">Not sure about your size or buying for someone else?</span>{" "}
          <span className="text-[var(--muted)]">Message us—we&rsquo;ll guide you</span>{" "}
          <HeartIcon filled className="inline h-3 w-3 text-accent" />
        </span>
        <svg className="h-4 w-4 shrink-0 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <div className="mt-3 rounded-2xl border border-dashed border-black/15 px-4 py-3.5">
        <p className="flex items-center gap-2 text-sm font-medium text-accent">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="5" y="4" width="14" height="17" rx="2" />
            <path d="M9 3h6v3H9z" />
            <path d="M9 11h6M9 15h4" strokeLinecap="round" />
          </svg>
          Important
        </p>
        <p className="mt-1.5 text-xs text-[var(--muted)]">
          This is a loose-fit model. Sizes are for bust/bra size reference only, not exact dress
          measurements. <HeartIcon filled className="inline h-3 w-3 text-accent" />
        </p>
      </div>

      <button
        ref={continueRef}
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <CloudShape className="pointer-events-none absolute -bottom-2 -left-4 h-10 w-24 text-accent-soft" />
      <SparkleIcon className="pointer-events-none absolute right-6 bottom-16 h-4 w-4 text-accent/60" />

      <ScrollHint className="bottom-4" />
    </div>
  );
}
