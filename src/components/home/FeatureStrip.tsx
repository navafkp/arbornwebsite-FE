"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getBanners, type ApiBanner } from "@/lib/api-client";

const DEFAULT_SLIDE_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 40;

export default function FeatureStrip() {
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  // Always starts at the first banner on mount — including on a hard
  // refresh, since this is plain component state, not persisted anywhere.
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    getBanners()
      .then((data) => {
        setBanners([...data].sort((a, b) => a.display_order - b.display_order));
      })
      .catch(() => setBanners([]));
  }, []);

  const activeDuration = banners[index]?.duration_ms ?? DEFAULT_SLIDE_INTERVAL_MS;

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, activeDuration);
    return () => clearTimeout(timer);
  }, [banners.length, activeDuration, index]);

  if (banners.length === 0) return null;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || banners.length <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD_PX) {
      setIndex((i) => (i - 1 + banners.length) % banners.length);
    } else if (deltaX < -SWIPE_THRESHOLD_PX) {
      setIndex((i) => (i + 1) % banners.length);
    }
    touchStartX.current = null;
  }

  return (
    <div
      className="relative mt-[2.2px] aspect-[1450/256] w-full overflow-hidden"
      style={{ marginLeft: "-2.5%", marginRight: "-2.5%", width: "auto" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${banners.length * 100}%`,
          transform: `translateX(-${index * (100 / banners.length)}%)`,
        }}
      >
        {banners.map((banner, i) => {
          const image = (
            <Image
              src={banner.image_url}
              alt={banner.alt_text}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          );
          return (
            <div
              key={banner.id}
              className="relative h-full shrink-0"
              style={{ width: `${100 / banners.length}%` }}
            >
              {banner.link ? (
                <a href={banner.link} className="relative block h-full w-full">
                  {image}
                </a>
              ) : (
                image
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
