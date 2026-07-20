"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import HomeScreen from "@/components/home/HomeScreen";
import { hasMadeSizeDecision } from "@/lib/preferred-size";

export default function Home() {
  const [view, setView] = useState<"loading" | "hero" | "home">("loading");

  useEffect(() => {
    // Only a real decision on /select-size (a size picked, or Skip) retires
    // the intro page — merely having opened the app before doesn't count,
    // so an undecided user keeps seeing it instead of getting stranded here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(hasMadeSizeDecision() ? "home" : "hero");
  }, []);

  if (view === "loading") return null;
  return view === "hero" ? <Hero /> : <HomeScreen />;
}
