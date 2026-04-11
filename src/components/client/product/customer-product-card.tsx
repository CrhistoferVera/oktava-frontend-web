/* eslint-disable @next/next/no-img-element */
"use client";

import { Clock3, Plus } from "lucide-react";
import type { Product } from "@/types/storefront.types";

interface CustomerProductCardProps {
  product: Product;
  onAdd?: (product: Product) => void;
}

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

export function CustomerProductCard({
  product,
  onAdd,
}: CustomerProductCardProps) {
  return (
    <article className="oktava-surface overflow-hidden rounded-3xl">
      <div className="relative h-52 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span className="text-2xl font-bold text-white">
            {formatCurrency(product.price)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Clock3 size={14} />
            {product.prepTimeMinutes} min
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAdd?.(product)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-500"
        >
          <Plus size={16} />
          Agregar
        </button>
      </div>
    </article>
  );
}
