"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import HomeScreen from "@/components/home/HomeScreen";
import { hasMadeSizeDecision } from "@/lib/preferred-size";
import { appHydration } from "@/lib/app-hydration";

export default function Home() {
  // Static export prerenders this page with no localStorage, so the very
  // first hydration must guess "hero" to match that markup — after that,
  // later remounts of "/" (e.g. tapping Home in the bottom nav) can trust
  // localStorage immediately with no mismatch risk.
  const [view, setView] = useState<"hero" | "home">(() =>
    appHydration.done && hasMadeSizeDecision() ? "home" : "hero",
  );

  useEffect(() => {
    if (appHydration.done) return;
    appHydration.done = true;
    const decided = hasMadeSizeDecision() ? "home" : "hero";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (decided !== view) setView(decided);
  }, [view]);

  return view === "hero" ? <Hero /> : <HomeScreen />;
}
