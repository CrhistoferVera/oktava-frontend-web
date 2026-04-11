import { Order, OrderStatus } from "@/types";
import { TipoBadge } from "./OrdersTable";
import { OrderList } from "./OrderList";
import { OrderSummary } from "./OrderSummary";

interface Props {
  order?: Order | null;
}

const statusLabel: Record<OrderStatus, string> = {
  PENDING:    'Pendiente',
  PREPARING:  'Preparando',
  ON_THE_WAY: 'En camino',
  PICKED_UP:  'Para recoger',
  CANCELLED:  'Cancelado',
  COMPLETED:  'Completado',
};

const statusStyles: Record<OrderStatus, string> = {
  PENDING:    'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  PREPARING:  'bg-blue-900/40 text-blue-400 border border-blue-700',
  ON_THE_WAY: 'bg-red-900/40 text-red-400 border border-red-700',
  PICKED_UP:  'bg-purple-900/40 text-purple-400 border border-purple-700',
  CANCELLED:  'bg-gray-800 text-gray-400 border border-gray-600',
  COMPLETED:  'bg-green-900 text-green-400 border border-green-600',
};

function EstadoBadge({ status }: { readonly status: OrderStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

export const OrderDetail = ({ order }: Props) => {
  const clientName = order?.user
    ? `${order.user.firstName} ${order.user.lastName}`
    : '—';

  const clientEmail = order?.user?.email ?? '—';

  const hora = order
    ? new Date(order.createdAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="bg-[#161616] border border-gray-800  rounded-lg py-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
      {order ? (
        <div className="text-white">
          <div className="px-5 py-1 pb-2 border-b border-gray-800 flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-red-700 font-bold font-roboto-condensed text-4xl">{order.orderNumber}</p>
              <p className="text-sm text-gray-700">Hoy {hora}</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <EstadoBadge status={order.status} />
              <TipoBadge orderType={order.orderType} />
            </div>
          </div>
          <div className="px-5 py-3 border-b border-gray-800 items-center text-[12px]">
            <p className="text-gray-700 font-bold pb-0.5">CLIENTE:</p>
            <div className="bg-gray-600/20 rounded-lg border border-gray-800 ">
              <div className="flex justify-between border-b border-gray-800">
                <p className="px-3 py-1.5 text-gray-600">Nombre:</p>
                <p className="px-3 py-1.5 text-white font-semibold">{clientName}</p>
              </div>
              <div className="flex justify-between border-b border-gray-800">
                <p className="px-3 py-1.5 text-gray-600">Teléfono:</p>
                <p className="px-3 py-1.5 text-white font-semibold">{order.user?.phone ?? '68119348'}</p>
              </div>
              <div className="flex justify-between">
                <p className="px-3 py-1.5 text-gray-600">Direccion:</p>
                <p className="px-3 py-1.5 text-white font-semibold text-right">{order.address?.direction ?? '6811934'}</p>
              </div>
            </div>
          <OrderList orderDetail={order.items}/>
          <OrderSummary  subtotal={order.subtotal} deliveryFee={order.deliveryFee} total={order.total}  />
          </div>
        </div>
      ) : (
        <div className="text-xl text-gray-600 text-center font-bold">
          <p className="text-5xl p-4">🧾</p>
          <p>Seleccione un pedido</p>
        </div>
      )}
    </div>
  );
};
