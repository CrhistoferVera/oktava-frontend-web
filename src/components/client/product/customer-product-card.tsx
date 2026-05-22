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
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-100"
        >
          <Plus size={16} />
          {quantity > 0 ? "Agregar otro" : "Agregar"}
        </button>
      );
    }
    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={handleAddDirect}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-100"
        >
          <Plus size={16} />
          Agregar
        </button>
      );
    }
    return (
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
          onClick={handleAddDirect}
          className="flex h-10 w-12 items-center justify-center text-white transition-colors hover:bg-red-500 active:bg-red-700"
          aria-label="Agregar uno"
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <article className="oktava-surface overflow-hidden rounded-3xl flex flex-col">
        {/* Image */}
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

        {/* Body */}
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
            {product.includes && (
              <p className="text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Incluye:</span>{" "}
                {product.includes}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              {product.price == null ? "—" : formatCurrency(product.price)}
            </span>
            {hasOptions && (
              <span className="text-xs text-zinc-500">
                {product.optionGroups.length}{" "}
                {product.optionGroups.length === 1 ? "grupo de opciones" : "grupos de opciones"}
              </span>
            )}
          </div>

          {/* CTA — products WITH options open the modal; without options use inline counter */}
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
