export interface StatisticCardProps {
  title: string;
  value: string;
  valueColor: string;
  emoji: string;
}

/** Métricas calculadas desde GET /orders para el Dashboard Admin */
export interface DashboardStats {
  /** Pedidos creados hoy (cualquier estado) */
  todayCount: number;
  /** Ingresos de pedidos operativos hoy (excluye PENDING_PAYMENT, PAYMENT_FAILED, CANCELLED) */
  todayRevenue: number;
  /** Pedidos activos en este momento en todos los estados operativos */
  activeCount: number;
  /** Pedidos en PENDING_PAYMENT (esperando confirmación de pago Niubiz) */
  pendingPayments: number;
}
