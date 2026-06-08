'use client';

import { api } from '@/lib/axios';
import type { Order, CreateOrderDto } from '@/types/order.types';

export const orderService = {
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const { data } = await api.post<Order>('/orders', dto);
    return data;
  },

  async getMyOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>('/orders/my');
    return data;
  },

  async getById(id: string): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  async confirmReceived(id: string): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${id}/confirm-received`);
    return data;
  },
};
