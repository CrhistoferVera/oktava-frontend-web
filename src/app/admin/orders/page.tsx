'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { OrdersGrid } from '@/components/admin/orders/OrdersGrid';
import { OrderStatusList } from '@/components/admin/orders/OrderStatusList';
import { adminOrderService } from '@/services/admin.order.service';
import { isTodayInBolivia } from '@/lib/date-bolivia';
import type { Order, OrderStatus } from '@/types/order.types';

const POLL_INTERVAL = 6000;

const ACTIVE_STATUSES: ReadonlySet<OrderStatus> = new Set([
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'ON_THE_WAY',
  'PICKED_UP',
]);

const OVERDUE_STATUSES: ReadonlySet<OrderStatus> = new Set([
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'ON_THE_WAY',
  'PICKED_UP',
  'PENDING_PAYMENT',
]);

const EXCLUDED_REVENUE_STATUSES: ReadonlySet<OrderStatus> = new Set([
  'PENDING_PAYMENT',
  'PAYMENT_FAILED',
  'CANCELLED',
]);

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [autoSelectedOrderId, setAutoSelectedOrderId] = useState<string | null>(null);
  const [showOverdueOrders, setShowOverdueOrders] = useState(false);
  const prevCountRef = useRef<number | null>(null);

  const todayOrders = useMemo(() => orders.filter((order) => isTodayInBolivia(order.createdAt)), [orders]);

  const overdueOrders = useMemo(
    () => orders.filter((order) => !isTodayInBolivia(order.createdAt) && OVERDUE_STATUSES.has(order.status)),
    [orders],
  );

  const visibleOrders = useMemo(
    () => (showOverdueOrders ? overdueOrders : todayOrders),
    [showOverdueOrders, overdueOrders, todayOrders],
  );

  const todayRevenue = useMemo(
    () =>
      todayOrders
        .filter((order) => !EXCLUDED_REVENUE_STATUSES.has(order.status))
        .reduce((sum, order) => sum + Number(order.total), 0),
    [todayOrders],
  );

  const activeCount = useMemo(
    () => todayOrders.filter((order) => ACTIVE_STATUSES.has(order.status)).length,
    [todayOrders],
  );

  const pendingPaymentsCount = useMemo(
    () => todayOrders.filter((order) => order.status === 'PENDING_PAYMENT').length,
    [todayOrders],
  );

  useEffect(() => {
    const pendingCount = todayOrders.filter((order) => order.status === 'PENDING').length;
    document.title = pendingCount > 0 ? `(${pendingCount}) Pedidos - Admin` : 'Pedidos - Admin';
    return () => {
      document.title = 'Pedidos - Admin';
    };
  }, [todayOrders]);

  useEffect(() => {
    if (!showOverdueOrders || overdueOrders.length > 0) return;
    setShowOverdueOrders(false);
  }, [showOverdueOrders, overdueOrders.length]);

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      const data = await adminOrderService.getAll();
      setOrders(() => {
        if (prevCountRef.current !== null && data.length > prevCountRef.current) {
          setNewOrderAlert(true);
          const newestPending = data.find((order) => order.status === 'PENDING');
          if (newestPending) setAutoSelectedOrderId(newestPending.id);
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
          } catch {
            // AudioContext bloqueado
          }
        }
        prevCountRef.current = data.length;
        return data;
      });
    } catch {
      // Mantener datos existentes en error de red
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const id = setInterval(() => fetchOrders(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
      try {
        const updated = await adminOrderService.updateStatus(orderId, newStatus);
        setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
      } catch {
        fetchOrders(true);
      }
    },
    [fetchOrders],
  );

  return (
    <div className="space-y-4">
      {newOrderAlert && (
        <div className="flex items-center justify-between rounded-lg border border-yellow-600 bg-yellow-900/30 px-4 py-2.5 text-sm font-semibold text-yellow-300">
          <span>Hay nuevos pedidos entrantes</span>
          <button
            type="button"
            onClick={() => setNewOrderAlert(false)}
            className="ml-4 text-xs text-yellow-500 hover:text-yellow-200"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Pedidos de hoy</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            {activeCount} {activeCount === 1 ? 'activo' : 'activos'} · actualizado ahora
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {todayRevenue > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-green-900/60 bg-green-950/30 px-3.5 py-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-bold text-green-400">
                Bs. {todayRevenue.toLocaleString('es-BO', { minimumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-zinc-600">ingresos</span>
            </div>
          )}
          {pendingPaymentsCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-orange-900/60 bg-orange-950/30 px-3.5 py-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-400">{pendingPaymentsCount}</span>
              <span className="text-xs text-zinc-600">pagos pendientes</span>
            </div>
          )}
        </div>
      </div>

      <OrderStatusList orders={todayOrders} />

      {overdueOrders.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-900/70 bg-amber-950/30 px-4 py-2.5">
          <p className="text-sm text-amber-300">
            Aviso: {overdueOrders.length} {overdueOrders.length === 1 ? 'pedido pendiente de un día anterior' : 'pedidos pendientes de días anteriores'}
          </p>
          <button
            type="button"
            onClick={() => setShowOverdueOrders((prev) => !prev)}
            className="rounded-full border border-amber-700/80 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-900/40"
          >
            {showOverdueOrders ? 'Ver pedidos de hoy' : 'Ver atrasados'}
          </button>
        </div>
      )}

      <OrdersGrid
        orders={visibleOrders}
        loading={loading}
        onStatusChange={handleStatusChange}
        autoSelectedOrderId={autoSelectedOrderId}
      />
    </div>
  );
}

