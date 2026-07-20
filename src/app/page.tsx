"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import HomeScreen from "@/components/home/HomeScreen";
import { hasMadeSizeDecision } from "@/lib/preferred-size";

// Static export prerenders this page with no localStorage, so the very
// first hydration must guess "hero" to match that markup — flips true after
// the first client commit, so later remounts of "/" (e.g. tapping Home in
// the bottom nav) can trust localStorage immediately with no mismatch risk.
let hasHydrated = false;

export default function Home() {
  const [view, setView] = useState<"hero" | "home">(() =>
    hasHydrated && hasMadeSizeDecision() ? "home" : "hero",
  );

  useEffect(() => {
    if (hasHydrated) return;
    hasHydrated = true;
    const decided = hasMadeSizeDecision() ? "home" : "hero";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (decided !== view) setView(decided);
  }, [view]);

  return view === "hero" ? <Hero /> : <HomeScreen />;
}
