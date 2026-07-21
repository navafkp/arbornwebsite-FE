"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "@/components/ui/decor";

// TEMP: 5 static stories until the backend has an admin-managed stories
// endpoint (photos/short videos uploaded by an admin). Swap this array for
// real API data once that exists — the viewer below doesn't need to change.
interface Story {
  id: number;
  label: string;
  gradient: string;
  caption: string;
}

const STORIES: Story[] = [
  { id: 1, label: "New Arrivals", gradient: "from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", caption: "Fresh styles just landed" },
  { id: 2, label: "Behind the Scenes", gradient: "from-[#a1c4fd] to-[#c2e9fb]", caption: "A peek into how Arborn is made" },
  { id: 3, label: "Customer Love", gradient: "from-[#fbc2eb] to-[#a6c1ee]", caption: "Real stories from real customers" },
  { id: 4, label: "Style Tips", gradient: "from-[#fddb92] to-[#d1fdff]", caption: "How to style your favourite set" },
  { id: 5, label: "Just In", gradient: "from-[#e0c3fc] to-[#8ec5fc]", caption: "This week's newest drop" },
];

const STORY_DURATION_MS = 5000;

export default function ArbornStoriesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const timer = setTimeout(() => {
      setActiveIndex((current) => {
        if (current === null) return current;
        return current + 1 < STORIES.length ? current + 1 : null;
      });
    }, STORY_DURATION_MS);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const activeStory = activeIndex !== null ? STORIES[activeIndex] : null;

  return (
    <div className="mt-6">
      <h2 className="flex items-center gap-1.5 font-serif text-2xl">
        Arborn Stories
        <HeartIcon filled className="h-4 w-4 text-accent" />
      </h2>

      <div className="no-scrollbar mt-3.5 flex gap-4 overflow-x-auto pb-1">
        {STORIES.map((story, index) => (
          <button
            key={story.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-center"
          >
            <span className={`block rounded-full bg-gradient-to-br p-[2px] ${story.gradient}`}>
              <span className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ring-2 ring-white ${story.gradient}`}>
                <HeartIcon filled className="h-5 w-5 text-white/90" />
              </span>
            </span>
            <span className="line-clamp-2 text-[11px] leading-tight text-[#241a1d]">{story.label}</span>
          </button>
        ))}
      </div>

      {activeStory && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className={`relative flex h-[80vh] w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-center text-white ${activeStory.gradient}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 left-3 flex gap-1">
              {STORIES.map((story, i) => (
                <span key={story.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                  {i < activeIndex! && <span className="block h-full w-full bg-white" />}
                  {i === activeIndex && (
                    <span
                      className="animate-story-progress block h-full bg-white"
                      style={{ animationDuration: `${STORY_DURATION_MS}ms` }}
                    />
                  )}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close story"
              className="absolute top-6 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <HeartIcon filled className="h-8 w-8" />
            <p className="mt-4 font-serif text-xl">{activeStory.label}</p>
            <p className="mt-2 text-sm text-white/90">{activeStory.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
