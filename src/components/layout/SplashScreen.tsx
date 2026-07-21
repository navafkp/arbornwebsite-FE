"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/asset-path";

const LOGO_IMAGE = withBasePath("/images/arborn.PNG");
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
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-background transition-opacity duration-300 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Image src={LOGO_IMAGE} alt="" width={200} height={200} className="h-40 w-40 object-contain sm:h-[200px] sm:w-[200px]" priority />
    </div>
  );
}
