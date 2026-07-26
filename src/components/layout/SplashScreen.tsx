"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/asset-path";

const LOGO_IMAGE = withBasePath("/arborn.webp");
const SPLASH_DURATION_MS = 1000;
const FADE_MS = 300;

function CornerBlob({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 300" fill="#f4cdd0" preserveAspectRatio="none">
      <path d="M0,0 H210 C250,0 260,40 240,80 C210,140 130,150 80,190 C40,220 20,260 0,300 Z" />
    </svg>
  );
}

function LeafBranch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 160" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M30 155 L30 8" strokeLinecap="round" />
      {[
        { y: 30, side: 1 },
        { y: 55, side: -1 },
        { y: 80, side: 1 },
        { y: 105, side: -1 },
        { y: 128, side: 1 },
      ].map(({ y, side }) => (
        <ellipse
          key={y}
          cx={30 + side * 13}
          cy={y}
          rx="12"
          ry="5.5"
          transform={`rotate(${side * 35} ${30 + side * 13} ${y})`}
        />
      ))}
    </svg>
  );
}

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
      className={`fixed inset-0 z-[200] overflow-hidden bg-background transition-opacity duration-300 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <CornerBlob className="absolute top-0 left-0 h-48 w-48" />
      <CornerBlob className="absolute bottom-0 right-0 h-56 w-56 rotate-180" />

      <LeafBranch className="absolute bottom-8 left-6 h-36 w-14 rotate-[15deg] text-[#f0c9cd]" />
      <LeafBranch className="absolute top-1/4 right-6 h-32 w-12 -rotate-[10deg] text-[#f0c9cd]" />

      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full border border-accent/25 bg-white shadow-[0_10px_30px_rgba(185,62,91,0.12)] sm:h-52 sm:w-52">
          <Image
            src={LOGO_IMAGE}
            alt="Arborn"
            width={200}
            height={200}
            className="h-40 w-40 object-contain sm:h-48 sm:w-48"
            priority
          />
        </div>
      </div>
    </div>
  );
}
