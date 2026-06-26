import { api } from '@/lib/axios';
import type {
  BusinessHour,
  StoreSettings,
  StoreStatus,
  UpdateHoursPayload,
  UpdateSettingsPayload,
} from '@/types/store.types';

export const storeService = {
  /** Estado abierto/cerrado (público). */
  getStatus: async (): Promise<StoreStatus> => {
    const { data } = await api.get<StoreStatus>('/store/status');
    return data;
  },

  /** Los 7 días configurados (admin). */
  getHours: async (): Promise<BusinessHour[]> => {
    const { data } = await api.get<BusinessHour[]>('/store/hours');
    return data;
  },

  /** Guarda el horario de los 7 días (admin). */
  updateHours: async (payload: UpdateHoursPayload): Promise<BusinessHour[]> => {
    const { data } = await api.patch<BusinessHour[]>('/store/hours', payload);
    return data;
  },

  /** Estado de pausa manual (admin). */
  getSettings: async (): Promise<StoreSettings> => {
    const { data } = await api.get<StoreSettings>('/store/settings');
    return data;
  },

  /** Pausar/reanudar pedidos manualmente (admin). */
  updateSettings: async (payload: UpdateSettingsPayload): Promise<StoreSettings> => {
    const { data } = await api.patch<StoreSettings>('/store/settings', payload);
    return data;
  },
};
