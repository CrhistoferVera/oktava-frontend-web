/* eslint-disable @next/next/no-img-element */
"use client";

import { Minus, Plus } from "lucide-react";
import type { Product } from "@/types/storefront.types";
import { useStorefrontCart } from "@/context/StorefrontCartContext";

interface CustomerProductCardProps {
  readonly product: Product;
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop";

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

export function CustomerProductCard({ product }: CustomerProductCardProps) {
  const { addToCart, decreaseQuantity, items } = useStorefrontCart();
  const quantity = items.find((i) => i.product.id === product.id)?.quantity ?? 0;

  return (
    <article className="oktava-surface overflow-hidden rounded-3xl flex flex-col">
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={product.imageUrl ?? PLACEHOLDER}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            {product.badge}
          </span>
        )}
        {quantity > 0 && (
          <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
            {quantity}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex-1 space-y-1.5">
          <h3 className="text-lg font-semibold leading-tight text-white">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm leading-relaxed text-zinc-400">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {product.price == null ? "—" : formatCurrency(product.price)}
          </span>
        </div>

        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-100"
          >
            <Plus size={16} />
            Agregar
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-red-600 overflow-hidden">
            <button
              type="button"
              onClick={() => decreaseQuantity(product.id)}
              className="flex h-10 w-12 items-center justify-center text-white transition-colors hover:bg-red-500 active:bg-red-700"
              aria-label="Quitar uno"
            >
              <Minus size={16} />
            </button>
            <span className="flex-1 text-center text-sm font-bold text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="flex h-10 w-12 items-center justify-center text-white transition-colors hover:bg-red-500 active:bg-red-700"
              aria-label="Agregar uno"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
