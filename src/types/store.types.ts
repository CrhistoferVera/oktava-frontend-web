export interface BusinessHour {
  id?: string;
  /** 0=Domingo .. 6=Sábado (convención JS getDay). */
  dayOfWeek: number;
  isClosed: boolean;
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm"
}

export interface StoreSettings {
  id: number;
  ordersPaused: boolean;
  pauseMessage: string | null;
  updatedAt: string;
}

export interface StoreStatus {
  isOpen: boolean;
  paused: boolean;
  message: string;
  today?: {
    dayOfWeek: number;
    isClosed: boolean;
    openTime: string;
    closeTime: string;
  };
}

export interface UpdateHoursPayload {
  days: BusinessHour[];
}

export interface UpdateSettingsPayload {
  ordersPaused: boolean;
  pauseMessage?: string;
}
