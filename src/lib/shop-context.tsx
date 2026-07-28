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
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  ApiError,
  type ApiCartItem,
  type ApiWishlistItem,
} from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

// The cart and wishlist both live entirely on the backend and only exist
// for logged-in users — there is no guest/local version of either anymore.
export type CartLine = ApiCartItem;

interface ShopContextValue {
  hydrated: boolean;
  cart: CartLine[];
  cartLoading: boolean;
  cartError: boolean;
  wishlist: ApiWishlistItem[];
  wishlistLoading: boolean;
  wishlistError: boolean;
  refreshWishlist: (tokenOverride?: string) => Promise<void>;
  // tokenOverride lets a caller act immediately after login, before React
  // has re-rendered this context with the new accessToken (see refreshCart).
  addToCart: (variantSizeStockId: number, quantity?: number, tokenOverride?: string) => Promise<number | undefined>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  removeManyFromCart: (cartItemIds: number[]) => Promise<void>;
  refreshCart: (tokenOverride?: string) => Promise<void>;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  isWishlistPending: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const { accessToken, hydrated: authHydrated, logOut, refreshSession } = useAuth();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartTotals, setCartTotals] = useState({ count: 0, subtotal: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(false);
  const [wishlist, setWishlist] = useState<ApiWishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(false);
  const [wishlistPendingIds, setWishlistPendingIds] = useState<Set<number>>(new Set());

  // Shared by every cart/wishlist action: on a 401 (expired access token —
  // it only lasts 30 minutes), try the 14-day refresh token to get a new
  // access token and retry once. Only if that also fails is the session
  // actually dead — clear it locally so the UI's own login-prompt logic
  // kicks in, then rethrow the *original* 401 so callers can still detect it.
  async function runAuthedAction<T>(token: string, action: (token: string) => Promise<T>): Promise<T> {
    try {
      return await action(token);
    } catch (err) {
      if (!(err instanceof ApiError) || err.status !== 401) throw err;
      try {
        const newToken = await refreshSession();
        return await action(newToken);
      } catch {
        logOut();
        throw err;
      }
    }
  }

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
      const data = await runAuthedAction(token, getCart);
      setCart(data.items);
      setCartTotals({ count: data.total_quantity, subtotal: Number(data.total_amount) });
    } catch {
      setCartError(true);
    } finally {
      setCartLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const refreshWishlist = useCallback(async (tokenOverride?: string) => {
    const token = tokenOverride ?? accessToken;
    if (!token) {
      setWishlist([]);
      return;
    }
    setWishlistLoading(true);
    setWishlistError(false);
    try {
      const data = await runAuthedAction(token, getWishlist);
      setWishlist(data);
    } catch {
      setWishlistError(true);
    } finally {
      setWishlistLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    // Fetching from an external system (the cart/wishlist API) whenever the
    // signed-in identity changes — their own setState calls are the sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  async function addToCart(variantSizeStockId: number, quantity = 1, tokenOverride?: string) {
    const token = tokenOverride ?? accessToken;
    if (!token) return undefined;
    return runAuthedAction(token, async (t) => {
      const item = await addCartItem(t, variantSizeStockId, quantity);
      await refreshCart(t);
      return item.id;
    });
  }

  async function updateQuantity(cartItemId: number, quantity: number) {
    if (!accessToken) return;
    await runAuthedAction(accessToken, async (t) => {
      if (quantity <= 0) {
        await deleteCartItems(t, [cartItemId]);
      } else {
        await updateCartItem(t, cartItemId, quantity);
      }
      await refreshCart(t);
    });
  }

  async function removeFromCart(cartItemId: number) {
    if (!accessToken) return;
    await runAuthedAction(accessToken, async (t) => {
      await deleteCartItems(t, [cartItemId]);
      await refreshCart(t);
    });
  }

  async function removeManyFromCart(cartItemIds: number[]) {
    if (!accessToken || cartItemIds.length === 0) return;
    await runAuthedAction(accessToken, async (t) => {
      await deleteCartItems(t, cartItemIds);
      await refreshCart(t);
    });
  }

  async function toggleWishlist(productId: number) {
    if (!accessToken) return;
    const isCurrentlyWishlisted = wishlist.some((p) => p.id === productId);
    setWishlistPendingIds((prev) => new Set(prev).add(productId));
    try {
      await runAuthedAction(accessToken, async (t) => {
        if (isCurrentlyWishlisted) {
          await removeWishlistItem(t, productId);
        } else {
          await addWishlistItem(t, productId);
        }
        await refreshWishlist(t);
      });
    } finally {
      setWishlistPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }

  function isWishlisted(productId: number) {
    return wishlist.some((p) => p.id === productId);
  }

  function isWishlistPending(productId: number) {
    return wishlistPendingIds.has(productId);
  }

  // No bulk-delete endpoint on the backend for wishlist (unlike cart) — just
  // fire every removal in parallel, then refresh once.
  async function clearWishlist() {
    if (!accessToken || wishlist.length === 0) return;
    await runAuthedAction(accessToken, async (t) => {
      await Promise.all(wishlist.map((product) => removeWishlistItem(t, product.id)));
      await refreshWishlist(t);
    });
  }

  const value: ShopContextValue = {
    hydrated: authHydrated,
    cart,
    cartLoading,
    cartError,
    wishlist,
    wishlistLoading,
    wishlistError,
    refreshWishlist,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeManyFromCart,
    refreshCart,
    cartCount: cartTotals.count,
    cartSubtotal: cartTotals.subtotal,
    toggleWishlist,
    isWishlisted,
    isWishlistPending,
    clearWishlist,
    wishlistCount: wishlist.length,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
