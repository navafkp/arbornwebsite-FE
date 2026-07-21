"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/asset-path";

const LOGO_IMAGE = withBasePath("/arborn.webp");
const SPLASH_DURATION_MS = 1000;
const FADE_MS = 300;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), SPLASH_DURATION_MS);
    const hideTimer = setTimeout(() => setVisible(false), SPLASH_DURATION_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-accent transition-opacity duration-300 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Image src={LOGO_IMAGE} alt="" width={72} height={72} className="h-16 w-16 object-contain sm:h-[72px] sm:w-[72px]" priority />
      <span className="font-serif text-4xl font-semibold tracking-[0.2em] text-white sm:text-5xl">
        ARBORN
      </span>
    </div>
  );
}
