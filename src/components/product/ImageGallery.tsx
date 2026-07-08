"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  function handleMobileScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  }

  function goTo(index: number) {
    setActiveIndex(index);
    mobileScrollRef.current?.scrollTo({
      left: index * mobileScrollRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex shrink-0 gap-2.5 sm:flex-col sm:overflow-y-auto">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show image ${i + 1}`}
            className={cn(
              "relative h-16 w-14 shrink-0 overflow-hidden rounded-md ring-1 transition sm:h-20 sm:w-16",
              i === activeIndex ? "ring-black" : "ring-black/10 hover:ring-black/30",
            )}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div
          className="relative hidden aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-lg bg-[#f4f2ee] sm:block"
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={images[activeIndex]}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            priority
            className="object-cover transition-transform duration-300 ease-out"
            style={{
              transformOrigin: origin,
              transform: zooming ? "scale(1.9)" : "scale(1)",
            }}
          />
        </div>

        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="no-scrollbar flex aspect-[3/4] w-full snap-x snap-mandatory overflow-x-auto rounded-lg bg-[#f4f2ee] sm:hidden"
        >
          {images.map((src, i) => (
            <div key={src + i} className="relative h-full w-full flex-shrink-0 snap-start">
              <Image
                src={src}
                alt={`${alt} view ${i + 1}`}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeIndex ? "w-5 bg-black" : "w-1.5 bg-black/20",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
