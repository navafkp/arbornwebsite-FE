"use client";

import { useState } from "react";
import type { CartLine } from "@/lib/shop-context";
import CartLineItem from "@/components/cart/CartLineItem";

const TONE_STYLES = {
  default: {
    bar: "bg-accent-soft/60",
    text: "text-[#241a1d]",
    icon: "bg-white text-accent",
  },
  warning: {
    bar: "bg-amber-50",
    text: "text-amber-800",
    icon: "bg-white text-amber-600",
  },
  danger: {
    bar: "bg-red-50",
    text: "text-red-700",
    icon: "bg-white text-red-500",
  },
} as const;

function ToneIcon({ tone }: { tone: keyof typeof TONE_STYLES }) {
  if (tone === "danger") {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 8l8 8" strokeLinecap="round" />
      </svg>
    );
  }
  if (tone === "warning") {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 9v4m0 4h.01M10.29 3.86l-8.15 14.13A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.36-2.11L13.71 3.86a1.5 1.5 0 00-2.42 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CartGroupSection({
  title,
  tone = "default",
  items,
  mismatchedIds,
  selectedIds,
  onToggleSelect,
  onSelectAllGroup,
  onRemoveSelected,
  onMoveToWishlistSelected,
}: {
  title: string;
  tone?: keyof typeof TONE_STYLES;
  items: CartLine[];
  mismatchedIds?: Set<number>;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAllGroup: (ids: number[], select: boolean) => void;
  onRemoveSelected: (ids: number[]) => Promise<void>;
  onMoveToWishlistSelected: (ids: number[]) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const styles = TONE_STYLES[tone];

  if (items.length === 0) return null;

  const groupIds = items.map((line) => line.id);
  const selectedInGroup = selectedIds.filter((id) => groupIds.includes(id));
  const allSelected = selectedInGroup.length === groupIds.length;

  async function handleRemove() {
    setPending(true);
    try {
      await onRemoveSelected(selectedInGroup);
    } finally {
      setPending(false);
    }
  }

  async function handleMoveToWishlist() {
    setPending(true);
    try {
      await onMoveToWishlistSelected(selectedInGroup);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl px-4 py-3 ${styles.bar}`}>
        <div className="flex items-center gap-2.5">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
            <ToneIcon tone={tone} />
          </span>
          <span className={`text-sm font-semibold ${styles.text}`}>
            {title} ({items.length})
          </span>
          <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => onSelectAllGroup(groupIds, !allSelected)}
              className="h-4 w-4 accent-accent"
            />
            Select all
          </label>
        </div>
        {selectedInGroup.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMoveToWishlist}
              disabled={pending}
              className="text-xs font-medium text-accent underline underline-offset-2 disabled:opacity-40"
            >
              Move to Wishlist
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={pending}
              className="text-xs font-medium text-red-600 underline underline-offset-2 disabled:opacity-40"
            >
              Remove ({selectedInGroup.length})
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((line) => (
          <CartLineItem
            key={line.id}
            line={line}
            sizeMismatch={mismatchedIds?.has(line.id)}
            selected={selectedIds.includes(line.id)}
            onToggleSelect={() => onToggleSelect(line.id)}
          />
        ))}
      </div>
    </div>
  );
}
