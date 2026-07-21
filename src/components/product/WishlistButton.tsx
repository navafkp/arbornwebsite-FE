"use client";

import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export default function WishlistButton({ productId, className, size = "sm" }: WishlistButtonProps) {
  const { hydrated: wishlistHydrated, isWishlisted, toggleWishlist } = useShop();
  const { hasBackendSession, hydrated } = useAuth();
  const router = useRouter();
  const active = isWishlisted(productId);
  const ready = hydrated && (!hasBackendSession || wishlistHydrated);
  const dimension = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!ready) return;
        if (!hasBackendSession) {
          const next = `${window.location.pathname}${window.location.search}`;
          router.push(`/login?next=${encodeURIComponent(next)}`);
          return;
        }
        toggleWishlist(productId);
      }}
      aria-label={active ? "Remove from wishlist" : hasBackendSession ? "Add to wishlist" : "Log in to add to wishlist"}
      aria-pressed={active}
      disabled={!ready}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105 disabled:cursor-wait disabled:opacity-70 motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
    >
      <svg
        className={dimension}
        viewBox="0 0 24 24"
        fill={active ? "var(--accent)" : "none"}
        stroke={active ? "var(--accent)" : "currentColor"}
        strokeWidth="1.7"
      >
        <path
          d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
