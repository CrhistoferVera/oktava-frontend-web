'use client';

import { api } from '@/lib/axios';
import type { Address, AddressPayload } from '@/types/address.types';

export const addressService = {
  getAll: async (): Promise<Address[]> => {
    const { data } = await api.get<Address[]>('/addresses');
    return data;
  },

  create: async (payload: AddressPayload): Promise<Address> => {
    const { data } = await api.post<Address>('/addresses', payload);
    return data;
  },

  update: async (id: string, payload: Partial<AddressPayload>): Promise<Address> => {
    const { data } = await api.patch<Address>(`/addresses/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
};
