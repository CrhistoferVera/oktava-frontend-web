/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product, SelectedOptionGroup } from "@/types/storefront.types";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { ProductOptionsModal } from "./product-options-modal";

interface CustomerProductCardProps {
  readonly product: Product;
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop";

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

export function CustomerProductCard({ product }: CustomerProductCardProps) {
  const { addToCart, decreaseQuantity, items, openCart } = useStorefrontCart();
  const [modalOpen, setModalOpen] = useState(false);

  const hasOptions = product.optionGroups.length > 0;

  // Total quantity across all cart entries for this product
  const quantity = items
    .filter((i) => i.product.id === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  function handleAddDirect() {
    addToCart(product);
    openCart();
  }

  function handleConfirmOptions(selectedOptions: SelectedOptionGroup[]) {
    setModalOpen(false);
    addToCart(product, selectedOptions);
    openCart();
  }

  function renderCta() {
    if (hasOptions) {
      return (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-100"
        >
          <Plus size={14} />
          {quantity > 0 ? (
            <>Agregar<span className="hidden sm:inline"> otro</span></>
          ) : (
            "Agregar"
          )}
        </button>
      );
    }
    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={handleAddDirect}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-100"
        >
          <Plus size={14} />
          Agregar
        </button>
      );
    }
    return (
      <div className="flex items-center justify-between rounded-xl bg-red-600 overflow-hidden">
        <button
          type="button"
          onClick={() => decreaseQuantity(product.id)}
          className="flex h-8 w-9 md:h-10 md:w-12 items-center justify-center text-white transition-colors hover:bg-red-500 active:bg-red-700"
          aria-label="Quitar uno"
        >
          <Minus size={14} />
        </button>
        <span className="flex-1 text-center text-xs md:text-sm font-bold text-white">
          {quantity}
        </span>
        <button
          type="button"
          onClick={handleAddDirect}
          className="flex h-8 w-9 md:h-10 md:w-12 items-center justify-center text-white transition-colors hover:bg-red-500 active:bg-red-700"
          aria-label="Agregar uno"
        >
          <Plus size={14} />
        </button>
      </div>
    );
  }

  return (
    <>
      <article className="oktava-surface overflow-hidden rounded-2xl md:rounded-3xl flex flex-col">
        {/* Image — aspect ratio on mobile, fixed height on desktop */}
        <div className="relative aspect-4/3 md:aspect-auto md:h-52 overflow-hidden shrink-0">
          <img
            src={product.imageUrl ?? PLACEHOLDER}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {product.badge && (
            <span className="absolute left-2 top-2 md:left-3 md:top-3 rounded-full bg-red-500 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-white">
              {product.badge}
            </span>
          )}
          {quantity > 0 && (
            <span className="absolute right-2 top-2 md:right-3 md:top-3 grid h-6 w-6 md:h-7 md:w-7 place-items-center rounded-full bg-red-600 text-[10px] md:text-xs font-bold text-white shadow-lg">
              {quantity}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 md:gap-4 p-3 md:p-5">
          <div className="flex-1 space-y-1">
            <h3 className="text-sm md:text-lg font-semibold leading-tight text-white line-clamp-2">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs md:text-sm leading-relaxed text-zinc-400 line-clamp-2 md:line-clamp-none">
                {product.description}
              </p>
            )}
            {product.includes && (
              <p className="hidden md:block text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Incluye:</span>{" "}
                {product.includes}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-1">
            <span className="text-base md:text-2xl font-bold text-white">
              {product.price == null ? "—" : formatCurrency(product.price)}
            </span>
            {hasOptions && (
              <span className="text-[10px] md:text-xs text-zinc-500 text-right">
                <span className="hidden md:inline">
                  {product.optionGroups.length}{" "}
                  {product.optionGroups.length === 1
                    ? "grupo de opciones"
                    : "grupos de opciones"}
                </span>
                <span className="md:hidden">Opciones disp.</span>
              </span>
            )}
          </div>

          {/* CTA */}
          {renderCta()}
        </div>
      </article>

      {hasOptions && (
        <ProductOptionsModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmOptions}
        />
      )}
    </>
  );
}
