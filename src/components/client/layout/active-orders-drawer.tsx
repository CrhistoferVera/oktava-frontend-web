'use client';

import { X, Package, ChefHat, Truck, Store, CheckCircle, Clock, CheckCheck } from 'lucide-react';
import { useActiveOrders } from '@/context/ActiveOrdersContext';
import type { Order, OrderStatus } from '@/types/order.types';

// ─── Status stepper config ────────────────────────────────────────────────────

const DELIVERY_STEPS: OrderStatus[] = ['PENDING', 'PREPARING', 'ON_THE_WAY', 'COMPLETED'];
const PICKUP_STEPS: OrderStatus[] = ['PENDING', 'PREPARING', 'PICKED_UP', 'COMPLETED'];

const STEP_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING:    'Recibido',
  PREPARING:  'Preparando',
  ON_THE_WAY: 'En camino',
  PICKED_UP:  'Listo',
  COMPLETED:  'Entregado',
};

const STEP_ICON: Partial<Record<OrderStatus, React.ReactNode>> = {
  PENDING:    <Clock    size={12} />,
  PREPARING:  <ChefHat  size={12} />,
  ON_THE_WAY: <Truck    size={12} />,
  PICKED_UP:  <Store    size={12} />,
  COMPLETED:  <CheckCircle size={12} />,
};

const STATUS_COLOR: Partial<Record<OrderStatus, string>> = {
  PENDING:    'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
  PREPARING:  'text-blue-400   border-blue-500/40   bg-blue-500/10',
  ON_THE_WAY: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  PICKED_UP:  'text-green-400  border-green-500/40  bg-green-500/10',
};

const STATUS_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING:    'Pendiente',
  PREPARING:  'Preparando',
  ON_THE_WAY: 'En camino',
  PICKED_UP:  'Listo para recoger',
};

// ─── Status stepper ───────────────────────────────────────────────────────────

function StatusStepper({ order }: { readonly order: Order }) {
  const steps = order.orderType === 'DELIVERY' ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentIdx = steps.indexOf(order.status as OrderStatus);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const isLast = i === steps.length - 1;
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`grid h-7 w-7 place-items-center rounded-full border text-[11px] transition-colors ${
                  done
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-600'
                }`}
              >
                {STEP_ICON[step]}
              </div>
              <span className={`text-[10px] leading-none text-center w-12 ${done ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {STEP_LABEL[step]}
              </span>
            </div>
            {!isLast && (
              <div className={`h-0.5 flex-1 mx-1 mb-3 rounded transition-colors ${i < currentIdx ? 'bg-red-600' : 'bg-zinc-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Single order card ────────────────────────────────────────────────────────

function ActiveOrderCard({ order }: { readonly order: Order }) {
  const { confirmReceived } = useActiveOrders();

  const canConfirm =
    (order.orderType === 'DELIVERY' && order.status === 'ON_THE_WAY') ||
    (order.orderType === 'PICKUP' && order.status === 'PICKED_UP');

  const statusColors = STATUS_COLOR[order.status as OrderStatus] ?? 'text-zinc-400 border-zinc-600 bg-zinc-800';
  const statusText = STATUS_LABEL[order.status as OrderStatus] ?? order.status;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm font-bold text-red-400">#{order.orderNumber}</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {order.orderType === 'DELIVERY' ? 'Delivery' : 'Recojo en local'}
            {' · '}
            {order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusColors}`}>
          {statusText}
        </span>
      </div>

      {/* Stepper */}
      <StatusStepper order={order} />

      {/* Confirm button */}
      {canConfirm && (
        <button
          type="button"
          onClick={() => confirmReceived(order.id)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 active:scale-[0.98]"
        >
          <CheckCheck size={15} />
          Confirmar que lo recibí
        </button>
      )}
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

export function ActiveOrdersDrawer() {
  const { activeOrders, isDrawerOpen, closeDrawer } = useActiveOrders();

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={closeDrawer}
          aria-hidden
        />
      )}

      <div
        className={[
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[#0a0a0a] border-l border-white/8 shadow-2xl transition-transform duration-300 ease-in-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-600/20 border border-red-500/30">
              <Package size={17} className="text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base [font-family:var(--font-display)] uppercase tracking-wide">
                Pedidos activos
              </p>
              <p className="text-xs text-zinc-500">
                {activeOrders.length === 0
                  ? 'Sin pedidos en curso'
                  : `${activeOrders.length} en curso`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/8 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {activeOrders.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 border border-white/10">
              <Package size={36} className="text-zinc-600" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-white">Sin pedidos activos</p>
              <p className="text-sm text-zinc-500">
                Tus pedidos en curso aparecerán aquí con su estado actualizado.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {activeOrders.map((order) => (
              <ActiveOrderCard key={order.id} order={order} />
            ))}
            <p className="text-center text-[11px] text-zinc-700 pb-2">
              Estado actualizado automáticamente
            </p>
          </div>
        )}
      </div>
    </>
  );
}
