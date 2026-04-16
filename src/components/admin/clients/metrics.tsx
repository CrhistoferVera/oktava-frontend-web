import { useMemo } from 'react';
import { Client, ClientMetricItem } from '@/types/client.types';
import { ClientMetricCard } from '@/components/admin/clients/metric-card';

type ClientsMetricsProps = {
  clients: Client[];
};

export function ClientsMetrics({ clients }: ClientsMetricsProps) {
  const metrics = useMemo((): ClientMetricItem[] => {
    const total = clients.length;

    const avgOrders =
      total === 0
        ? 0
        : Math.round(
            clients.reduce((sum, c) => sum + c.totalOrders, 0) / total,
          );

    const totalOrdersSum = clients.reduce((sum, c) => sum + c.totalOrders, 0);
    const avgTicket =
      totalOrdersSum === 0
        ? 0
        : Math.round(
            clients.reduce((sum, c) => sum + c.totalSpent, 0) / totalOrdersSum,
          );

    const vipCount = clients.filter((c) => c.segment === 'vip').length;

    return [
      {
        label: 'Total Clientes',
        value: String(total),
        subValue: 'registrados',
        trendUp: true,
        icon: 'trend',
      },
      {
        label: 'Promedio Pedidos',
        value: String(avgOrders),
        subValue: 'por cliente',
        icon: 'star',
      },
      {
        label: 'Ticket Promedio',
        value: `${avgTicket} Bs`,
        subValue: 'por pedido',
        icon: 'ticket',
      },
      {
        label: 'Clientes VIP',
        value: String(vipCount),
        subValue: '50+ pedidos',
        icon: 'smile',
      },
    ];
  }, [clients]);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <ClientMetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}
