"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItems,
  type ApiCartItem,
} from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

// The cart lives entirely on the backend and only exists for logged-in
// users — there is no guest/local cart anymore.
export type CartLine = ApiCartItem;

interface ShopContextValue {
  hydrated: boolean;
  cart: CartLine[];
  cartLoading: boolean;
  cartError: boolean;
  wishlist: string[];
  // tokenOverride lets a caller act immediately after login, before React
  // has re-rendered this context with the new accessToken (see refreshCart).
  addToCart: (variantSizeStockId: number, quantity?: number, tokenOverride?: string) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  removeManyFromCart: (cartItemIds: number[]) => Promise<void>;
  refreshCart: (tokenOverride?: string) => Promise<void>;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const WISHLIST_KEY_PREFIX = "arborn_wishlist:";

export function ShopProvider({ children }: { children: ReactNode }) {
  const { user, accessToken, hasBackendSession, hydrated: authHydrated } = useAuth();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartTotals, setCartTotals] = useState({ count: 0, subtotal: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistLoadedKey, setWishlistLoadedKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const wishlistOwner = hasBackendSession && user
    ? String(user.id ?? user.email.trim().toLowerCase())
    : null;
  const wishlistKey = wishlistOwner ? `${WISHLIST_KEY_PREFIX}${wishlistOwner}` : null;

  useEffect(() => {
    // Synchronizing from an external system (auth's own hydration state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (hydrated && wishlistKey && wishlistLoadedKey === wishlistKey) {
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated, wishlistKey, wishlistLoadedKey]);

  const refreshCart = useCallback(async (tokenOverride?: string) => {
    const token = tokenOverride ?? accessToken;
    if (!token) {
      setCart([]);
      setCartTotals({ count: 0, subtotal: 0 });
      return;
    }
    setCartLoading(true);
    setCartError(false);
    try {
      const data = await getCart(token);
      setCart(data.items);
      setCartTotals({ count: data.total_quantity, subtotal: Number(data.total_amount) });
    } catch {
      setCartError(true);
    } finally {
      setCartLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    // Fetching from an external system (the cart API) whenever the signed-in
    // identity changes — refreshCart's own setState calls are the sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCart();
  }, [refreshCart]);

  async function addToCart(variantSizeStockId: number, quantity = 1, tokenOverride?: string) {
    const token = tokenOverride ?? accessToken;
    if (!token) return;
    await addCartItem(token, variantSizeStockId, quantity);
    await refreshCart(tokenOverride);
  }

  async function updateQuantity(cartItemId: number, quantity: number) {
    if (!accessToken) return;
    if (quantity <= 0) {
      await deleteCartItems(accessToken, [cartItemId]);
    } else {
      await updateCartItem(accessToken, cartItemId, quantity);
    }
    await refreshCart();
  }

  async function removeFromCart(cartItemId: number) {
    if (!accessToken) return;
    await deleteCartItems(accessToken, [cartItemId]);
    await refreshCart();
  }

  async function removeManyFromCart(cartItemIds: number[]) {
    if (!accessToken || cartItemIds.length === 0) return;
    await deleteCartItems(accessToken, cartItemIds);
    await refreshCart();
  }

  function toggleWishlist(productId: string) {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }

  function isWishlisted(productId: string) {
    return wishlist.includes(productId);
  }

  const value: ShopContextValue = {
    hydrated: hydrated && (!wishlistKey || wishlistLoadedKey === wishlistKey),
    cart,
    cartLoading,
    cartError,
    wishlist,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeManyFromCart,
    refreshCart,
    cartCount: cartTotals.count,
    cartSubtotal: cartTotals.subtotal,
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
