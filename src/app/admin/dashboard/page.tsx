'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { StatisticList } from '@/components/admin/statistics/StatisticList';
import { RecentOrdersTable } from '@/components/admin/orders/RecentOrdersTable';
import { adminOrderService } from '@/services/admin.order.service';
import type { Order } from '@/types/order.types';
import type { DashboardStats } from '@/types/statistic.types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

// Pedidos operativos: cuentan como ingreso confirmado.
// Excluye PENDING_PAYMENT (pago no completado), PAYMENT_FAILED y CANCELLED.
const REVENUE_STATUSES = new Set([
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'ON_THE_WAY',
  'PICKED_UP',
  'COMPLETED',
]);

// Pedidos activos en el sistema en este momento.
const ACTIVE_STATUSES = new Set([
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'ON_THE_WAY',
  'PICKED_UP',
]);

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await adminOrderService.getAll();
      setOrders(data);
    } catch {
      setError('No se pudieron cargar los datos del dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Pedidos creados hoy (cualquier estado)
  const todayOrders = useMemo(
    () => orders.filter((o) => isToday(o.createdAt)),
    [orders],
  );

  // Métricas calculadas desde los datos reales
  const stats = useMemo<DashboardStats>(
    () => ({
      todayCount: todayOrders.length,
      todayRevenue: todayOrders
        .filter((o) => REVENUE_STATUSES.has(o.status))
        .reduce((sum, o) => sum + Number(o.total), 0),
      activeCount: orders.filter((o) => ACTIVE_STATUSES.has(o.status)).length,
      pendingPayments: orders.filter((o) => o.status === 'PENDING_PAYMENT').length,
    }),
    [orders, todayOrders],
  );

  // Últimos 10 pedidos, más recientes primero
  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10),
    [orders],
  );

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-8 pr-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 h-24 rounded-lg bg-[#161616] border border-gray-800"
            />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-[#161616] border border-gray-800" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-red-800 bg-red-950/40 px-5 py-4 mr-8">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={fetchOrders}
          className="ml-4 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8 pr-8">
      <StatisticList stats={stats} />
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}
