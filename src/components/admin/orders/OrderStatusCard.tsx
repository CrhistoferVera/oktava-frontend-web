import { OrderStatusCardProps } from "@/types/order.types"
import { Check } from 'lucide-react';

const colorClasses: Record<string, { border: string; text: string; bg: string }> = {
    'green':  { border: 'border-green-400',  text: 'text-green-400',  bg: 'bg-green-500/20' },
    'red':    { border: 'border-red-400',     text: 'text-red-400',    bg: 'bg-red-200/20' },
    'yellow': { border: 'border-yellow-400',  text: 'text-yellow-400', bg: 'bg-yellow-200/20' },
    'blue':   { border: 'border-blue-400',    text: 'text-blue-400',   bg: 'bg-blue-200/25' },
    'purple': { border: 'border-purple-400',  text: 'text-purple-400', bg: 'bg-purple-200/20' },
    'orange': { border: 'border-orange-400',  text: 'text-orange-400', bg: 'bg-orange-200/20' },
    'gray':   { border: 'border-gray-400',    text: 'text-gray-200',   bg: 'bg-gray-200/10' },
    'teal':   { border: 'border-teal-400',    text: 'text-teal-400',   bg: 'bg-teal-400/20' },
}

export const OrderStatusCard = ({
    value = '25',
    name = 'Entregados',
    icon = <Check size={40} color="green" />,
    color = 'green',
}: Partial<OrderStatusCardProps> = {}) => {
  const classes = colorClasses[color] ?? colorClasses['green']

  return (
    <div className={`flex items-center gap-3 bg-[#161616] border ${classes.border} rounded-lg p-3 w-full`}>
      <div className={`shrink-0 ${classes.bg} p-1.5 rounded-lg`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className={`text-2xl sm:text-3xl ${classes.text} font-bold leading-none`}>{value}</h3>
        <p className="text-gray-500 text-[11px] font-medium mt-0.5 truncate">{name}</p>
      </div>
    </div>
  )
}
