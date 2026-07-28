"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getStories, type ApiStoryCircle } from "@/lib/api-client";

const DEFAULT_STORY_DURATION = 6000;
const RING_GRADIENT = "from-[#cf7186] via-[#f29a85] to-[#e9b968]";

export default function ArbornStories({ compactBubbles = false }: { compactBubbles?: boolean }) {
  const [circles, setCircles] = useState<ApiStoryCircle[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [activeCircleIndex, setActiveCircleIndex] = useState<number | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    getStories()
      .then((data) => {
        setCircles(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  const openStory = (circleIndex: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setActiveCircleIndex(circleIndex);
    setActiveStoryIndex(0);
  };
  const closeStory = useCallback(() => setActiveCircleIndex(null), []);

  const previous = useCallback(() => {
    setActiveCircleIndex((circleIndex) => {
      if (circleIndex === null) return null;
      if (activeStoryIndex > 0) {
        setActiveStoryIndex((i) => i - 1);
        return circleIndex;
      }
      if (circleIndex > 0) {
        setActiveStoryIndex(circles[circleIndex - 1].stories.length - 1);
        return circleIndex - 1;
      }
      return circleIndex;
    });
  }, [activeStoryIndex, circles]);

  const next = useCallback(() => {
    setActiveCircleIndex((circleIndex) => {
      if (circleIndex === null) return null;
      const circle = circles[circleIndex];
      if (activeStoryIndex < circle.stories.length - 1) {
        setActiveStoryIndex((i) => i + 1);
        return circleIndex;
      }
      if (circleIndex < circles.length - 1) {
        setActiveStoryIndex(0);
        return circleIndex + 1;
      }
      return null;
    });
  }, [activeStoryIndex, circles]);

  const isOpen = activeCircleIndex !== null;

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

  const activeCircle = activeCircleIndex === null ? null : circles[activeCircleIndex];
  const activeStory = activeCircle ? activeCircle.stories[activeStoryIndex] : null;
  const storyDuration = activeStory?.duration_ms ?? DEFAULT_STORY_DURATION;

  useEffect(() => {
    if (!activeStory || reduceMotion || !pageVisible) return;
    const timer = window.setTimeout(next, storyDuration);
    return () => window.clearTimeout(timer);
  }, [activeStory, next, pageVisible, reduceMotion, storyDuration]);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, closeStory, next, previous]);

  if (loadState !== "ready" && circles.length === 0) {
    if (loadState === "error") return null;
    return (
      <section className={`px-0.5 sm:px-1 ${compactBubbles ? "mt-[3.6px] pt-0 pb-0" : "mt-3 pt-2 pb-3 sm:mt-5 sm:pt-3"}`}>
        <div className={`flex gap-3.5 sm:gap-5 ${compactBubbles ? "justify-between" : ""}`}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`shrink-0 animate-pulse rounded-full bg-black/5 ${compactBubbles ? "h-[35.6px] w-[35.6px] sm:h-[38.6px] sm:w-[38.6px]" : "h-[66.9px] w-[66.9px] sm:h-[73.2px] sm:w-[73.2px]"}`}
            />
          ))}
        </div>
      </section>
    );
  }

  if (circles.length === 0) return null;

  return (
    <section
      aria-labelledby="product-stories-title"
      className={`px-0.5 sm:px-1 ${compactBubbles ? "mt-[3.6px] pt-0 pb-0" : "mt-3 pt-2 pb-3 sm:mt-5 sm:pt-3"}`}
      style={compactBubbles ? undefined : { marginLeft: "-2.5%", marginRight: "-2.5%" }}
    >
      <div className="flex items-center gap-3 text-accent">
        <span className="h-px flex-1 bg-[#d9c6c1]" />
        <h2 id="product-stories-title" className="shrink-0 text-xs font-medium tracking-[0.12em] uppercase sm:text-sm">
          Arborn Stories
        </h2>
        <span className="h-px flex-1 bg-[#d9c6c1]" />
      </div>
      <div
        className="no-scrollbar mt-[10.8px] flex snap-x gap-3.5 overflow-x-auto pb-0.5 sm:justify-between sm:gap-5"
      >
        {circles.map((circle, index) => (
          <button key={circle.id} type="button" onClick={(event) => openStory(index, event.currentTarget)} aria-label={`Open story: ${circle.label}`} className={`group flex shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg outline-none ${compactBubbles ? "w-[41.6px] sm:w-[49.1px]" : "w-[69.3px] sm:w-[81.9px]"}`}>
            <span className={`rounded-full bg-gradient-to-br ${RING_GRADIENT} p-[2px] transition-transform duration-200 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]`}>
              <span className={`relative flex items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#fffaf5] shadow-[0_2px_8px_rgba(121,68,80,0.12)] ${compactBubbles ? "h-[29.6px] w-[29.6px] sm:h-[32.6px] sm:w-[32.6px]" : "h-[67px] w-[67px] sm:h-[73.9px] sm:w-[73.9px]"}`}>
                <Image src={circle.cover_image_url} alt="" fill sizes="80px" className="object-cover" />
              </span>
            </span>
            <span className="min-h-[27px] text-center text-[10.5px] font-medium leading-[1.25] text-[var(--foreground)] sm:text-[11px]">{circle.label}</span>
          </button>
        ))}
      </div>

      {activeCircle && activeStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1115]/90 p-0 backdrop-blur-[2px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeStory(); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="active-story-title" aria-describedby="active-story-caption" className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-black text-white shadow-2xl sm:h-[min(820px,90dvh)] sm:rounded-[28px]">
            <Image src={activeStory.image_url} alt="" fill sizes="430px" priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/75" />
            <div className="relative z-10 flex gap-1.5 px-3 pt-[max(12px,env(safe-area-inset-top))] sm:pt-4">
              {activeCircle.stories.map((story, index) => (
                <span key={story.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
                  {index < activeStoryIndex && <span className="block h-full w-full bg-white" />}
                  {index === activeStoryIndex && <span key={`${activeStoryIndex}-${pageVisible}`} className={`block h-full bg-white ${reduceMotion || !pageVisible ? "w-0" : "animate-story-progress"}`} style={{ animationDuration: `${storyDuration}ms` }} />}
                </span>
              ))}
            </div>
            <header className="relative z-20 flex items-center gap-3 px-4 pt-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/15">
                <Image src={activeCircle.cover_image_url} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <div className="min-w-0"><p className="truncate text-xs font-semibold">Arborn Stories</p><p className="text-[10px] text-white/75">{activeStory.eyebrow}</p></div>
              <button ref={closeRef} type="button" onClick={closeStory} aria-label="Close stories" className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"><span aria-hidden="true" className="text-3xl font-light leading-none">×</span></button>
            </header>
            <div className="relative z-20 mt-auto px-8 pb-[max(72px,calc(env(safe-area-inset-bottom)+48px))] text-center sm:pb-16">
              <h3 id="active-story-title" className="font-serif text-3xl leading-tight">{activeCircle.label}</h3>
              <p id="active-story-caption" className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/90">{activeStory.caption}</p>
              {activeStory.cta_label && activeStory.cta_link && (
                <a
                  href={activeStory.cta_link}
                  className="relative z-30 mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-[var(--accent-dark)] shadow-[0_8px_24px_rgba(56,20,29,0.18)] outline-none transition hover:bg-[#fff8f5] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--accent-dark)]"
                >
                  {activeStory.cta_label}
                </a>
              )}
            </div>
            <button type="button" onClick={previous} aria-label="Previous story" className="absolute top-24 bottom-20 left-0 z-10 w-1/3 cursor-w-resize rounded-l-[28px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"><span className="sr-only">Previous story</span></button>
            <button type="button" onClick={next} aria-label={activeCircleIndex === circles.length - 1 && activeStoryIndex === activeCircle.stories.length - 1 ? "Close after final story" : "Next story"} className="absolute top-24 right-0 bottom-20 z-10 w-1/3 cursor-e-resize rounded-r-[28px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"><span className="sr-only">Next story</span></button>
          </div>
        </div>
      )}
    </section>
  );
}
