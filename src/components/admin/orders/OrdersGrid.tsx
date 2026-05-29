'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OrderCard } from './OrderCard';
import { Filters, FILTER_STATUS_MAP } from './Filters';
import type { Order, OrderStatus } from '@/types/order.types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  orders: Order[];
  loading: boolean;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  autoSelectedOrderId?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
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
  ].some(f => f?.toLowerCase().includes(q));
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

const STATUS_PRIORITY: Partial<Record<OrderStatus, number>> = {
  PENDING:         1,
  ACCEPTED:        2,
  PREPARING:       3,
  ON_THE_WAY:      4,
  PICKED_UP:       4,
  PENDING_PAYMENT: 5,
  PAYMENT_FAILED:  6,
  COMPLETED:       7,
  CANCELLED:       8,
};

function sortOrders(list: Order[], activeFilter: string): Order[] {
  const arr = [...list];

  // Completados y cancelados: más recientes primero (DESC) para ver los últimos
  if (activeFilter === 'Entregados' || activeFilter === 'Cancelados') {
    return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Activos y Todos: primero por prioridad de estado, luego más antiguos primero (ASC)
  if (activeFilter === 'Activos' || activeFilter === 'Todos') {
    return arr.sort((a, b) => {
      const pa = STATUS_PRIORITY[a.status] ?? 99;
      const pb = STATUS_PRIORITY[b.status] ?? 99;
      if (pa !== pb) return pa - pb;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  // Filtros de estado único: más antiguos primero (urgentes al tope)
  return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function OrdersGrid({ orders, loading, onStatusChange, autoSelectedOrderId }: Props) {
  const [globalFilter,   setGlobalFilter]   = useState('');
  const [activeFilter,   setActiveFilter]   = useState('Activos');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const autoSelectConsumedRef = useRef<string | null>(null);

  // Expande automáticamente el pedido más nuevo entrante
  useEffect(() => {
    if (!autoSelectedOrderId || autoSelectedOrderId === autoSelectConsumedRef.current) return;
    autoSelectConsumedRef.current = autoSelectedOrderId;
    const incoming = orders.find(o => o.id === autoSelectedOrderId);
    if (!incoming) return;
    setExpandedOrderId(prev => {
      if (!prev) return incoming.id;
      const current = orders.find(o => o.id === prev);
      if (!current || current.status === 'COMPLETED' || current.status === 'CANCELLED') return incoming.id;
      return prev; // mantener la card expandida si está activa
    });
  }, [autoSelectedOrderId, orders]);

  const handleToggle = useCallback((order: Order) => {
    setExpandedOrderId(prev => prev === order.id ? null : order.id);
  }, []);

  // Solo órdenes de hoy
  const baseOrders = useMemo(() => orders.filter(o => isToday(o.createdAt)), [orders]);

  // Filtro de estado
  const statusFiltered = useMemo(() => {
    if (activeFilter === 'Activos') {
      return baseOrders.filter(o =>
        o.status !== 'CANCELLED' && o.status !== 'COMPLETED' && o.status !== 'PAYMENT_FAILED',
      );
    }
    const sf = FILTER_STATUS_MAP[activeFilter];
    return sf === null ? baseOrders : baseOrders.filter(o => o.status === sf);
  }, [baseOrders, activeFilter]);

  // Búsqueda + ordenamiento
  const displayOrders = useMemo(
    () => sortOrders(
      statusFiltered.filter(o => orderMatchesSearch(o, globalFilter)),
      activeFilter,
    ),
    [statusFiltered, globalFilter, activeFilter],
  );

  // Contadores para badges
  const filterCounts = useMemo(() => {
    const c: Record<string, number> = {};
    c['Todos']   = baseOrders.length;
    c['Activos'] = baseOrders.filter(o =>
      o.status !== 'CANCELLED' && o.status !== 'COMPLETED' && o.status !== 'PAYMENT_FAILED',
    ).length;
    Object.entries(FILTER_STATUS_MAP).forEach(([label, status]) => {
      if (status !== null) c[label] = baseOrders.filter(o => o.status === status).length;
    });
    return c;
  }, [baseOrders]);

  return (
    <>
      {/* ── Buscador + Filtros ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
        <div className="relative shrink-0">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar por #pedido, cliente..."
            className="bg-[#282828] text-zinc-300 text-sm pl-8 pr-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-zinc-500 w-64"
          />
        </div>
        <Filters value={activeFilter} onChange={setActiveFilter} counts={filterCounts} />
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-[#161616] border border-t-2 border-zinc-800 border-t-zinc-700 h-48 animate-pulse" />
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-zinc-800 bg-zinc-900/20">
          <span className="text-4xl mb-3">🧾</span>
          <p className="text-sm font-semibold text-zinc-600">Sin pedidos</p>
          <p className="text-xs text-zinc-700 mt-1">
            {globalFilter ? 'Ningún pedido coincide con la búsqueda' : 'No hay pedidos en este filtro'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
          {displayOrders.map(order => {
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
