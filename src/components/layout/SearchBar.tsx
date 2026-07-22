"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  defaultValue?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  className?: string;
}

// TEMP: hardcoded suggestions until the backend sends these from an API.
const SUGGESTED_KEYWORDS = ["Pyjama", "Nighty", "Cozy", "Pinteresty", "Trending", "Arborn"];

export default function SearchBar({
  defaultValue = "",
  autoFocus,
  onSubmitted,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function runSearch(query: string) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    onSubmitted?.();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    runSearch(value);
  }

  function handleKeywordClick(keyword: string) {
    setValue(keyword);
    runSearch(keyword);
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <form onSubmit={handleSubmit} role="search">
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

      <div className="absolute inset-x-0 top-full z-10 flex flex-wrap gap-2 bg-background px-1 pt-3 pb-2">
        {SUGGESTED_KEYWORDS.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => handleKeywordClick(keyword)}
            className="rounded-full border border-black/15 px-3 py-1.5 text-xs text-black/70 transition hover:border-accent hover:text-accent"
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
}
