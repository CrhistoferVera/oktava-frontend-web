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
import type { CartItem, Product } from "@/types/storefront.types";

const CART_KEY = "oktava_cart";

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
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StorefrontCartContext =
  createContext<StorefrontCartContextValue | null>(null);

export function StorefrontCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage only on the client, after first render
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (skip before hydration)
  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((product: Product) => {
    setItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => item.product.id === product.id,
      );

      if (!existingItem) {
        return [...previousItems, { product, quantity: 1 }];
      }

      return previousItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  }, []);

  const decreaseQuantity = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i.product.id !== productId);
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((previousItems) =>
      previousItems.filter((item) => item.product.id !== productId),
    );
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
        (total, item) => total + item.quantity * (item.product.price ?? 0),
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
      decreaseQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, totalItems, totalAmount, isCartOpen, hydrated, openCart, closeCart, addToCart, decreaseQuantity, removeFromCart, clearCart],
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
    throw new Error(
      "useStorefrontCart must be used within StorefrontCartProvider",
    );
  }

  return context;
}
