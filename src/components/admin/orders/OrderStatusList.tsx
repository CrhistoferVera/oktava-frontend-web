import { CheckSquare, Hourglass, ScanSearch, Truck, CheckCircle, XCircle } from 'lucide-react';
import { OrderStatusCard } from './OrderStatusCard';
import type { Order, OrderStatus } from '@/types/order.types';

interface Props {
  readonly orders: Order[];
}

const ACTIVE_STATUSES: ReadonlySet<OrderStatus> = new Set([
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'ON_THE_WAY',
  'PICKED_UP',
]);

const EXCLUDED_REVENUE_STATUSES: ReadonlySet<OrderStatus> = new Set([
  'PENDING_PAYMENT',
  'PAYMENT_FAILED',
  'CANCELLED',
]);

export const OrderStatusList = ({ orders }: Props) => {
  const count = (status: OrderStatus) => orders.filter((order) => order.status === status).length;

  const todayRevenue = orders
    .filter((order) => !EXCLUDED_REVENUE_STATUSES.has(order.status))
    .reduce((sum, order) => sum + Number(order.total), 0);

  const activeCount = orders.filter((order) => ACTIVE_STATUSES.has(order.status)).length;

  const cards = [
    { name: 'Pendientes', value: count('PENDING'), icon: <Hourglass size={28} color="orange" />, color: 'orange' },
    { name: 'Aceptados', value: count('ACCEPTED'), icon: <CheckSquare size={28} color="#2dd4bf" />, color: 'teal' },
    { name: 'Preparando', value: count('PREPARING'), icon: <ScanSearch size={28} color="blue" />, color: 'blue' },
    { name: 'En camino', value: count('ON_THE_WAY'), icon: <Truck size={28} color="#a855f7" />, color: 'purple' },
    { name: 'Entregados hoy', value: count('COMPLETED'), icon: <CheckCircle size={28} color="green" />, color: 'green' },
    { name: 'Cancelados', value: count('CANCELLED'), icon: <XCircle size={28} color="gray" />, color: 'gray' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
          <span className="font-bold text-white">{orders.length}</span> pedidos hoy
        </span>
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
          Bs. <span className="font-bold text-green-400">{todayRevenue.toFixed(0)}</span> en ingresos
        </span>
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
          <span className="font-bold text-red-400">{activeCount}</span> activos ahora
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <OrderStatusCard key={card.name} {...card} value={String(card.value)} />
        ))}
      </div>
    </div>
  );
};

