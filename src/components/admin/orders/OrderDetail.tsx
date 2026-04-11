import { Order, OrderStatus } from "@/types";

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
    <div className="bg-[#161616] border border-gray-800 w-[35%] rounded-lg py-3">
      <h2 className="text-gray-700 text-xl font-mono border-b border-gray-800 text-center pb-1">
        DETALLES DEL PEDIDO
      </h2>
      {order ? (
        <div className="text-white">
          <div className="px-5 py-3 border-b border-gray-800 flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-red-700 font-bold font-roboto-condensed text-4xl">{order.orderNumber}</p>
              <p className="text-sm text-gray-700">Hoy {hora}</p>
            </div>
            <EstadoBadge status={order.status} />
          </div>
          <div className="px-5 py-3 border-b border-gray-800 items-center">
            <p className="text-gray-700 text-sm font-bold pb-1">CLIENTE:</p>
            <div className="bg-gray-600/20 rounded-lg border border-gray-800 text-sm">
              <div className="flex justify-between border-b border-gray-800">
                <p className="px-3 py-2 text-gray-600">Nombre:</p>
                <p className="px-3 py-2 text-white font-semibold">{clientName}</p>
              </div>
              <div className="flex justify-between">
                <p className="px-3 py-2 text-gray-600">Email:</p>
                <p className="px-3 py-2 text-white font-semibold">{clientEmail}</p>
              </div>
            </div>
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
