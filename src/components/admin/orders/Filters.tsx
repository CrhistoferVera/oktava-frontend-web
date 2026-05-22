import { CheckCircle, Hourglass, ScanSearch, Truck, XCircle } from 'lucide-react'
import { OrderStatus } from '@/types'

export const FILTER_STATUS_MAP: Record<string, OrderStatus | null> = {
  'Todos':      null,
  'Pendientes': 'PENDING',
  'Preparando': 'PREPARING',
  'En camino':  'ON_THE_WAY',
  'Entregados': 'COMPLETED',
  'Cancelados': 'CANCELLED',
}

const filters: { name: string; icon?: React.ReactNode }[] = [
  { name: 'Todos' },
  { name: 'Pendientes', icon: <Hourglass   size={16} color="orange" /> },
  { name: 'Preparando', icon: <ScanSearch  size={16} color="blue"   /> },
  { name: 'En camino',  icon: <Truck       size={16} color="red"    /> },
  { name: 'Entregados', icon: <CheckCircle size={16} color="green"  /> },
  { name: 'Cancelados', icon: <XCircle     size={16} color="gray"   /> },
]

interface Props {
  value: string
  onChange: (name: string) => void
  counts?: Record<string, number>
}

export const Filters = ({ value, onChange, counts = {} }: Props) => {
  return (
    <div className="flex gap-2 mt-2 md:mt-0 text-[11px] text-gray-500 flex-wrap">
      {filters.map(filter => {
        const count = counts[filter.name] ?? 0;
        const showBadge = filter.name !== 'Todos' && count > 0;
        return (
          <button
            key={filter.name}
            onClick={() => onChange(filter.name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border focus:outline-none hover:bg-gray-800 transition-colors
              ${value === filter.name
                ? 'bg-gray-700 border-gray-400 text-gray-200'
                : 'bg-[#0D0D0D] border-gray-700 text-gray-300'
              }`}
          >
            {filter.icon}
            <span className="hidden md:flex items-center gap-1.5">
              {filter.name}
              {showBadge && (
                <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  )
}
