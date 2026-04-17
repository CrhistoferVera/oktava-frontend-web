import { Hourglass, ScanSearch, Truck, CheckCircle, XCircle } from "lucide-react"
import { OrderStatusCard } from "./OrderStatusCard"
import type { Order } from "@/types/order.types"

interface Props {
  readonly orders: Order[]
}

export const OrderStatusList = ({ orders }: Props) => {
  const count = (status: string) => orders.filter(o => o.status === status).length

  const cards = [
    { name: 'Pendientes',    value: count('PENDING'),   icon: <Hourglass   size={32} color="orange" />, color: 'orange' },
    { name: 'Preparando',    value: count('PREPARING'), icon: <ScanSearch  size={32} color="blue"   />, color: 'blue'   },
    { name: 'En camino',     value: count('ON_THE_WAY'),icon: <Truck       size={32} color="red"    />, color: 'red'    },
    { name: 'Entregados hoy',value: count('COMPLETED'), icon: <CheckCircle size={32} color="green"  />, color: 'green'  },
    { name: 'Cancelados',    value: count('CANCELLED'), icon: <XCircle     size={32} color="gray"   />, color: 'gray'   },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <OrderStatusCard key={card.name} {...card} value={String(card.value)} />
      ))}
    </div>
  )
}
