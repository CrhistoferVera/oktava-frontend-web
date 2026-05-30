'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OrderCard } from './OrderCard';
import { Filters, FILTER_STATUS_MAP } from './Filters';
import type { Order, OrderStatus } from '@/types/order.types';

interface Props {
  orders: Order[];
  loading: boolean;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  autoSelectedOrderId?: string | null;
}

function orderMatchesSearch(order: Order, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return [
    order.orderNumber,
    order.user?.firstName,
    order.user?.lastName,
    order.user?.phone ?? '',
    order.address?.direction ?? '',
  ].some((field) => field?.toLowerCase().includes(q));
}

const STATUS_PRIORITY: Partial<Record<OrderStatus, number>> = {
  PENDING: 1,
  ACCEPTED: 2,
  PREPARING: 3,
  ON_THE_WAY: 4,
  PICKED_UP: 4,
  PENDING_PAYMENT: 5,
  PAYMENT_FAILED: 6,
  COMPLETED: 7,
  CANCELLED: 8,
};

const ACTIVE_FILTER_STATUSES: ReadonlySet<OrderStatus> = new Set([
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'ON_THE_WAY',
  'PICKED_UP',
]);

function sortOrders(list: Order[], activeFilter: string): Order[] {
  const arr = [...list];

  if (activeFilter === 'Entregados' || activeFilter === 'Cancelados') {
    return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  if (activeFilter === 'Activos' || activeFilter === 'Todos') {
    return arr.sort((a, b) => {
      const pa = STATUS_PRIORITY[a.status] ?? 99;
      const pb = STATUS_PRIORITY[b.status] ?? 99;
      if (pa !== pb) return pa - pb;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function OrdersGrid({ orders, loading, onStatusChange, autoSelectedOrderId }: Props) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('Activos');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const autoSelectConsumedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!autoSelectedOrderId || autoSelectedOrderId === autoSelectConsumedRef.current) return;
    autoSelectConsumedRef.current = autoSelectedOrderId;
    const incoming = orders.find((order) => order.id === autoSelectedOrderId);
    if (!incoming) return;
    setExpandedOrderId((prev) => {
      if (!prev) return incoming.id;
      const current = orders.find((order) => order.id === prev);
      if (!current || current.status === 'COMPLETED' || current.status === 'CANCELLED') return incoming.id;
      return prev;
    });
  }, [autoSelectedOrderId, orders]);

  const handleToggle = useCallback((order: Order) => {
    setExpandedOrderId((prev) => (prev === order.id ? null : order.id));
  }, []);

  const statusFiltered = useMemo(() => {
    if (activeFilter === 'Activos') {
      return orders.filter((order) => ACTIVE_FILTER_STATUSES.has(order.status));
    }

    const mappedStatus = FILTER_STATUS_MAP[activeFilter];
    return mappedStatus === null ? orders : orders.filter((order) => order.status === mappedStatus);
  }, [orders, activeFilter]);

  const displayOrders = useMemo(
    () => sortOrders(statusFiltered.filter((order) => orderMatchesSearch(order, globalFilter)), activeFilter),
    [statusFiltered, globalFilter, activeFilter],
  );

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts.Todos = orders.length;
    counts.Activos = orders.filter((order) => ACTIVE_FILTER_STATUSES.has(order.status)).length;

    Object.entries(FILTER_STATUS_MAP).forEach(([label, status]) => {
      if (status !== null) counts[label] = orders.filter((order) => order.status === status).length;
    });

    return counts;
  }, [orders]);

  return (
    <>
      <div className="mb-4 flex flex-col items-start gap-3 md:flex-row md:items-center">
        <div className="relative shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Buscar por #pedido, cliente..."
            className="w-64 rounded-lg border border-zinc-700 bg-[#282828] py-2 pl-8 pr-3 text-sm text-zinc-300 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <Filters value={activeFilter} onChange={setActiveFilter} counts={filterCounts} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-xl border border-zinc-800 border-t-zinc-700 bg-[#161616] border-t-2" />
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/20 py-20 text-center">
          <span className="mb-3 text-4xl">!</span>
          <p className="text-sm font-semibold text-zinc-600">Sin pedidos</p>
          <p className="mt-1 text-xs text-zinc-700">
            {globalFilter ? 'Ningún pedido coincide con la búsqueda' : 'No hay pedidos en este filtro'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
          {displayOrders.map((order) => {
            const isExpanded = order.id === expandedOrderId;
            return (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={isExpanded}
                onToggle={handleToggle}
                onStatusChange={onStatusChange}
                className={isExpanded ? 'md:col-span-2' : ''}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

