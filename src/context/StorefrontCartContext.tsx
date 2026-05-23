"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, SelectedOptionGroup } from "@/types/storefront.types";

const CART_KEY = "oktava_cart";

function sameOptions(a: SelectedOptionGroup[], b: SelectedOptionGroup[]): boolean {
  if (a.length !== b.length) return false;
  const sortById = (arr: SelectedOptionGroup[]) =>
    [...arr].sort((x, y) => x.groupId.localeCompare(y.groupId));
  return sortById(a).every((ga, i) => {
    const gb = sortById(b)[i];
    if (ga.groupId !== gb.groupId) return false;
    const ids = (g: SelectedOptionGroup) =>
      [...g.items].map(o => o.optionId).sort((a, b) => a.localeCompare(b)).join(',');
    return ids(ga) === ids(gb);
  });
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

interface StorefrontCartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  hydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  /**
   * Products WITHOUT options: deduplicates by productId (_cartId = product.id).
   * Products WITH options: always creates a new line item (_cartId = uuid).
   */
  addToCart: (product: Product, selectedOptions?: SelectedOptionGroup[]) => void;
  /** Increment quantity for an existing line item by its _cartId. */
  increaseQuantity: (cartId: string) => void;
  /** Decrement quantity for a line item. Removes it when it reaches 0. */
  decreaseQuantity: (cartId: string) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
}

const StorefrontCartContext =
  createContext<StorefrontCartContextValue | null>(null);

export function StorefrontCartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    (product: Product, selectedOptions?: SelectedOptionGroup[]) => {
      setItems((prev) => {
        const hasOptions = selectedOptions && selectedOptions.length > 0;

        if (!hasOptions) {
          // No options — deduplicate by productId, _cartId === product.id
          const existing = prev.find((i) => i._cartId === product.id);
          if (existing) {
            return prev.map((i) =>
              i._cartId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
            );
          }
          return [
            ...prev,
            { _cartId: product.id, product, quantity: 1, selectedOptions: [], extraPrice: 0 },
          ];
        }

        // Has options — deduplicate by same product + same options
        const opts = selectedOptions ?? [];
        const existing = prev.find(
          (i) => i.product.id === product.id && sameOptions(i.selectedOptions, opts),
        );
        if (existing) {
          return prev.map((i) =>
            i._cartId === existing._cartId ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }

        const extraPrice = opts.flatMap((g) => g.items).reduce((sum, o) => sum + o.extraPrice, 0);
        const cartId = `${product.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        return [
          ...prev,
          { _cartId: cartId, product, quantity: 1, selectedOptions: opts, extraPrice },
        ];
      });
    },
    [],
  );

  const increaseQuantity = useCallback((cartId: string) => {
    setItems((prev) =>
      prev.map((i) => (i._cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  }, []);

  const decreaseQuantity = useCallback((cartId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i._cartId === cartId);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i._cartId !== cartId);
      return prev.map((i) => (i._cartId === cartId ? { ...i, quantity: i.quantity - 1 } : i));
    });
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i._cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity * ((item.product.price ?? 0) + item.extraPrice),
        0,
      ),
    [items],
  );

  const contextValue = useMemo(
    () => ({
      items,
      totalItems,
      totalAmount,
      isCartOpen,
      hydrated,
      openCart,
      closeCart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      items, totalItems, totalAmount, isCartOpen, hydrated,
      openCart, closeCart, addToCart, increaseQuantity,
      decreaseQuantity, removeFromCart, clearCart,
    ],
  );

  return (
    <StorefrontCartContext.Provider value={contextValue}>
      {children}
    </StorefrontCartContext.Provider>
  );
}

export function useStorefrontCart() {
  const context = useContext(StorefrontCartContext);
  if (!context) {
    throw new Error("useStorefrontCart must be used within StorefrontCartProvider");
  }
  return context;
}
