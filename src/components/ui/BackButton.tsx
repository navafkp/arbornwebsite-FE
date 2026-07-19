"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BackButton({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "bare";
}) {
  const router = useRouter();

  const isBare = variant === "bare";

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className={cn(
        isBare
          ? "flex h-10 w-10 items-center justify-center bg-transparent text-neutral-900 transition-colors hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          : "flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-dark",
        className,
      )}
    >
      <svg
        className={isBare ? "h-6 w-6" : "h-5 w-5"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={isBare ? 2.25 : 1.7}
      >
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
