"use client";

import { useEffect, useState } from "react";
import { OrdersEmptyState } from "@/components/client/orders/orders-empty-state";
import { orderService } from "@/services/order.service";
import type { Order, OrderStatus } from "@/types/order.types";

function formatCurrency(v: number) {
  return `Bs. ${v.toFixed(0)}`;
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pago pendiente",
  PENDING:         "Pendiente",
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
  PREPARING:       "border-blue-500/40 bg-blue-500/10 text-blue-300",
  ON_THE_WAY:      "border-purple-500/40 bg-purple-500/10 text-purple-300",
  PICKED_UP:       "border-green-500/40 bg-green-500/10 text-green-300",
  PAYMENT_FAILED:  "border-red-500/40 bg-red-500/10 text-red-400",
  CANCELLED:       "border-red-500/40 bg-red-500/10 text-red-300",
  COMPLETED:       "border-zinc-500/40 bg-zinc-500/10 text-zinc-400",
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Historial</p>
        <h1 className="text-4xl leading-none text-white [font-family:var(--font-display)] md:text-5xl">
          Mis pedidos
        </h1>
        <p className="text-sm text-zinc-400 md:text-base">
          Revisa el estado y detalle de todas tus órdenes.
        </p>
      </header>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <article key={order.id} className="oktava-surface rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white">#{order.orderNumber}</p>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLE[order.status]}`}
                >
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className="space-y-1 text-sm text-zinc-400">
                <p>
                  {order.items?.length ?? 0}{" "}
                  {(order.items?.length ?? 0) === 1 ? "producto" : "productos"}
                </p>
                <p>{formatDate(order.createdAt)}</p>
                <p className="capitalize">{order.orderType === "DELIVERY" ? "Delivery" : "Recojo en local"}</p>
              </div>
              <p className="text-xl font-bold text-white">{formatCurrency(Number(order.total))}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
