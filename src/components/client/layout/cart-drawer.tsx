/* eslint-disable @next/next/no-img-element */
"use client";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=400&auto=format&fit=crop";

import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import type { CartItem } from "@/types/storefront.types";

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

function OptionsSummary({ item }: Readonly<{ item: CartItem }>) {
  if (item.selectedOptions.length === 0) return null;

  const parts = item.selectedOptions
    .flatMap((g) => g.items.map((o) => o.name));

  return (
    <p className="mt-0.5 text-xs leading-snug text-zinc-500">
      {parts.join(" · ")}
      {item.extraPrice > 0 && (
        <span className="ml-1 text-red-400">
          +{formatCurrency(item.extraPrice)}
        </span>
      )}
    </p>
  );
}

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    totalItems,
    totalAmount,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useStorefrontCart();

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden
        />
      )}

      {/* Drawer panel */}
      <div
        className={[
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[#0a0a0a] border-l border-white/8 shadow-2xl transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-600/20 border border-red-500/30">
              <ShoppingBag size={17} className="text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base [font-family:var(--font-display)] uppercase tracking-wide">
                Tu pedido
              </p>
              <p className="text-xs text-zinc-500">
                {totalItems === 0
                  ? "Sin productos"
                  : `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/8 hover:text-white"
            aria-label="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 border border-white/10">
              <ShoppingBag size={36} className="text-zinc-600" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-white">Tu carrito está vacío</p>
              <p className="text-sm text-zinc-500">
                Agrega productos desde el menú para comenzar tu pedido.
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10"
            >
              Ver menú
            </button>
          </div>
        ) : (
          <>
            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {items.map((item) => (
                <div
                  key={item._cartId}
                  className="flex gap-3 rounded-2xl border border-white/6 bg-white/3 p-3"
                >
                  {/* Image */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={item.product.imageUrl ?? PLACEHOLDER}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight text-white truncate">
                          {item.product.name}
                        </p>
                        <OptionsSummary item={item} />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item._cartId)}
                        className="shrink-0 text-zinc-600 transition-colors hover:text-red-400"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(
                          ((item.product.price ?? 0) + item.extraPrice) * item.quantity,
                        )}
                      </span>

                      {/* Counter */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item._cartId)}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-red-600/30 hover:text-white hover:border-red-500/40"
                          aria-label="Quitar uno"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item._cartId)}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-red-600/30 hover:text-white hover:border-red-500/40"
                          aria-label="Agregar uno"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/8 px-5 py-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery</span>
                  <span className="text-green-400">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base pt-1 border-t border-white/8">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { closeCart(); router.push("/checkout"); }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-100"
              >
                Proceder con el pedido
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
