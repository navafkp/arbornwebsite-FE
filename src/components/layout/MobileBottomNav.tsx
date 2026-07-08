"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";
import { isNoChromeRoute } from "@/lib/constants";

const ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z" strokeLinejoin="round" />
    ),
  },
  {
    href: "/categories",
    label: "Explore",
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: (
      <path
        d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4 8 3.6 10 5 12 7c2-2 4-3.4 6.5-3 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.6-3.3 4.4-5 7.5-5s5.9 1.7 7.5 5" strokeLinecap="round" />
      </>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { wishlistCount } = useShop();

  if (isNoChromeRoute(pathname)) return null;

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 flex border-t border-black/5 bg-white/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] tracking-wide",
              active ? "text-accent" : "text-black/50",
            )}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={active ? 2 : 1.6}
            >
              {item.icon}
            </svg>
            {item.label}
            {item.label === "Wishlist" && wishlistCount > 0 && (
              <span className="absolute top-1 right-1/2 h-4 min-w-4 translate-x-3 rounded-full bg-accent px-1 text-center text-[9px] leading-4 text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
