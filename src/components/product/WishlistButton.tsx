"use client";

import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export default function WishlistButton({ productId, className, size = "sm" }: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useShop();
  const active = isWishlisted(productId);
  const dimension = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105",
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
