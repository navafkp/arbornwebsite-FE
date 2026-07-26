"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

// TEMPORARY: static UI only — nothing is submitted to the backend yet.
export default function AddReviewModal({
  productName,
  onClose,
}: {
  productName: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showToast("Thank you for your review!");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-xl">Add Your Review</h2>
            <p className="mt-0.5 truncate text-sm text-[var(--muted)]">{productName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/50 hover:bg-black/5"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">Reviewing as</p>
            <p className="mt-1 text-sm font-semibold">{user?.name || "Arborn customer"}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-[var(--muted)]">Your Rating</p>
            <div className="mt-1.5 flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
              {Array.from({ length: 5 }, (_, i) => {
                const value = i + 1;
                const filled = value <= (hoverRating || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    className="p-0.5"
                  >
                    <svg viewBox="0 0 20 20" className="h-7 w-7" fill={filled ? "#111111" : "#e5e2dc"}>
                      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-[var(--muted)]">Your Review</span>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Share your experience with this product..."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#dcc9c6] bg-white px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          <button
            type="submit"
            disabled={rating === 0 || text.trim().length === 0}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
