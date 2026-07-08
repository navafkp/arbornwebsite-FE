"use client";

import { usePathname } from "next/navigation";
import { isNoChromeRoute } from "@/lib/constants";

// Reserves space at the very bottom of the page so content (e.g. Footer's
// last line) doesn't sit under the fixed MobileBottomNav. Pages with no
// bottom nav (see NO_CHROME_ROUTES) need no spacer.
export default function BottomNavSpacer() {
  const pathname = usePathname();

  if (isNoChromeRoute(pathname)) return null;

  return <div className="h-[calc(4.5rem_+_env(safe-area-inset-bottom))]" aria-hidden="true" />;
}
