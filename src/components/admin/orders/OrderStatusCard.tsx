import { OrderStatusCardProps } from "@/types/order.types"
import { Check } from 'lucide-react';

const colorClasses: Record<string, { border: string; text: string; bg: string }> = {
    'green':  { border: 'border-green-400',  text: 'text-green-400',  bg: 'bg-green-500/20' },
    'red':    { border: 'border-red-400',     text: 'text-red-400',    bg: 'bg-red-200/20' },
    'yellow': { border: 'border-yellow-400',  text: 'text-yellow-400', bg: 'bg-yellow-200/20' },
    'blue':   { border: 'border-blue-400',    text: 'text-blue-400',   bg: 'bg-blue-200/25' },
    'purple': { border: 'border-purple-400',  text: 'text-purple-400', bg: 'bg-purple-200/20' },
    'orange': { border: 'border-orange-400',  text: 'text-orange-400', bg: 'bg-orange-200/20' },
}

export const OrderStatusCard = ({
    value = '25',
    name = 'Entregados',
    icon = <Check size={40} color="green" />,
    color = 'green',
}: Partial<OrderStatusCardProps> = {}) => {
  const classes = colorClasses[color] ?? colorClasses['green']

  return (
    <div className={`flex gap-6 bg-[#161616] border ${classes.border} rounded-lg pb-4 pt-4 px-5 pr-15`}>
        <div className={`text-4xl m-auto ${classes.bg} p-1 rounded-lg`}>
            {icon}
        </div>
        <div>
            <h3 className={`text-3xl ${classes.text} font-bold`}>  {value}</h3>
            <h3 className="text-gray-500 text-[12px] font-medium">{name}</h3>
            
        </div>

    </div>
  )
}
