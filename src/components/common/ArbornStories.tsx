"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Story = {
  label: string;
  eyebrow: string;
  caption: string;
  accent: string;
  icon: "spark" | "camera" | "heart" | "style" | "gift";
};

const STORIES: Story[] = [
  { label: "New Arrivals", eyebrow: "Freshly landed", caption: "Soft new silhouettes for slow mornings and sweeter nights.", accent: "from-[#cf7186] via-[#f29a85] to-[#e9b968]", icon: "spark" },
  { label: "Behind the Scenes", eyebrow: "Inside Arborn", caption: "A quiet look at the details, fittings and hands behind every set.", accent: "from-[#d78699] via-[#df9f83] to-[#f0c77d]", icon: "camera" },
  { label: "Customer Love", eyebrow: "Worn & loved", caption: "Comfort notes and favourite fits, shared by the Arborn community.", accent: "from-[#bd6e80] via-[#e79499] to-[#e9bd7a]", icon: "heart" },
  { label: "Style Tips", eyebrow: "The nightwear edit", caption: "Small styling ideas to take your favourite co-ord beyond bedtime.", accent: "from-[#d2798e] via-[#e7a67f] to-[#f2cb82]", icon: "style" },
  { label: "Giveaway", eyebrow: "A little delight", caption: "Your next dreamy set could be on us. Tap through for this week’s treat.", accent: "from-[#bb657c] via-[#de8c91] to-[#eab875]", icon: "gift" },
];

const STORY_DURATION = 6000;

function StoryIcon({ type, className = "h-7 w-7" }: { type: Story["icon"]; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" {...common}>
      {type === "spark" && <><path d="M16 4l1.8 6.2L24 12l-6.2 1.8L16 20l-1.8-6.2L8 12l6.2-1.8L16 4Z" /><path d="m24.5 19 .9 3.1 3.1.9-3.1.9-.9 3.1-.9-3.1-3.1-.9 3.1-.9.9-3.1Z" /></>}
      {type === "camera" && <><rect x="4" y="9" width="24" height="17" rx="4" /><path d="m10 9 2-3h8l2 3" /><circle cx="16" cy="17.5" r="5" /></>}
      {type === "heart" && <path d="M27 10.8c0 7-11 13.2-11 13.2S5 17.8 5 10.8C5 7 9.7 4.8 12.8 8L16 11.1 19.2 8C22.3 4.8 27 7 27 10.8Z" />}
      {type === "style" && <><path d="M16 3.5c.8 6.8 3.7 10.1 10.5 11-6.8.8-9.7 4.2-10.5 11-.8-6.8-3.7-10.2-10.5-11 6.8-.9 9.7-4.2 10.5-11Z" /><path d="M25 4.5c.3 2.3 1.2 3.4 3.5 3.7-2.3.3-3.2 1.4-3.5 3.7-.3-2.3-1.2-3.4-3.5-3.7 2.3-.3 3.2-1.4 3.5-3.7Z" /></>}
      {type === "gift" && <><rect x="4" y="12" width="24" height="15" rx="2" /><path d="M3 12h26v-5H3v5ZM16 7v20" /><path d="M16 7c-1.3-4.2-7.2-5-7.2-1.6C8.8 7.3 11 7 16 7Zm0 0c1.3-4.2 7.2-5 7.2-1.6C23.2 7.3 21 7 16 7Z" /></>}
    </svg>
  );
}

export default function ArbornStories() {
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
    <section aria-labelledby="product-stories-title" className="mt-3 px-0.5 pt-2 pb-3 sm:mt-5 sm:px-1 sm:pt-3">
      <div className="flex items-center justify-between gap-4">
        <h2 id="product-stories-title" className="text-[15px] font-semibold tracking-[-0.015em] sm:text-base">Arborn Stories</h2>
        <button type="button" onClick={(event) => openStory(0, event.currentTarget)} className="group flex items-center gap-1 rounded-md px-1 py-1 text-xs font-medium text-[var(--accent-dark)] outline-none transition hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
          View all <span aria-hidden="true" className="text-base transition-transform group-hover:translate-x-0.5">›</span>
        </button>
      </div>
      <div className="no-scrollbar mt-3 flex snap-x gap-3.5 overflow-x-auto pb-0.5 sm:justify-between sm:gap-5">
        {STORIES.map((story, index) => (
          <button key={story.label} type="button" onClick={(event) => openStory(index, event.currentTarget)} aria-label={`Open story: ${story.label}`} className="group flex w-[66px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg outline-none sm:w-[78px]">
            <span className={`rounded-full bg-gradient-to-br ${story.accent} p-[2px] transition-transform duration-200 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]`}>
              <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[3px] border-white bg-[#fffaf5] text-[var(--foreground)] shadow-[0_2px_8px_rgba(121,68,80,0.12)] sm:h-16 sm:w-16">
                <StoryIcon type={story.icon} className="h-[25.2px] w-[25.2px] sm:h-[28.8px] sm:w-[28.8px]" />
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
            <div className="relative z-10 mt-auto px-8 pb-[max(72px,calc(env(safe-area-inset-bottom)+48px))] text-center sm:pb-16">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/45 bg-white/15 shadow-[0_20px_60px_rgba(47,16,24,.18)] backdrop-blur-sm"><StoryIcon type={activeStory.icon} className="h-12 w-12" /></span>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">{activeStory.eyebrow}</p>
              <h3 id="active-story-title" className="mt-2 font-serif text-4xl leading-none">{activeStory.label}</h3>
              <p id="active-story-caption" className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/90">{activeStory.caption}</p>
            </div>
            <button type="button" onClick={previous} aria-label="Previous story" className="absolute top-24 bottom-20 left-0 z-10 w-1/3 cursor-w-resize rounded-l-[28px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"><span className="sr-only">Previous story</span></button>
            <button type="button" onClick={next} aria-label={currentIndex === STORIES.length - 1 ? "Close after final story" : "Next story"} className="absolute top-24 right-0 bottom-20 z-10 w-1/3 cursor-e-resize rounded-r-[28px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"><span className="sr-only">Next story</span></button>
          </div>
        </div>
      )}
    </section>
  );
}
