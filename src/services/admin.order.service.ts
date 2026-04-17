'use client';

import { api } from '@/lib/axios';
import type { Order, OrderStatus } from '@/types/order.types';

export const adminOrderService = {
  async getAll(status?: OrderStatus): Promise<Order[]> {
    const params = status ? { status } : {};
    const { data } = await api.get<Order[]>('/orders', { params });
    return data;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${id}/status`, { status });
    return data;
  },
};
