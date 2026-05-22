'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import { OrderStatusList } from '@/components/admin/orders/OrderStatusList';
import { adminOrderService } from '@/services/admin.order.service';
import type { Order, OrderStatus } from '@/types/order.types';

const POLL_INTERVAL = 6000;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const prevCountRef = useRef<number | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [autoSelectedOrderId, setAutoSelectedOrderId] = useState<string | null>(null);

  // Browser tab title reflects pending count
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
            // AudioContext blocked — silent fail
          }
        }
        prevCountRef.current = data.length;
        return data;
      });
    } catch {
      // Keep existing data on network error
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

  const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    try {
      const updated = await adminOrderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o)),
      );
    } catch {
      fetchOrders(true);
    }
  }, [fetchOrders]);

  return (
    <div className="space-y-3">
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
      <OrderStatusList orders={orders} />
      <OrdersTable
        orders={orders}
        loading={loading}
        onStatusChange={handleStatusChange}
        autoSelectedOrderId={autoSelectedOrderId}
      />
    </div>
  );
}
