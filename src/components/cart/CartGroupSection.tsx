"use client";

import { useState } from "react";
import type { CartLine } from "@/lib/shop-context";
import CartLineItem from "@/components/cart/CartLineItem";

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M21 8l-9-5-9 5 9 5 9-5Z" strokeLinejoin="round" />
      <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
      <path d="M12 13v8" />
    </svg>
  );
}

function HeartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CartGroupSection({
  items,
  mismatchedIds,
  selectedIds,
  onToggleSelect,
  onSelectAllGroup,
  onRemoveSelected,
  onMoveToWishlistSelected,
  variant = "selectable",
}: {
  items: CartLine[];
  mismatchedIds?: Set<number>;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAllGroup: (ids: number[], select: boolean) => void;
  onRemoveSelected: (ids: number[]) => Promise<void>;
  onMoveToWishlistSelected: (ids: number[]) => Promise<void>;
  variant?: "selectable" | "unavailable";
}) {
  const [pending, setPending] = useState(false);

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

  // Stays hidden until the shopper checks at least one item directly on a
  // card — bulk actions have nothing to act on before that, so showing an
  // empty "Select all" bar up front is just noise.
  const selectionBar = selectedInGroup.length > 0 && (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-accent-soft/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() => onSelectAllGroup(groupIds, !allSelected)}
          className="h-4 w-4 accent-accent"
        />
        <span className="text-sm font-semibold text-accent">
          {selectedInGroup.length} {selectedInGroup.length === 1 ? "item" : "items"} selected
        </span>
        <button
          type="button"
          onClick={() => onSelectAllGroup(groupIds, !allSelected)}
          className="text-xs font-medium text-[var(--muted)] underline underline-offset-2"
        >
          Select all
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleMoveToWishlist}
          disabled={pending}
          className="flex items-center gap-1 text-xs font-medium text-accent disabled:opacity-40"
        >
          <HeartOutlineIcon className="h-3.5 w-3.5" />
          Move to Wishlist
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={pending}
          className="flex items-center gap-1 text-xs font-medium text-red-600 disabled:opacity-40"
        >
          <TrashIcon className="h-3.5 w-3.5" />
          Remove ({selectedInGroup.length})
        </button>
      </div>
    </div>
  );

  if (variant === "unavailable") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-3">
        <div className="flex items-center gap-2 px-1">
          <PackageIcon className="h-4 w-4 text-red-500" />
          <span className="text-sm font-semibold text-red-600">Out of Stock ({items.length})</span>
        </div>
        <p className="-mt-2 px-1 text-xs text-[var(--muted)]">Check back soon — these items are currently unavailable</p>
        {selectionBar}
        <div className="flex flex-col gap-3">
          {items.map((line) => (
            <CartLineItem key={line.id} line={line} selected={selectedIds.includes(line.id)} onToggleSelect={() => onToggleSelect(line.id)} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {selectionBar}

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
