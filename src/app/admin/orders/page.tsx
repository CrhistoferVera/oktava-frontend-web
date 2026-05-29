'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { OrdersGrid } from '@/components/admin/orders/OrdersGrid';
import { OrderStatusList } from '@/components/admin/orders/OrderStatusList';
import { adminOrderService } from '@/services/admin.order.service';
import type { Order, OrderStatus } from '@/types/order.types';

const POLL_INTERVAL = 6000;

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

export default function OrdersPage() {
  const [orders, setOrders]               = useState<Order[]>([]);
  const [loading, setLoading]             = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [autoSelectedOrderId, setAutoSelectedOrderId] = useState<string | null>(null);
  const prevCountRef = useRef<number | null>(null);

  // Métricas derivadas
  const todayOrders = useMemo(() => orders.filter(o => isToday(o.createdAt)), [orders]);

  const todayRevenue = useMemo(
    () => todayOrders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + Number(o.total), 0),
    [todayOrders],
  );

  const activeCount = useMemo(
    () => todayOrders.filter(o => ['PENDING', 'PREPARING', 'ON_THE_WAY'].includes(o.status)).length,
    [todayOrders],
  );

  const pendingPaymentsCount = useMemo(
    () => todayOrders.filter(o => o.status === 'PENDING_PAYMENT').length,
    [todayOrders],
  );

  // Título del browser tab
  useEffect(() => {
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    document.title = pendingCount > 0 ? `(${pendingCount}) Pedidos — Admin` : 'Pedidos — Admin';
    return () => { document.title = 'Pedidos — Admin'; };
  }, [orders]);

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      const data = await adminOrderService.getAll();
      setOrders(() => {
        if (prevCountRef.current !== null && data.length > prevCountRef.current) {
          setNewOrderAlert(true);
          const newestPending = data.find(o => o.status === 'PENDING');
          if (newestPending) setAutoSelectedOrderId(newestPending.id);
          try {
            const ctx  = new AudioContext();
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
          } catch { /* AudioContext bloqueado */ }
        }
        prevCountRef.current = data.length;
        return data;
      });
    } catch { /* Mantener datos existentes en error de red */ }
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    const id = setInterval(() => fetchOrders(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      const updated = await adminOrderService.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch {
      fetchOrders(true);
    }
  }, [fetchOrders]);

  return (
    <div className="space-y-4">

      {/* ── Alerta nuevo pedido ── */}
      {newOrderAlert && (
        <div className="flex items-center justify-between rounded-lg border border-yellow-600 bg-yellow-900/30 px-4 py-2.5 text-sm font-semibold text-yellow-300">
          <span>🔔 Hay nuevos pedidos entrantes</span>
          <button
            type="button"
            onClick={() => setNewOrderAlert(false)}
            className="text-yellow-500 hover:text-yellow-200 text-xs ml-4"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pedidos de hoy</h1>
          <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            {activeCount} {activeCount === 1 ? 'activo' : 'activos'} · actualizado ahora
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {todayRevenue > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-green-900/60 bg-green-950/30 px-3.5 py-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-green-400">
                Bs. {todayRevenue.toLocaleString('es-BO', { minimumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-zinc-600">ingresos</span>
            </div>
          )}
          {pendingPaymentsCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-orange-900/60 bg-orange-950/30 px-3.5 py-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-400">{pendingPaymentsCount}</span>
              <span className="text-xs text-zinc-600">pagos pendientes</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Cards de resumen por estado ── */}
      <OrderStatusList orders={orders} />

      {/* ── Grid de pedidos ── */}
      <OrdersGrid
        orders={orders}
        loading={loading}
        onStatusChange={handleStatusChange}
        autoSelectedOrderId={autoSelectedOrderId}
      />
    </div>
  );
}
