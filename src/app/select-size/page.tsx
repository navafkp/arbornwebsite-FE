"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getPreferredSizes, setPreferredSizes, clearPreferredSize, markSizeDecisionMade } from "@/lib/preferred-size";
import { getSizes, type BackendSize } from "@/lib/api-client";
import { BowIcon, SparkleIcon, HeartIcon, CloudShape, BunnyIllustration } from "@/components/ui/decor";
import ScrollHint from "@/components/ui/ScrollHint";
import { useToast } from "@/lib/toast-context";

export default function SelectSizePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sizes, setSizes] = useState<BackendSize[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<number[]>([]);
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    getSizes()
      .then((data) => {
        setSizes(data);
        setLoadState("ready");
        // Pre-select whatever size is already stored, so re-opening this
        // page (e.g. via "Change size") shows the current choice instead
        // of nothing — and picking a different one still overwrites it.
        const preferred = getPreferredSizes();
        if (preferred.length > 0) {
          const knownCodes = new Set(data.flatMap((s) => s.codes));
          const validSelected = preferred.filter((p) => knownCodes.has(p));
          setSelected(validSelected);
        }
      })
      .catch(() => setLoadState("error"));
  }, []);

  function handleContinue() {
    if (selected.length === 0) return;
    setPreferredSizes(selected);
    markSizeDecisionMade();
    showToast("Size updated");
    router.replace(`/products?size=${selected.join(",")}`);
  }

  function isSizeSelected(size: BackendSize) {
    return size.codes.every((code) => selected.includes(code));
  }

  // A grouped entry (e.g. "Plus Size") toggles every underlying code
  // together — picking it sends all of them to the backend at once, since
  // that's the whole reason it needs the codes list instead of a single
  // size_code.
  function handleSelectSize(size: BackendSize) {
    setSelected((prev) =>
      isSizeSelected(size)
        ? prev.filter((code) => !size.codes.includes(code))
        : Array.from(new Set([...prev, ...size.codes])),
    );
  }

  function handleClose() {
    markSizeDecisionMade();
    showToast("Size updated");
    // Closing with a size already picked (just not confirmed via Continue)
    // should still honor that choice, not silently discard it.
    if (selected.length > 0) {
      setPreferredSizes(selected);
      router.replace(`/products?size=${selected.join(",")}`);
      return;
    }
    clearPreferredSize();
    router.replace("/products");
  }

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 flex h-[67px] items-center justify-end bg-background px-4">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-dark"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col overflow-hidden px-4 pt-[87px] pb-5 sm:px-6">
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
              <div key={i} className="h-[58px] animate-pulse rounded-xl bg-black/5" />
            ))}
          </div>
        )}

        {loadState === "error" && (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-4 py-3.5 text-sm text-[var(--muted)]">
            Couldn&rsquo;t load sizes. Please check your connection and try again.
          </p>
        )}

        {loadState === "ready" && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size.size_code}
                type="button"
                onClick={() => handleSelectSize(size)}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl border py-2 transition ${isSizeSelected(size)
                  ? "border-accent bg-accent-soft"
                  : "border-black/10 hover:border-black/25"
                  }`}
              >
                {isSizeSelected(size) && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <BowIcon className="h-3 w-3 text-accent" />
                <span className="text-sm font-medium">{size.display_text}</span>
                {size.measurement && <span className="text-[10px] text-[var(--muted)]">{size.measurement}</span>}
              </button>
            ))}
          </div>
        )}

        {selected.length > 0 && (
          <p className="mt-2 flex items-center gap-1 text-xs text-[var(--muted)]">
            Tap again to<span className="font-semibold text-accent">remove size ⭐</span>
          </p>
        )}

        {/* Tip + accordion */}
        <div className="mt-3 rounded-xl border border-dashed border-accent/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setAccordionOpen((o) => !o)}
            className="flex w-full items-start gap-3 px-4 py-3 text-left"
          >
            <span className="mt-0.5 shrink-0 text-accent">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 4h16v6a8 8 0 01-16 0V4z" strokeLinejoin="round" />
                <path d="M8 4v3M12 4v4M16 4v3" strokeLinecap="round" />
              </svg>
            </span>
            <p className="flex-1 text-sm">
              If your lower body is heavier,{" "}
              <span className="font-medium text-accent">choose one size bigger.</span>{" "}
              Still confused?{" "}
              <span className="font-medium">Have a look at measurements in detail</span>
            </p>
            <svg
              className={`h-4 w-4 shrink-0 text-black/40 transition-transform mt-0.5 ${accordionOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {accordionOpen && (
            <div className="border-t border-accent/20 px-4 pb-3">
              <table className="mt-2 w-full text-xs">
                <thead>
                  <tr className="text-left text-[var(--muted)]">
                    <th className="pb-1.5 font-medium">Size</th>
                    <th className="pb-1.5 font-medium">Bust (in)</th>
                    <th className="pb-1.5 font-medium">Hip (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {[
                    { size: "M", bust: "34–36", hip: "36–38" },
                    { size: "L", bust: "37–39", hip: "39–41" },
                    { size: "XL", bust: "40–42", hip: "42–44" },
                    { size: "XXL", bust: "43–45", hip: "45–47" },
                    { size: "XXXL", bust: "46–48", hip: "48–50" },
                  ].map((row) => (
                    <tr key={row.size}>
                      <td className="py-1.5 font-medium">{row.size}</td>
                      <td className="py-1.5 text-[var(--muted)]">{row.bust}</td>
                      <td className="py-1.5 text-[var(--muted)]">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

        {selected.length > 0 && <div className="h-20" aria-hidden="true" />}

        <CloudShape className="pointer-events-none absolute -bottom-2 -left-4 h-10 w-24 text-accent-soft" />
        <SparkleIcon className="pointer-events-none absolute right-6 bottom-16 h-4 w-4 text-accent/60" />

        <ScrollHint className="bottom-4" />
      </div>

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-background px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6">
          <div className="mx-auto max-w-xl">
            <button
              type="button"
              onClick={handleContinue}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-xs font-medium tracking-widest text-white uppercase transition hover:bg-accent-dark"
            >
              Continue
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
