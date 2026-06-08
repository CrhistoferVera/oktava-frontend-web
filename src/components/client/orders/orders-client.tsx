"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthRequiredModal } from "@/components/ui/AuthRequiredModal";
import { OrdersEmptyState } from "@/components/client/orders/orders-empty-state";
import { OrderDetailDrawer } from "@/components/client/orders/order-detail-drawer";
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

export default function OrdersClient() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Abrir modal automáticamente si el usuario llega a la página sin sesión
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthModalOpen(true);
    }
  }, [authLoading, user]);

  // Cargar pedidos solo cuando hay sesión activa
  useEffect(() => {
    if (authLoading || !user) return;
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  // Skeleton mientras auth carga
  if (authLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  // Sin sesión: modal + mensaje estático si el modal se cierra
  if (!user) {
    return (
      <>
        <AuthRequiredModal
          open={authModalOpen}
          message="Necesitas iniciar sesión o registrarte para ver tus pedidos."
          confirmHref="/sign-in?redirect=/orders"
          onCancel={() => setAuthModalOpen(false)}
        />
        {/* Si el usuario cierra el modal, mostrar un CTA en lugar del contenido vacío */}
        {!authModalOpen && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <p className="font-semibold text-white text-base">
              Inicia sesión para ver tus pedidos
            </p>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </>
    );
  }

  // Con sesión: lista de pedidos
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

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}
      {!loading && orders.length === 0 && <OrdersEmptyState />}
      {!loading && orders.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              className="oktava-surface w-full rounded-2xl p-5 space-y-4 text-left cursor-pointer transition hover:border-white/20 hover:bg-white/5"
              onClick={() => setSelectedOrderId(order.id)}
            >
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
                <p>{order.orderType === "DELIVERY" ? "Delivery" : "Recojo en local"}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white">{formatCurrency(Number(order.total))}</p>
                <span className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition">
                  Ver detalle <ChevronRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <OrderDetailDrawer
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </section>
  );
}
