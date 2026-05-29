import { AlertCircle, AlertTriangle, CheckCircle, CheckSquare, Hourglass, ScanSearch, Truck, XCircle, Zap } from 'lucide-react';
import { OrderStatus } from '@/types';

export const FILTER_STATUS_MAP: Record<string, OrderStatus | null> = {
  'Todos':           null,
  'Pendientes':      'PENDING',
  'Aceptados':       'ACCEPTED',
  'Preparando':      'PREPARING',
  'En camino':       'ON_THE_WAY',
  'Entregados':      'COMPLETED',
  'Cancelados':      'CANCELLED',
  'Pago pendiente':  'PENDING_PAYMENT',
  'Pago fallido':    'PAYMENT_FAILED',
};

const filters: { name: string; icon?: React.ReactNode }[] = [
  { name: 'Todos' },
  { name: 'Activos',        icon: <Zap          size={14} color="#22c55e" /> },
  { name: 'Pendientes',     icon: <Hourglass    size={14} color="#eab308" /> },
  { name: 'Aceptados',      icon: <CheckSquare  size={14} color="#2dd4bf" /> },
  { name: 'Preparando',     icon: <ScanSearch   size={14} color="#3b82f6" /> },
  { name: 'En camino',      icon: <Truck        size={14} color="#a855f7" /> },
  { name: 'Entregados',     icon: <CheckCircle  size={14} color="#22c55e" /> },
  { name: 'Cancelados',     icon: <XCircle      size={14} color="#71717a" /> },
  { name: 'Pago pendiente', icon: <AlertCircle  size={14} color="#f97316" /> },
  { name: 'Pago fallido',   icon: <AlertTriangle size={14} color="#ef4444" /> },
];

interface Props {
  value: string;
  onChange: (name: string) => void;
  counts?: Record<string, number>;
}

export const Filters = ({ value, onChange, counts = {} }: Props) => {
  return (
    <div className="flex gap-1.5 mt-2 md:mt-0 flex-wrap">
      {filters.map(filter => {
        const count = counts[filter.name] ?? 0;
        const showBadge = filter.name !== 'Todos' && count > 0;
        return (
          <button
            key={filter.name}
            onClick={() => onChange(filter.name)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border focus:outline-none hover:bg-zinc-800 transition-colors text-[11px] font-medium
              ${value === filter.name
                ? 'bg-zinc-700 border-zinc-400 text-zinc-100'
                : 'bg-[#0D0D0D] border-zinc-700 text-zinc-400'
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
  );
};
