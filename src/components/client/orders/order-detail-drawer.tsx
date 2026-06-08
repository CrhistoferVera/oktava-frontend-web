"use client";

import { useEffect } from "react";
import {
  X,
  MapPin,
  Store,
  Truck,
  ClipboardList,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types/order.types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pago pendiente",
  PENDING:         "Pendiente",
  ACCEPTED:        "Aceptado",
  PREPARING:       "Preparando",
  ON_THE_WAY:      "En camino",
  PICKED_UP:       "Listo para recoger",
  PAYMENT_FAILED:  "Pago fallido",
  CANCELLED:       "Cancelado",
  COMPLETED:       "Completado",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  PENDING:         "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  ACCEPTED:        "border-teal-500/40 bg-teal-500/10 text-teal-300",
  PREPARING:       "border-blue-500/40 bg-blue-500/10 text-blue-300",
  ON_THE_WAY:      "border-purple-500/40 bg-purple-500/10 text-purple-300",
  PICKED_UP:       "border-green-500/40 bg-green-500/10 text-green-300",
  PAYMENT_FAILED:  "border-red-500/40 bg-red-500/10 text-red-400",
  CANCELLED:       "border-red-500/40 bg-red-500/10 text-red-300",
  COMPLETED:       "border-zinc-500/40 bg-zinc-500/10 text-zinc-400",
};

function formatCurrency(v: number) {
  return `Bs. ${Number(v).toFixed(0)}`;
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailDrawer({ order, onClose }: Props) {
  const isOpen = !!order;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={[
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#0a0a0a] border-l border-white/8 shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-600/20 border border-red-500/30">
              <ClipboardList size={17} className="text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base [font-family:var(--font-display)] uppercase tracking-wide">
                {order ? `#${order.orderNumber}` : "Detalle de orden"}
              </p>
              {order && (
                <p className="text-xs text-zinc-500">{formatDate(order.createdAt)}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/8 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {order && (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Status + Type */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLE[order.status]}`}
              >
                {STATUS_LABEL[order.status]}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                {order.orderType === "DELIVERY"
                  ? <><Truck size={13} className="text-zinc-500" /> Delivery</>
                  : <><Store size={13} className="text-zinc-500" /> Recojo en local</>}
              </span>
            </div>

            {/* Address */}
            {order.orderType === "DELIVERY" && order.address && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5">
                  <MapPin size={12} /> Dirección de entrega
                </p>
                <p className="text-sm font-semibold text-white">{order.address.label}</p>
                <p className="text-xs text-zinc-400">{order.address.direction}</p>
                {order.address.reference && (
                  <p className="text-xs text-zinc-500">Ref: {order.address.reference}</p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Productos
              </p>
              {(order.items ?? []).length === 0 && (
                <p className="text-sm text-zinc-600">Sin detalle de productos.</p>
              )}
              {(order.items ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/6 bg-white/3 p-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-xs font-bold text-red-300">
                      {item.quantity}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight">
                        {item.productName}
                      </p>
                      {item.selectedOptions.length > 0 && (
                        <p className="mt-0.5 text-xs text-zinc-500 leading-snug">
                          {item.selectedOptions.map((o) => o.optionName).join(" · ")}
                          {item.selectedOptions.some((o) => o.extraPrice > 0) && (
                            <span className="ml-1 text-red-400">
                              +{formatCurrency(
                                item.selectedOptions.reduce((acc, o) => acc + o.extraPrice, 0)
                              )}
                            </span>
                          )}
                        </p>
                      )}
                      {item.notes && (
                        <p className="mt-0.5 text-xs text-zinc-600 italic">{item.notes}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white shrink-0">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Instrucciones
                </p>
                <p className="text-sm text-zinc-300">{order.notes}</p>
              </div>
            )}

            {/* Totals */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery</span>
                <span className={Number(order.deliveryFee) === 0 ? "text-green-400" : "text-white"}>
                  {Number(order.deliveryFee) === 0
                    ? order.orderType === "PICKUP" ? "—" : "Gratis"
                    : formatCurrency(Number(order.deliveryFee))}
                </span>
              </div>
              <div className="flex justify-between font-bold text-white text-base pt-1 border-t border-white/8">
                <span>Total</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
