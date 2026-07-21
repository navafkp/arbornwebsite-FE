"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/data/products";
import type { Size } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export interface CartLine {
  productId: string;
  size: Size;
  color: string;
  quantity: number;
}

interface ShopContextValue {
  hydrated: boolean;
  cart: CartLine[];
  wishlist: string[];
  addToCart: (productId: string, size: Size, color: string, quantity?: number) => void;
  updateQuantity: (productId: string, size: Size, color: string, quantity: number) => void;
  removeFromCart: (productId: string, size: Size, color: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "arborn_cart";
const WISHLIST_KEY_PREFIX = "arborn_wishlist:";

function lineKey(productId: string, size: string, color: string) {
  return `${productId}__${size}__${color}`;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { user, hasBackendSession, hydrated: authHydrated } = useAuth();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistLoadedKey, setWishlistLoadedKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const wishlistOwner = hasBackendSession && user
    ? String(user.id ?? user.email.trim().toLowerCase())
    : null;
  const wishlistKey = wishlistOwner ? `${WISHLIST_KEY_PREFIX}${wishlistOwner}` : null;

  useEffect(() => {
    // One-time sync from localStorage (an external system) on mount. Starting
    // state at [] keeps SSR/client markup identical, avoiding a hydration
    // mismatch that a lazy useState initializer reading localStorage would cause.
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (rawCart) setCart(JSON.parse(rawCart));
    } catch {
      // ignore malformed localStorage data
    }
    if (authHydrated) setHydrated(true);
  }, [authHydrated]);

  useEffect(() => {
    if (!authHydrated) return;
    if (!wishlistKey) {
      // Synchronize account-owned state when the external auth identity changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWishlist([]);
      setWishlistLoadedKey(null);
      return;
    }
    try {
      const raw = localStorage.getItem(wishlistKey);
      setWishlist(raw ? JSON.parse(raw) : []);
      setWishlistLoadedKey(wishlistKey);
    } catch {
      setWishlist([]);
      setWishlistLoadedKey(wishlistKey);
    }
  }, [authHydrated, wishlistKey]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated && wishlistKey && wishlistLoadedKey === wishlistKey) {
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated, wishlistKey, wishlistLoadedKey]);

  function addToCart(productId: string, size: Size, color: string, quantity = 1) {
    setCart((prev) => {
      const key = lineKey(productId, size, color);
      const existing = prev.find((l) => lineKey(l.productId, l.size, l.color) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.size, l.color) === key
            ? { ...l, quantity: l.quantity + quantity }
            : l,
        );
      }
      return [...prev, { productId, size, color, quantity }];
    });
  }

  function updateQuantity(productId: string, size: Size, color: string, quantity: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          lineKey(l.productId, l.size, l.color) === lineKey(productId, size, color)
            ? { ...l, quantity }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }

  function removeFromCart(productId: string, size: Size, color: string) {
    setCart((prev) =>
      prev.filter((l) => lineKey(l.productId, l.size, l.color) !== lineKey(productId, size, color)),
    );
  }

  function clearCart() {
    setCart([]);
  }

  function toggleWishlist(productId: string) {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }

  function isWishlisted(productId: string) {
    return wishlist.includes(productId);
  }

  const { cartCount, cartSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of cart) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) continue;
      count += line.quantity;
      subtotal += product.price * line.quantity;
    }
    return { cartCount: count, cartSubtotal: subtotal };
  }, [cart]);

  const value: ShopContextValue = {
    hydrated: hydrated && (!wishlistKey || wishlistLoadedKey === wishlistKey),
    cart,
    wishlist,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    toggleWishlist,
    isWishlisted,
    wishlistCount: wishlist.length,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
