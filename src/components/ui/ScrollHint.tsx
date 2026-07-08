"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ScrollHint({ className }: { className?: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY <= 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-1/2 z-30 -translate-x-1/2 transition-opacity duration-500",
        visible ? "opacity-60" : "opacity-0",
        className,
      )}
    >
      <div className="flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-white/80 shadow-sm">
        <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
