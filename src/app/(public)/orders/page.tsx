import { OrdersEmptyState } from "@/components/client/orders/orders-empty-state";
import { storefrontService } from "@/services/storefront.service";
import type { OrderStatus } from "@/types/storefront.types";

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente",
  preparing: "Preparando",
  ready: "Listo",
  completed: "Completado",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  preparing: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  ready: "border-green-500/40 bg-green-500/10 text-green-300",
  completed: "border-zinc-500/40 bg-zinc-500/10 text-zinc-400",
};

export default async function ClientOrdersPage() {
  const orders = await storefrontService.getOrderSummaries();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
          Historial
        </p>
        <h1 className="text-4xl leading-none text-white [font-family:var(--font-display)] md:text-5xl">
          Mis pedidos
        </h1>
        <p className="text-sm text-zinc-400 md:text-base">
          Revisa el estado y detalle de todas tus órdenes.
        </p>
      </header>

      {orders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <article key={order.id} className="oktava-surface rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white">#{order.code}</p>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLE[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className="space-y-1 text-sm text-zinc-400">
                <p>{order.itemCount} {order.itemCount === 1 ? "producto" : "productos"}</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <p className="text-xl font-bold text-white">
                {formatCurrency(order.total)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
