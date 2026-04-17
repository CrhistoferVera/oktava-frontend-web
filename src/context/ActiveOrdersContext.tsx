'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/order.service';
import type { Order, OrderStatus } from '@/types/order.types';

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING', 'PREPARING', 'ON_THE_WAY', 'PICKED_UP'];
const POLL_MS = 8000;

interface ActiveOrdersContextValue {
  activeOrders: Order[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  confirmReceived: (orderId: string) => Promise<void>;
}

const ActiveOrdersContext = createContext<ActiveOrdersContextValue | null>(null);

export function ActiveOrdersProvider({ children }: { readonly children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchActive = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const all = await orderService.getMyOrders();
      if (mountedRef.current) {
        setOrders(all.filter((o) => (ACTIVE_STATUSES as string[]).includes(o.status)));
      }
    } catch {
      // keep existing on error
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) { setOrders([]); return; }
    fetchActive();
    const id = setInterval(fetchActive, POLL_MS);
    return () => clearInterval(id);
  }, [isAuthenticated, fetchActive]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const confirmReceived = useCallback(async (orderId: string) => {
    // optimistic
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await orderService.confirmReceived(orderId);
    } catch {
      fetchActive();
    }
  }, [fetchActive]);

  const value = useMemo<ActiveOrdersContextValue>(
    () => ({ activeOrders: orders, isDrawerOpen, openDrawer, closeDrawer, confirmReceived }),
    [orders, isDrawerOpen, openDrawer, closeDrawer, confirmReceived],
  );

  return (
    <ActiveOrdersContext.Provider value={value}>
      {children}
    </ActiveOrdersContext.Provider>
  );
}

export function useActiveOrders() {
  const ctx = useContext(ActiveOrdersContext);
  if (!ctx) throw new Error('useActiveOrders must be used within ActiveOrdersProvider');
  return ctx;
}
