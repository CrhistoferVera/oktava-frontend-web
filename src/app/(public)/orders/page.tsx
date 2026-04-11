import { OrdersEmptyState } from "@/components/client/orders/orders-empty-state";
import { storefrontService } from "@/services/storefront.service";

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

export default async function ClientOrdersPage() {
  const orders = await storefrontService.getOrderSummaries();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl leading-none text-white [font-family:var(--font-display)] md:text-5xl">
          Mis pedidos
        </h1>
        <p className="text-sm text-zinc-400 md:text-base">
          Esta vista ya esta lista para consumir pedidos reales desde backend.
        </p>
      </header>

      {orders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <article key={order.id} className="oktava-surface rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white">#{order.code}</p>
                <p className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-200">
                  {order.status}
                </p>
              </div>
              <p className="mt-4 text-sm text-zinc-400">
                {order.itemCount} items
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Fecha: {formatDate(order.createdAt)}
              </p>
              <p className="mt-4 text-xl font-bold text-white">
                {formatCurrency(order.total)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
