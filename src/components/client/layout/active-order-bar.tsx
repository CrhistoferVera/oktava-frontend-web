'use client';

import { ChevronRight, Package } from 'lucide-react';
import { useActiveOrders } from '@/context/ActiveOrdersContext';
import type { OrderStatus } from '@/types/order.types';

const BAR_STYLE: Partial<Record<OrderStatus, { dot: string; border: string; text: string; label: string }>> = {
  PENDING:    { dot: 'bg-yellow-400', border: 'border-l-yellow-500', text: 'text-yellow-400', label: 'Pedido enviado' },
  PREPARING:  { dot: 'bg-blue-400',   border: 'border-l-blue-500',   text: 'text-blue-400',   label: 'Preparando tu pedido' },
  ON_THE_WAY: { dot: 'bg-purple-400', border: 'border-l-purple-500', text: 'text-purple-400', label: 'En camino' },
  PICKED_UP:  { dot: 'bg-green-400',  border: 'border-l-green-500',  text: 'text-green-400',  label: 'Listo para recoger' },
};

export function ActiveOrderBar() {
  const { activeOrders, openDrawer } = useActiveOrders();

  if (activeOrders.length === 0) return null;

  const order = activeOrders[0];
  const style = BAR_STYLE[order.status as OrderStatus] ?? BAR_STYLE.PENDING!;
  const orderId = order.id.slice(-6).toUpperCase();
  const extraCount = activeOrders.length - 1;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`w-full flex items-center gap-3 px-5 py-2.5 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 border-l-4 ${style.border} transition-colors hover:bg-white/[0.03] text-left`}
    >
      <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot} animate-pulse`} />

      <span className="flex flex-1 items-center gap-2 min-w-0 overflow-hidden">
        <span className={`text-sm font-semibold ${style.text}`}>{style.label}</span>
        <span className="text-zinc-600 text-xs">·</span>
        <span className="font-mono text-xs text-zinc-500">#{orderId}</span>
        {extraCount > 0 && (
          <span className="text-xs text-zinc-600">+{extraCount} más</span>
        )}
      </span>

      <span className="flex items-center gap-1 shrink-0">
        <Package size={13} className={style.text} />
        <ChevronRight size={13} className="text-zinc-600" />
      </span>
    </button>
  );
}
