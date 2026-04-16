import { api } from '@/lib/axios';
import { Client, UpdateClientPayload, UpdateClientResponse } from '@/types/client.types';

export const userService = {
  getClients: async (search?: string): Promise<Client[]> => {
    const params = search?.trim() ? { search: search.trim() } : {};
    const { data } = await api.get<Client[]>('/users', { params });
    return data;
  },

  updateClient: async (
    id: string,
    payload: UpdateClientPayload,
  ): Promise<UpdateClientResponse> => {
    const body: Record<string, unknown> = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      isActive: payload.isActive,
    };
    // Only send phone if non-empty — avoids storing empty strings in DB
    if (payload.phone?.trim()) {
      body.phone = payload.phone.trim();
    }
    const { data } = await api.patch<UpdateClientResponse>(`/users/${id}`, body);
    return data;
  },

  deactivateClient: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
