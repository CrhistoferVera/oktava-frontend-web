import { StatisticCardProps } from "@/types/statistic.types"
import { StatisticCard } from "./StatisticCard"

interface StatisticListProps {
    data?: StatisticCardProps[];
};
const initialStats: StatisticCardProps[] = [
    {
        title: 'PEDIDOS HOY',
        value: '148',
        valueColor: 'text-red-800',
        emoji: '🧾'
    },
    {
        title: 'INGRESOS HOY',
        value: '$2,450',
        valueColor: 'text-green-800',
        emoji: '💰'
    },
    {
        title: 'TIEMPO PROM',
        value: '34 min',
        valueColor: 'text-yellow-800',
        emoji: '⏱️'
    },
    {
      title: 'SATISFACCION',
      value: '4.5',
      valueColor: 'text-white',
      emoji: '⭐'
    }
]
export const StatisticList = ({ data = initialStats }: StatisticListProps) => {
  return (
    <div className="flex flex-col  md:flex-row gap-8">
      {data.map((stat, index) => (
        <StatisticCard key={index} {...stat} />
      ))}
    </div>
  )
}
