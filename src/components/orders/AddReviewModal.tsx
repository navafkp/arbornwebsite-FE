"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { HeartIcon } from "@/components/ui/decor";

const REVIEW_MAX_LENGTH = 500;

function CornerBranch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6c14 4 26 14 32 30" strokeLinecap="round" />
      <circle cx="14" cy="10" r="3" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="24" cy="16" r="4" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="34" cy="26" r="3.5" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="40" cy="36" r="2.5" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

function SprigIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M34 6C24 12 18 22 16 34" strokeLinecap="round" />
      <ellipse cx="27" cy="10" rx="4" ry="2.4" transform="rotate(-35 27 10)" fill="currentColor" opacity="0.5" stroke="none" />
      <ellipse cx="21" cy="17" rx="4" ry="2.4" transform="rotate(-35 21 17)" fill="currentColor" opacity="0.45" stroke="none" />
      <ellipse cx="18" cy="26" rx="3.4" ry="2" transform="rotate(-35 18 26)" fill="currentColor" opacity="0.4" stroke="none" />
    </svg>
  );
}

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
  const [reviewerName, setReviewerName] = useState(user?.name || "Arborn customer");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showToast(`Thank you for reviewing ${productName}!`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-[358px] overflow-y-auto rounded-[26px] bg-[#fdf1f0] p-5 shadow-[0_20px_60px_rgba(96,55,62,0.25)]">
        <CornerBranch className="pointer-events-none absolute top-0 left-0 h-16 w-16 text-accent/40" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="relative mt-1.5 text-center font-serif text-2xl">Add Your Review</h2>
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-accent">
          <span className="h-px w-[51px] bg-accent/40" />
          <HeartIcon filled className="h-3 w-3" />
          <span className="h-px w-[51px] bg-accent/40" />
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="pt-1">
            <p className="flex items-center gap-1 text-[11px] font-medium text-accent">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8.5" r="4" />
                <path d="M4.5 20.5c1.7-3.6 4.5-5.5 7.5-5.5s5.8 1.9 7.5 5.5" strokeLinecap="round" />
              </svg>
              Reviewing as
            </p>
            <div className="relative mt-1.5">
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full rounded-xl bg-accent-soft/60 px-3 py-2 pr-8 text-[11px] font-medium outline-none focus:ring-2 focus:ring-accent/30"
              />
              <svg className="pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15.5 4.5l4 4-9.5 9.5-5 1 1-5z" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="mt-3 border-t border-dashed border-accent/25 pt-3">
            <p className="flex items-center justify-center gap-1 text-[11px] font-medium text-accent">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" strokeLinejoin="round" />
              </svg>
              Your Rating
            </p>
            <div className="mt-2 flex items-center justify-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
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
                    <svg
                      viewBox="0 0 20 20"
                      className="h-7 w-7"
                      fill={filled ? "#b9455f" : "none"}
                      stroke="#b9455f"
                      strokeWidth="1.1"
                    >
                      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" strokeLinejoin="round" />
                    </svg>
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-center text-[10px] text-[var(--muted)]">
              {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Tap a star to rate"}
            </p>
          </div>

          <div className="mt-3 border-t border-dashed border-accent/25 pt-3">
            <p className="flex items-center gap-1 text-[11px] font-medium text-accent">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 5h16v10H9l-4 4v-4H4z" strokeLinejoin="round" />
              </svg>
              Your Review
            </p>
            <div className="relative mt-1.5">
              <textarea
                required
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, REVIEW_MAX_LENGTH))}
                maxLength={REVIEW_MAX_LENGTH}
                rows={4}
                placeholder="Share your experience with this product..."
                className="w-full resize-none rounded-xl border border-accent/20 bg-white px-3 py-2 text-[11px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <SprigIcon className="pointer-events-none absolute bottom-1.5 right-1.5 h-[26px] w-[26px] text-accent/35" />
            </div>
            <p className="mt-1 text-right text-[10px] text-[var(--muted)]">
              {text.length}/{REVIEW_MAX_LENGTH}
            </p>
          </div>

          <button
            type="submit"
            disabled={rating === 0 || text.trim().length === 0}
            className="mt-1.5 flex w-full items-center justify-center gap-[6px] rounded-full bg-accent py-[11px] text-[10px] font-semibold text-white shadow-[0_10px_24px_rgba(185,62,91,0.3)] disabled:opacity-50"
          >
            <svg className="h-[11px] w-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 2L11 13" strokeLinecap="round" />
              <path d="M22 2l-7 20-4-9-9-4z" strokeLinejoin="round" />
            </svg>
            Submit Review
          </button>

          <p className="mt-2.5 flex items-center justify-center gap-1 text-center text-[10px] text-[var(--muted)]">
            <svg className="h-[11px] w-[11px] text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Your review is valuable and always appreciated!
            <HeartIcon filled className="h-2.5 w-2.5 text-accent" />
          </p>
        </form>
      </div>
    </div>
  );
}
