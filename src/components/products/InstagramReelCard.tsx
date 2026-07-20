"use client";

import { useState } from "react";

export default function InstagramReelCard({
  url,
  thumbnailUrl,
}: {
  url: string;
  thumbnailUrl?: string | null;
}) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
    >
      {thumbnailUrl && !thumbnailFailed && (
        // Instagram's CDN hostnames rotate and aren't in next.config's
        // remotePatterns, so a plain <img> is used instead of next/image.
        // Hotlinking their CDN is also unreliable — fall back to the
        // gradient background if it fails to load.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt="Instagram reel"
          onError={() => setThumbnailFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />

      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-105">
        <svg className="ml-1 h-7 w-7 text-[#241a1d]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
        Watch on Instagram
      </span>
    </a>
  );
}
