"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  defaultValue?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  className?: string;
}

export default function SearchBar({
  defaultValue = "",
  autoFocus,
  onSubmitted,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("search", value.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    onSubmitted?.();
  }

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="flex items-center gap-3 border-b border-black/20 pb-2 focus-within:border-accent">
        <svg
          className="h-4 w-4 shrink-0 text-black/50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for night suits, cotton, satin…"
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
        />
      </div>
    </form>
  );
}
