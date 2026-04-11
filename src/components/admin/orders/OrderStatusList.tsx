import { OrderStatusCardProps } from "@/types/order.types"
import { Hourglass, ScanSearch, Truck, CheckCircle, XCircle } from "lucide-react"
import { OrderStatusCard } from "./OrderStatusCard"

const initialState: OrderStatusCardProps[] = [
  {
    value: '3',
    name: 'Pendientes',
    icon: <Hourglass size={32} color="orange"/>,
    color: 'orange',
  },
  {
    value: '2',
    name: 'Preparando',
    icon: <ScanSearch size={32} color="blue"/>,
    color: 'blue',
  },
  {
    value: '1',
    name: 'En camino',
    icon: <Truck size={32} color="red"/>,
    color: 'red',
  },
  {
    value: '3',
    name: 'Entregados hoy',
    icon: <CheckCircle size={32} color="green"/>,
    color: 'green',
  },
  {
    value: '1',
    name: 'Cancelados',
    icon: <XCircle size={32} color="gray"/>,
    color: 'gray',
  },
]

export const OrderStatusList = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {initialState.map((card) => (
        <OrderStatusCard key={card.name} {...card} />
      ))}
    </div>
  )
}
