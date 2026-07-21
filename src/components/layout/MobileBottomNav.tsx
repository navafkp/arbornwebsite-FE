"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";
import { isNoChromeRoute } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

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
    label: "Collections",
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

function NavLink({ item, active }: { item: (typeof ITEMS)[number]; active: boolean }) {
  const { wishlistCount } = useShop();
  const { hasBackendSession } = useAuth();

  return (
    <Link
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
      {item.label === "Wishlist" && hasBackendSession && wishlistCount > 0 && (
        <span className="absolute top-1 right-1/2 h-4 min-w-4 translate-x-3 rounded-full bg-accent px-1 text-center text-[9px] leading-4 text-white">
          {wishlistCount}
        </span>
      )}
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useShop();
  // TEMP: the Hero/"Continue Shopping" intro page is disabled in
  // src/app/page.tsx for now (always lands on the designed home screen), so
  // there's no hero state to hide the nav for here either. Re-enable
  // together with page.tsx by restoring this block:
  //
  // const [showingHero, setShowingHero] = useState(
  //   () => pathname === "/" && !(appHydration.done && hasMadeSizeDecision()),
  // );
  //
  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setShowingHero(pathname === "/" && !hasMadeSizeDecision());
  // }, [pathname]);
  const showingHero = false;

  if (isNoChromeRoute(pathname) || showingHero) return null;

  const [home, collections, wishlist, profile] = ITEMS;
  const bagActive = pathname === "/cart";

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 flex items-stretch border-t border-black/5 bg-white/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <NavLink item={home} active={pathname === home.href} />
      <NavLink item={collections} active={pathname === collections.href} />

      <div className="relative flex flex-1 items-center justify-center">
        <Link
          href="/cart"
          aria-label="Bag"
          className={cn(
            "absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_20px_rgba(185,62,91,0.35)]",
            bagActive ? "bg-accent-dark" : "bg-accent",
          )}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 8h12l-1 12a1.5 1.5 0 01-1.5 1.4h-7A1.5 1.5 0 017 20L6 8z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[9px] leading-none text-accent">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <NavLink item={wishlist} active={pathname === wishlist.href} />
      <NavLink item={profile} active={pathname === profile.href} />
    </nav>
  );
}
