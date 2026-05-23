'use client';

import { api } from '@/lib/axios';

// ─── Tipos de request ─────────────────────────────────────────────────────────

export interface NiubizSessionItem {
  productId: string;
  quantity: number;
}

export interface CreateNiubizSessionPayload {
  orderType: 'DELIVERY' | 'PICKUP';
  addressId?: string;
  notes?: string;
  items: NiubizSessionItem[];
}

// ─── Tipos de respuesta ───────────────────────────────────────────────────────

export interface NiubizSessionResponse {
  orderId: string;
  orderNumber: string;
  sessionKey: string;
  purchaseNumber: string;
  merchantId: string;
  amount: number;
  currency: string;
  channel: string;
}

export interface NiubizAuthorizeResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentStatus: 'paid' | 'failed';
  orderStatus: string;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const paymentService = {
  /**
   * Crea la orden en PENDING_PAYMENT y obtiene la sessionKey de Niubiz.
   * El backend calcula el monto; el frontend NO debe enviar `amount`.
   */
  async createNiubizSession(
    payload: CreateNiubizSessionPayload,
  ): Promise<NiubizSessionResponse> {
    const { data } = await api.post<NiubizSessionResponse>(
      '/payments/niubiz/session',
      payload,
    );
    return data;
  },

  /**
   * Autoriza el cargo con el transactionToken generado por el widget JS de Niubiz.
   * El backend busca el monto desde la BD usando orderId.
   */
  async authorizeNiubizPayment(params: {
    orderId: string;
    transactionToken: string;
  }): Promise<NiubizAuthorizeResponse> {
    const { data } = await api.post<NiubizAuthorizeResponse>(
      '/payments/niubiz/authorize',
      params,
    );
    return data;
  },
};

// ─── Declaración de tipos para el widget JS de Niubiz ────────────────────────

declare global {
  interface Window {
    VisanetCheckout?: {
      configure(options: {
        sessiontoken: string;
        channel: string;
        merchantid: string;
        purchasenumber: string;
        amount: string;
        currency: string;
        complete: (params: { transactionToken: string }) => void;
        cancel: () => void;
      }): void;
      open(): void;
    };
  }
}
