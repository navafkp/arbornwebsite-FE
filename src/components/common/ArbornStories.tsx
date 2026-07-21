"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeartIcon } from "@/components/ui/decor";

type Story = {
  label: string;
  eyebrow: string;
  caption: string;
  accent: string;
  icon: "spark" | "camera" | "heart" | "style" | "gift";
  cta?: { label: string; href: string };
};

const STORIES: Story[] = [
  { label: "New Arrivals", eyebrow: "Freshly landed", caption: "Soft new silhouettes for slow mornings and sweeter nights.", accent: "from-[#cf7186] via-[#f29a85] to-[#e9b968]", icon: "spark", cta: { label: "Shop this look", href: "/products/detail?slug=korean-pajama-set" } },
  { label: "Founder Fav", eyebrow: "Inside Arborn", caption: "A quiet look at the details, fittings and hands behind every set.", accent: "from-[#d78699] via-[#df9f83] to-[#f0c77d]", icon: "camera" },
  { label: "Customer Love", eyebrow: "Worn & loved", caption: "Comfort notes and favourite fits, shared by the Arborn community.", accent: "from-[#bd6e80] via-[#e79499] to-[#e9bd7a]", icon: "heart" },
  { label: "Style Tips", eyebrow: "The nightwear edit", caption: "Small styling ideas to take your favourite co-ord beyond bedtime.", accent: "from-[#d2798e] via-[#e7a67f] to-[#f2cb82]", icon: "style" },
  { label: "Giveaway", eyebrow: "A little delight", caption: "Your next dreamy set could be on us. Tap through for this week’s treat.", accent: "from-[#bb657c] via-[#de8c91] to-[#eab875]", icon: "gift" },
];

const STORY_DURATION = 6000;

function StoryIcon({ type, className = "h-7 w-7", solid = false }: { type: Story["icon"]; className?: string; solid?: boolean }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" {...common}>
      {solid ? (
        <>
          {type === "spark" && <><path fill="currentColor" stroke="none" d="M16 3.5c.9 6.6 3.8 9.5 10.5 10.5-6.7 1-9.6 3.9-10.5 10.5C15.1 17.9 12.2 15 5.5 14 12.2 13 15.1 10.1 16 3.5Z" /><path fill="currentColor" stroke="none" d="M25.5 20c.3 2.3 1.3 3.3 3.5 3.7-2.2.3-3.2 1.4-3.5 3.7-.3-2.3-1.3-3.4-3.5-3.7 2.2-.4 3.2-1.4 3.5-3.7Z" /></>}
          {type === "camera" && <><path fill="currentColor" stroke="none" d="M8 8h2l2-3h8l2 3h2a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z" /><circle cx="16" cy="17.5" r="5.2" fill="#fffaf5" stroke="none" /><circle cx="16" cy="17.5" r="2.8" fill="currentColor" stroke="none" /></>}
          {type === "heart" && <path fill="currentColor" stroke="none" d="M27 10.8c0 7-11 13.2-11 13.2S5 17.8 5 10.8C5 7 9.7 4.8 12.8 8L16 11.1 19.2 8C22.3 4.8 27 7 27 10.8Z" />}
          {type === "style" && <><path fill="currentColor" stroke="none" d="M16 3.5c.8 6.8 3.7 10.1 10.5 11-6.8.8-9.7 4.2-10.5 11-.8-6.8-3.7-10.2-10.5-11 6.8-.9 9.7-4.2 10.5-11Z" /><path fill="currentColor" stroke="none" d="M25 4.5c.3 2.3 1.2 3.4 3.5 3.7-2.3.3-3.2 1.4-3.5 3.7-.3-2.3-1.2-3.4-3.5-3.7 2.3-.3 3.2-1.4 3.5-3.7Z" /></>}
          {type === "gift" && <><path fill="currentColor" stroke="none" d="M4 11h24v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V11Z" /><rect x="2.5" y="7" width="27" height="6" rx="2" fill="currentColor" stroke="none" /><path d="M16 7c-1.2-4.2-7.2-5-7.2-1.7C8.8 7.2 11 7 16 7Zm0 0c1.2-4.2 7.2-5 7.2-1.7C23.2 7.2 21 7 16 7Z" fill="currentColor" /><path d="M16 11v17M4 13h24" stroke="#fffaf5" strokeWidth="2" /></>}
        </>
      ) : (
        <>
          {type === "spark" && <><path d="M16 4l1.8 6.2L24 12l-6.2 1.8L16 20l-1.8-6.2L8 12l6.2-1.8L16 4Z" /><path d="m24.5 19 .9 3.1 3.1.9-3.1.9-.9 3.1-.9-3.1-3.1-.9 3.1-.9.9-3.1Z" /></>}
          {type === "camera" && <><rect x="4" y="9" width="24" height="17" rx="4" /><path d="m10 9 2-3h8l2 3" /><circle cx="16" cy="17.5" r="5" /></>}
          {type === "heart" && <path d="M27 10.8c0 7-11 13.2-11 13.2S5 17.8 5 10.8C5 7 9.7 4.8 12.8 8L16 11.1 19.2 8C22.3 4.8 27 7 27 10.8Z" />}
          {type === "style" && <><path d="M16 3.5c.8 6.8 3.7 10.1 10.5 11-6.8.8-9.7 4.2-10.5 11-.8-6.8-3.7-10.2-10.5-11 6.8-.9 9.7-4.2 10.5-11Z" /><path d="M25 4.5c.3 2.3 1.2 3.4 3.5 3.7-2.3.3-3.2 1.4-3.5 3.7-.3-2.3-1.2-3.4-3.5-3.7 2.3-.3 3.2-1.4 3.5-3.7Z" /></>}
          {type === "gift" && <><rect x="4" y="12" width="24" height="15" rx="2" /><path d="M3 12h26v-5H3v5ZM16 7v20" /><path d="M16 7c-1.3-4.2-7.2-5-7.2-1.6C8.8 7.3 11 7 16 7Zm0 0c1.3-4.2 7.2-5 7.2-1.6C23.2 7.3 21 7 16 7Z" /></>}
        </>
      )}
    </svg>
  );
}

export default function ArbornStories({ compactBubbles = false }: { compactBubbles?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const openStory = (index: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setActiveIndex(index);
  };
  const closeStory = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => setActiveIndex((index) => index === null ? null : (index - 1 + STORIES.length) % STORIES.length), []);
  const next = useCallback(() => setActiveIndex((index) => index === null ? null : index === STORIES.length - 1 ? null : index + 1), []);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex === null || reduceMotion || !pageVisible) return;
    const timer = window.setTimeout(next, STORY_DURATION);
    return () => window.clearTimeout(timer);
  }, [activeIndex, next, pageVisible, reduceMotion]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeStory();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, closeStory, next, previous]);

  const activeStory = activeIndex === null ? null : STORIES[activeIndex];
  const currentIndex = activeIndex ?? -1;

  return (
    <section aria-labelledby="product-stories-title" className={`px-0.5 sm:px-1 ${compactBubbles ? "mt-[3.6px] pt-0 pb-0" : "mt-3 pt-2 pb-3 sm:mt-5 sm:pt-3"}`}>
      <div className="flex items-center gap-4">
        <h2 id="product-stories-title" className={`flex items-center gap-1.5 font-serif ${compactBubbles ? "text-base" : "text-2xl"}`}>
          Arborn Stories
          <HeartIcon filled className={compactBubbles ? "h-2.5 w-2.5 text-accent" : "h-4 w-4 text-accent"} />
        </h2>
      </div>
      <div className={`no-scrollbar mt-[10.8px] flex snap-x gap-3.5 overflow-x-auto pb-0.5 sm:gap-5 ${compactBubbles ? "justify-between" : "sm:justify-between"}`}>
        {STORIES.map((story, index) => (
          <button key={story.label} type="button" onClick={(event) => openStory(index, event.currentTarget)} aria-label={`Open story: ${story.label}`} className={`group flex shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg outline-none ${compactBubbles ? "w-[41.6px] sm:w-[49.1px]" : "w-[69.3px] sm:w-[81.9px]"}`}>
            <span className={`rounded-full bg-gradient-to-br ${story.accent} p-[2px] transition-transform duration-200 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]`}>
              <span className={`flex items-center justify-center rounded-full border-[3px] border-white bg-[#fffaf5] text-accent shadow-[0_2px_8px_rgba(121,68,80,0.12)] ${compactBubbles ? "h-[29.6px] w-[29.6px] sm:h-[32.6px] sm:w-[32.6px]" : "h-[60.9px] w-[60.9px] sm:h-[67.2px] sm:w-[67.2px]"}`}>
                <StoryIcon solid type={story.icon} className={compactBubbles ? "h-[12.8px] w-[12.8px] sm:h-[14.7px] sm:w-[14.7px]" : "h-[26.5px] w-[26.5px] sm:h-[30.2px] sm:w-[30.2px]"} />
              </span>
            </span>
            <span className="min-h-[27px] text-center text-[10.5px] font-medium leading-[1.25] text-[var(--foreground)] sm:text-[11px]">{story.label}</span>
          </button>
        ))}
      </div>

      {activeStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1115]/90 p-0 backdrop-blur-[2px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeStory(); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="active-story-title" aria-describedby="active-story-caption" className={`relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-gradient-to-b ${activeStory.accent} text-white shadow-2xl sm:h-[min(820px,90dvh)] sm:rounded-[28px]`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(255,255,255,.32),transparent_28%),linear-gradient(180deg,rgba(62,26,34,.05),rgba(46,18,25,.5))]" />
            <div className="relative z-10 flex gap-1.5 px-3 pt-[max(12px,env(safe-area-inset-top))] sm:pt-4">
              {STORIES.map((story, index) => (
                <span key={story.label} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
                  {index < currentIndex && <span className="block h-full w-full bg-white" />}
                  {index === currentIndex && <span key={`${currentIndex}-${pageVisible}`} className={`block h-full bg-white ${reduceMotion || !pageVisible ? "w-0" : "animate-story-progress"}`} style={{ animationDuration: `${STORY_DURATION}ms` }} />}
                </span>
              ))}
            </div>
            <header className="relative z-20 flex items-center gap-3 px-4 pt-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/15"><StoryIcon type={activeStory.icon} className="h-5 w-5" /></span>
              <div className="min-w-0"><p className="truncate text-xs font-semibold">Arborn Stories</p><p className="text-[10px] text-white/75">{activeStory.eyebrow}</p></div>
              <button ref={closeRef} type="button" onClick={closeStory} aria-label="Close stories" className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"><span aria-hidden="true" className="text-3xl font-light leading-none">×</span></button>
            </header>
            <div className="relative z-20 mt-auto px-8 pb-[max(72px,calc(env(safe-area-inset-bottom)+48px))] text-center sm:pb-16">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/45 bg-white/15 shadow-[0_20px_60px_rgba(47,16,24,.18)] backdrop-blur-sm"><StoryIcon type={activeStory.icon} className="h-12 w-12" /></span>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">{activeStory.eyebrow}</p>
              <h3 id="active-story-title" className="mt-2 font-serif text-4xl leading-none">{activeStory.label}</h3>
              <p id="active-story-caption" className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/90">{activeStory.caption}</p>
              {activeStory.cta && (
                <Link
                  href={activeStory.cta.href}
                  className="relative z-30 mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-[var(--accent-dark)] shadow-[0_8px_24px_rgba(56,20,29,0.18)] outline-none transition hover:bg-[#fff8f5] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--accent-dark)]"
                >
                  {activeStory.cta.label}
                </Link>
              )}
            </div>
            <button type="button" onClick={previous} aria-label="Previous story" className="absolute top-24 bottom-20 left-0 z-10 w-1/3 cursor-w-resize rounded-l-[28px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"><span className="sr-only">Previous story</span></button>
            <button type="button" onClick={next} aria-label={currentIndex === STORIES.length - 1 ? "Close after final story" : "Next story"} className="absolute top-24 right-0 bottom-20 z-10 w-1/3 cursor-e-resize rounded-r-[28px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"><span className="sr-only">Next story</span></button>
          </div>
        </div>
      )}
    </section>
  );
}
