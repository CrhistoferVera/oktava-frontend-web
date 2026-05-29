import { CheckSquare, Hourglass, ScanSearch, Truck, CheckCircle, XCircle } from "lucide-react"
import { OrderStatusCard } from "./OrderStatusCard"
import type { Order } from "@/types/order.types"

interface Props {
  readonly orders: Order[]
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export const OrderStatusList = ({ orders }: Props) => {
  const count = (status: string) => orders.filter(o => o.status === status).length;

  const todayOrders = orders.filter(o => isToday(o.createdAt));
  const todayRevenue = todayOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + Number(o.total), 0);
  const activeCount = orders.filter(o =>
    o.status === 'PENDING' || o.status === 'ACCEPTED' || o.status === 'PREPARING' || o.status === 'ON_THE_WAY'
  ).length;

  const cards = [
    { name: 'Pendientes',    value: count('PENDING'),    icon: <Hourglass   size={28} color="orange"  />, color: 'orange' },
    { name: 'Aceptados',     value: count('ACCEPTED'),   icon: <CheckSquare size={28} color="#2dd4bf" />, color: 'teal'   },
    { name: 'Preparando',    value: count('PREPARING'),  icon: <ScanSearch  size={28} color="blue"    />, color: 'blue'   },
    { name: 'En camino',     value: count('ON_THE_WAY'), icon: <Truck       size={28} color="#a855f7" />, color: 'purple' },
    { name: 'Entregados hoy',value: count('COMPLETED'),  icon: <CheckCircle size={28} color="green"   />, color: 'green'  },
    { name: 'Cancelados',    value: count('CANCELLED'),  icon: <XCircle     size={28} color="gray"    />, color: 'gray'   },
  ]

  return (
    <div className="space-y-3">
      {/* Resumen del día */}
      <div className="flex gap-2 flex-wrap">
        <span className="rounded-full bg-zinc-900 border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          <span className="font-bold text-white">{todayOrders.length}</span> pedidos hoy
        </span>
        <span className="rounded-full bg-zinc-900 border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          Bs. <span className="font-bold text-green-400">{todayRevenue.toFixed(0)}</span> en ingresos
        </span>
        <span className="rounded-full bg-zinc-900 border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          <span className="font-bold text-red-400">{activeCount}</span> activos ahora
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map((card) => (
          <OrderStatusCard key={card.name} {...card} value={String(card.value)} />
        ))}
      </div>
    </div>
  )
}
