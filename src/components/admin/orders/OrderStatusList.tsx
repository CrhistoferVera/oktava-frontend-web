import { OrderStatusCardProps } from "@/types/order.types"
import { Hourglass, ScanSearch, Truck, CheckCircle, XCircle } from "lucide-react"
import { OrderStatusCard } from "./OrderStatusCard"

const initialState: OrderStatusCardProps[] = [
  {
    value: '3',
    name: 'Pendientes',
    icon: <Hourglass size={36} color="orange"/>,
    color: 'orange',
  },
  {
    value: '2',
    name: 'Preparando',
    icon: <ScanSearch size={36} color="blue"/>,
    color: 'blue',
  },
  {
    value: '1',
    name: 'En camino',
    icon: <Truck size={36} color="red"/>,
    color: 'red',
  },
  {
    value: '3',
    name: 'Entregados hoy',
    icon: <CheckCircle size={36} color="green"/>,
    color: 'green',
  },
  {
    value: '1',
    name: 'Cancelados',
    icon: <XCircle size={36} color="gray"/>,
    color: 'gray',
  },
]

export const OrderStatusList = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      {initialState.map((card) => (
        <OrderStatusCard key={card.name} {...card} />
      ))}
    </div>
  )
}
