import { StatisticCard } from './StatisticCard';
import type { DashboardStats } from '@/types/statistic.types';

interface StatisticListProps {
  stats: DashboardStats;
}

export const StatisticList = ({ stats }: StatisticListProps) => {
  const cards = [
    {
      title: 'PEDIDOS HOY',
      value: String(stats.todayCount),
      valueColor: 'text-red-400',
      emoji: '🧾',
    },
    {
      title: 'INGRESOS HOY',
      value: `Bs. ${stats.todayRevenue.toFixed(0)}`,
      valueColor: 'text-green-400',
      emoji: '💰',
    },
    {
      title: 'ACTIVOS AHORA',
      value: String(stats.activeCount),
      valueColor: 'text-yellow-400',
      emoji: '⚡',
    },
    {
      title: 'PAGO PENDIENTE',
      value: String(stats.pendingPayments),
      valueColor: 'text-orange-400',
      emoji: '⏳',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {cards.map((card, index) => (
        <StatisticCard key={index} {...card} />
      ))}
    </div>
  );
};
