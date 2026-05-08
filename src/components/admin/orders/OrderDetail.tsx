'use client'
import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin, Copy, Check } from "lucide-react";
import { Order, OrderStatus, OrderType } from "@/types";
import { TipoBadge } from "./OrdersTable";
import { OrderList } from "./OrderList";
import { OrderSummary } from "./OrderSummary";

interface Props {
  order?: Order | null;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

// ─── Etiquetas y estilos ──────────────────────────────────────────────────────

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

// ─── Flujo de estados siguientes ─────────────────────────────────────────────

function getNextStatuses(status: OrderStatus, orderType: OrderType): OrderStatus[] {
  switch (status) {
    case 'PENDING':    return ['PREPARING', 'CANCELLED'];
    case 'PREPARING':  return orderType === 'DELIVERY' ? ['ON_THE_WAY', 'CANCELLED'] : ['PICKED_UP', 'CANCELLED'];
    case 'ON_THE_WAY': return ['COMPLETED'];
    case 'PICKED_UP':  return ['COMPLETED'];
    default:           return [];
  }
}

const actionLabel: Partial<Record<OrderStatus, string>> = {
  PREPARING:  'Confirmar preparación',
  ON_THE_WAY: 'Marcar en camino',
  PICKED_UP:  'Listo para recoger',
  COMPLETED:  'Marcar completado',
  CANCELLED:  'Cancelar pedido',
};

// ─── Badge de estado (solo visual) ───────────────────────────────────────────

function EstadoBadge({ status }: { readonly status: OrderStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

// ─── Dropdown selector de estado (header) ────────────────────────────────────

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PREPARING', 'ON_THE_WAY', 'PICKED_UP', 'CANCELLED', 'COMPLETED'];

function StatusDropdown({ status, onSelect }: {
  readonly status: OrderStatus;
  readonly onSelect: (s: OrderStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col items-end gap-1">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-opacity hover:opacity-80 ${statusStyles[status]}`}
      >
        {statusLabel[status]}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-7 right-0 z-20 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-xl overflow-hidden w-40">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { onSelect(s); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5 ${s === status ? 'opacity-40 cursor-default' : ''} ${statusStyles[s].replace(/bg-\S+/, '').replace(/border\S+/, '').trim()}`}
            >
              {statusLabel[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Botones de acción contextual (footer) ────────────────────────────────────

function ActionButtons({ order, onStatusChange }: {
  readonly order: Order;
  readonly onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const nextStatuses = getNextStatuses(order.status, order.orderType);
  if (nextStatuses.length === 0) return null;

  const [primary, ...rest] = nextStatuses;

  return (
    <div className="px-5 pt-4 pb-3 border-t border-gray-800 flex flex-col gap-2">
      {/* Acción principal — siempre el paso positivo siguiente */}
      <button
        onClick={() => onStatusChange(order.id, primary)}
        className="w-full py-2.5 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-colors"
      >
        {actionLabel[primary] ?? statusLabel[primary]}
      </button>

      {/* Resto de acciones secundarias (ej: Cancelar) */}
      {rest.map(s => (
        <button
          key={s}
          onClick={() => onStatusChange(order.id, s)}
          className="w-full py-2 rounded-lg text-xs font-semibold bg-transparent hover:bg-white/5 text-gray-500 hover:text-gray-300 border border-gray-700 transition-colors"
        >
          {actionLabel[s] ?? statusLabel[s]}
        </button>
      ))}
    </div>
  );
}

// ─── Acciones de dirección ────────────────────────────────────────────────────

function AddressActions({ address }: { readonly address: NonNullable<Order['address']> }) {
  const [copied, setCopied] = useState(false);

  const mapsUrl = `https://www.google.com/maps?q=${address.latitude},${address.longitude}`;
  const fullAddress = [address.direction, address.departament, address.reference]
    .filter(Boolean)
    .join(', ');

  const handleCopy = () => {
    navigator.clipboard.writeText(mapsUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex gap-2 mt-2">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-blue-900/30 border border-blue-800 text-blue-400 hover:bg-blue-900/50 transition-colors text-[11px] font-semibold"
      >
        <MapPin className="w-3 h-3" />
        Ver en Maps
      </a>
      <button
        onClick={handleCopy}
        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border transition-colors text-[11px] font-semibold
          ${copied
            ? 'bg-green-900/30 border-green-800 text-green-400'
            : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:bg-gray-700/60'
          }`}
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export const OrderDetail = ({ order, onStatusChange }: Props) => {
  const clientName = order?.user
    ? `${order.user.firstName} ${order.user.lastName}`
    : '—';

  const clientEmail = order?.user?.email ?? '—';

  const hora = order
    ? new Date(order.createdAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
    : '';

  const handleSelect = (newStatus: OrderStatus) => {
    if (order && onStatusChange) onStatusChange(order.id, newStatus);
  };

  return (
    <div className="bg-[#161616] border border-gray-800 rounded-lg py-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
      {order ? (
        <div className="text-white">
          {/* Header: número, hora, badges */}
          <div className="px-5 py-1 pb-2 border-b border-gray-800 flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-red-700 font-bold font-roboto-condensed text-3xl">{order.orderNumber}</p>
              <p className="text-sm text-gray-700">Hoy {hora}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <StatusDropdown status={order.status} onSelect={handleSelect} />
              <TipoBadge orderType={order.orderType} />
            </div>
          </div>

          {/* Info del cliente */}
          <div className="px-5 py-3 border-b border-gray-800 text-[12px]">
            <p className="text-gray-700 font-bold pb-0.5">CLIENTE:</p>
            <div className="bg-gray-600/20 rounded-lg border border-gray-800">
              <div className="flex justify-between border-b border-gray-800">
                <p className="px-3 py-1.5 text-gray-600">Nombre:</p>
                <p className="px-3 py-1.5 text-white font-semibold">{clientName}</p>
              </div>
              <div className="flex justify-between border-b border-gray-800">
                <p className="px-3 py-1.5 text-gray-600">Teléfono:</p>
                <p className="px-3 py-1.5 text-white font-semibold">{order.user?.phone ?? '—'}</p>
              </div>
              <div className="flex justify-between">
                <p className="px-3 py-1.5 text-gray-600">Dirección:</p>
                <p className="px-3 py-1.5 text-white font-semibold text-right">{order.address?.direction ?? '—'}</p>
              </div>
            </div>

            {/* Acciones de dirección */}
            {order.address && (
              <AddressActions address={order.address} />
            )}
          </div>

          {/* Ítems y resumen */}
          <div className="px-5 py-3 border-b border-gray-800 text-[12px]">
            <OrderList orderDetail={order.items} />
            <OrderSummary subtotal={order.subtotal} deliveryFee={order.deliveryFee} total={order.total} />
          </div>

          {/* Acciones contextuales */}
          {onStatusChange && <ActionButtons order={order} onStatusChange={onStatusChange} />}
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
