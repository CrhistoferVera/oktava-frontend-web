"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

export function CartFloatingBar() {
  const { totalItems, totalAmount, openCart, hydrated } = useStorefrontCart();

  if (!hydrated || totalItems === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md">
      <button
        type="button"
        onClick={openCart}
        className="flex w-full items-center justify-between gap-4 rounded-2xl bg-red-600 px-5 py-3.5 shadow-2xl shadow-red-900/50 transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-100"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={20} className="text-white" />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-white text-[10px] font-black text-red-600">
              {totalItems}
            </span>
          </div>
          <span className="text-sm font-bold text-white">Ver carrito</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            {formatCurrency(totalAmount)}
          </span>
          <ArrowRight size={16} className="text-red-200" />
        </div>
      </button>
    </div>
  );
}
