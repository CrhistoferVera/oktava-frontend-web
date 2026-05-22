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
  CANCELLED:  'bg-zinc-800 text-zinc-400 border border-zinc-600',
  COMPLETED:  'bg-green-900/60 text-green-400 border border-green-700',
};

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

// ─── StatusDropdown ───────────────────────────────────────────────────────────

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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-opacity hover:opacity-80 ${statusStyles[status]}`}
      >
        {statusLabel[status]}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-9 right-0 z-20 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden w-44">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { onSelect(s); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-white/5 ${s === status ? 'opacity-40 cursor-default' : ''} ${statusStyles[s].replace(/bg-\S+/, '').replace(/border\S+/, '').trim()}`}
            >
              {statusLabel[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ActionButtons ────────────────────────────────────────────────────────────

function ActionButtons({ order, onStatusChange }: {
  readonly order: Order;
  readonly onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const nextStatuses = getNextStatuses(order.status, order.orderType);
  if (nextStatuses.length === 0) return null;

  const [primary, ...rest] = nextStatuses;

  return (
    <div className="px-5 pt-4 pb-5 border-t border-zinc-800 flex flex-col gap-2">
      <button
        onClick={() => onStatusChange(order.id, primary)}
        className="w-full py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-colors"
      >
        {actionLabel[primary] ?? statusLabel[primary]}
      </button>
      {rest.map(s => (
        <button
          key={s}
          onClick={() => onStatusChange(order.id, s)}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-transparent hover:bg-white/5 text-zinc-500 hover:text-zinc-300 border border-zinc-800 transition-colors"
        >
          {actionLabel[s] ?? statusLabel[s]}
        </button>
      ))}
    </div>
  );
}

// ─── AddressActions ───────────────────────────────────────────────────────────

function AddressActions({ address }: { readonly address: NonNullable<Order['address']> }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = `https://www.google.com/maps?q=${address.latitude},${address.longitude}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mapsUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex gap-2 mt-3">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-900/20 border border-blue-800/60 text-blue-400 hover:bg-blue-900/40 transition-colors text-xs font-semibold"
      >
        <MapPin className="w-3.5 h-3.5" />
        Ver en Maps
      </a>
      <button
        onClick={handleCopy}
        className={`flex flex-1 items-center justify-center gap-1.5 py-2 rounded-xl border transition-colors text-xs font-semibold
          ${copied
            ? 'bg-green-900/30 border-green-800/60 text-green-400'
            : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200'
          }`}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copiado' : 'Copiar link'}
      </button>
    </div>
  );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-zinc-800/60 last:border-0">
      <span className="text-xs text-zinc-600 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-white text-right">{value}</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export const OrderDetail = ({ order, onStatusChange }: Props) => {
  const clientName = order?.user
    ? `${order.user.firstName} ${order.user.lastName}`
    : '—';

  const hora = order
    ? new Date(order.createdAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
    : '';

  const fecha = order
    ? new Date(order.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })
    : '';

  const handleSelect = (newStatus: OrderStatus) => {
    if (order && onStatusChange) onStatusChange(order.id, newStatus);
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 py-16 text-center">
        <span className="text-5xl">🧾</span>
        <p className="text-sm font-semibold text-zinc-600">Selecciona un pedido</p>
        <p className="text-xs text-zinc-700">Haz clic en cualquier fila de la tabla</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

      {/* ── Header ── */}
      <div className="bg-zinc-900/80 px-6 py-4 border-b border-zinc-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-black tracking-tight text-red-500 font-roboto-condensed">
              {order.orderNumber}
            </p>
            <p className="mt-0.5 text-xs text-zinc-600">
              {fecha} · {hora}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusDropdown status={order.status} onSelect={handleSelect} />
            <TipoBadge orderType={order.orderType} />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">

        {/* ── Cliente ── */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
            Cliente
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4">
            <InfoRow label="Nombre" value={clientName} />
            <InfoRow label="Teléfono" value={order.user?.phone ?? '—'} />
          </div>
        </div>

        {/* ── Dirección (solo DELIVERY) ── */}
        {order.orderType === 'DELIVERY' && (
          <div className="px-6 py-4 border-b border-zinc-800">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              Dirección de entrega
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4">
              <InfoRow label="Calle" value={order.address?.direction ?? '—'} />
              {order.address?.departament && (
                <InfoRow label="Dpto." value={order.address.departament} />
              )}
              {order.address?.reference && (
                <InfoRow label="Referencia" value={order.address.reference} />
              )}
              {order.address?.contact && (
                <InfoRow label="Contacto" value={order.address.contact} />
              )}
            </div>
            {order.address && <AddressActions address={order.address} />}
          </div>
        )}

        {/* ── Ítems ── */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <OrderList orderDetail={order.items} />
        </div>

        {/* ── Totales ── */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <OrderSummary
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            total={order.total}
          />
        </div>

        {/* ── Nota del pedido ── */}
        {order.notes && (
          <div className="px-6 py-4 border-b border-zinc-800">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              Nota del cliente
            </p>
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3 text-sm italic text-amber-300/80">
              {order.notes}
            </div>
          </div>
        )}

        {/* ── Acciones ── */}
        {onStatusChange && <ActionButtons order={order} onStatusChange={onStatusChange} />}
      </div>
    </div>
  );
};
