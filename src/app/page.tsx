"use client";

import HomeScreen from "@/components/home/HomeScreen";

// TEMP: the Hero/"Continue Shopping" intro page (Our Story, Mission, Vision,
// Contact) is disabled for now — always land straight on the designed home
// screen (View All Products etc.) instead, on every open. Re-enable by
// restoring the code below (kept as a comment) and reverting
// MobileBottomNav's matching hero-check.
//
// import { useEffect, useState } from "react";
// import Hero from "@/components/home/Hero";
// import { hasMadeSizeDecision } from "@/lib/preferred-size";
// import { appHydration } from "@/lib/app-hydration";
//
// export default function Home() {
//   // Static export prerenders this page with no localStorage, so the very
//   // first hydration must guess "hero" to match that markup — after that,
//   // later remounts of "/" (e.g. tapping Home in the bottom nav) can trust
//   // localStorage immediately with no mismatch risk.
//   const [view, setView] = useState<"hero" | "home">(() =>
//     appHydration.done && hasMadeSizeDecision() ? "home" : "hero",
//   );
//
//   useEffect(() => {
//     if (appHydration.done) return;
//     appHydration.done = true;
//     const decided = hasMadeSizeDecision() ? "home" : "hero";
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     if (decided !== view) setView(decided);
//   }, [view]);
//
//   return view === "hero" ? <Hero /> : <HomeScreen />;
// }

export default function Home() {
  return <HomeScreen />;
}
