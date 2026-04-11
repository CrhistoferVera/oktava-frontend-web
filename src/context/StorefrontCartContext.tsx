"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/types/storefront.types";

interface StorefrontCartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StorefrontCartContext =
  createContext<StorefrontCartContextValue | null>(null);

export function StorefrontCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

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
        (total, item) => total + item.quantity * item.product.price,
        0,
      ),
    [items],
  );

  const contextValue = useMemo(
    () => ({
      items,
      totalItems,
      totalAmount,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [addToCart, clearCart, items, removeFromCart, totalAmount, totalItems],
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
