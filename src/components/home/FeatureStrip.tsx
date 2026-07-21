"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/asset-path";

// Add more banner image paths here later — each one auto-advances every
// SLIDE_INTERVAL_MS. They're all rendered into the same fixed-ratio box
// with object-cover, so slight differences in a new image's own width/height
// don't matter — every slide still fills the exact same size consistently.
// TEMP: same image repeated 3x just to test the auto-scroll — replace with
// real distinct banner paths once you have them.
const FREE_SHIPPING_IMAGES = [
  withBasePath("/images/free-shipping.png"),
  withBasePath("/images/free-shipping.png"),
  withBasePath("/images/free-shipping.png"),
];

const SLIDE_INTERVAL_MS = 5000;

export default function FeatureStrip() {
  // Always starts at the first image on mount — including on a hard
  // refresh, since this is plain component state, not persisted anywhere.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (FREE_SHIPPING_IMAGES.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % FREE_SHIPPING_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative mt-[2.2px] aspect-[1450/244] w-full overflow-hidden rounded-3xl"
      style={{ marginLeft: "-2.5%", marginRight: "-2.5%", width: "auto" }}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${FREE_SHIPPING_IMAGES.length * 100}%`,
          transform: `translateX(-${index * (100 / FREE_SHIPPING_IMAGES.length)}%)`,
        }}
      >
        {FREE_SHIPPING_IMAGES.map((src, i) => (
          <div
            key={i}
            className="relative h-full shrink-0"
            style={{ width: `${100 / FREE_SHIPPING_IMAGES.length}%` }}
          >
            <Image
              src={src}
              alt="Free shipping all over India, no minimum order"
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {FREE_SHIPPING_IMAGES.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {FREE_SHIPPING_IMAGES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition ${i === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
