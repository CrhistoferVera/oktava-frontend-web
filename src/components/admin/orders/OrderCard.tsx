'use client';

import { useState } from 'react';
import { AlertTriangle, Check, ChevronDown, Clock, Copy, MapPin, Package, Printer } from 'lucide-react';
import type { Order, OrderItem, OrderStatus, OrderType } from '@/types/order.types';
import { OrderList } from './OrderList';
import { OrderSummary } from './OrderSummary';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_BORDER: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'border-t-orange-500',
  PENDING:         'border-t-yellow-500',
  ACCEPTED:        'border-t-teal-500',
  PREPARING:       'border-t-blue-500',
  ON_THE_WAY:      'border-t-purple-500',
  PICKED_UP:       'border-t-purple-500',
  PAYMENT_FAILED:  'border-t-red-600',
  CANCELLED:       'border-t-zinc-600',
  COMPLETED:       'border-t-green-500',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pago pendiente',
  PENDING:         'Pendiente',
  ACCEPTED:        'Aceptado',
  PREPARING:       'Preparando',
  ON_THE_WAY:      'En camino',
  PICKED_UP:       'Para recoger',
  PAYMENT_FAILED:  'Pago fallido',
  CANCELLED:       'Cancelado',
  COMPLETED:       'Entregado',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'bg-orange-900/40 text-orange-400 border border-orange-700',
  PENDING:         'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  ACCEPTED:        'bg-teal-900/40 text-teal-400 border border-teal-700',
  PREPARING:       'bg-blue-900/40 text-blue-400 border border-blue-700',
  ON_THE_WAY:      'bg-purple-900/40 text-purple-400 border border-purple-700',
  PICKED_UP:       'bg-purple-900/40 text-purple-400 border border-purple-700',
  PAYMENT_FAILED:  'bg-red-900/60 text-red-300 border border-red-700',
  CANCELLED:       'bg-zinc-800 text-zinc-400 border border-zinc-600',
  COMPLETED:       'bg-green-900/60 text-green-400 border border-green-700',
};

const STATUS_DOT: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'bg-orange-400',
  PENDING:         'bg-yellow-400',
  ACCEPTED:        'bg-teal-400',
  PREPARING:       'bg-blue-400',
  ON_THE_WAY:      'bg-purple-400',
  PICKED_UP:       'bg-purple-400',
  PAYMENT_FAILED:  'bg-red-400',
  CANCELLED:       'bg-zinc-500',
  COMPLETED:       'bg-green-400',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function elapsedLabel(createdAt: string): string {
  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function elapsedMins(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
}

function isUrgent(createdAt: string, status: OrderStatus): boolean {
  if (status !== 'PENDING' && status !== 'ACCEPTED' && status !== 'PREPARING') return false;
  return elapsedMins(createdAt) >= 10;
}

function timeClass(mins: number, status: OrderStatus): string {
  const isActive = status === 'PENDING' || status === 'ACCEPTED' || status === 'PREPARING';
  if (!isActive) return 'text-zinc-500';
  if (mins >= 30) return 'text-red-400 animate-pulse';
  if (mins >= 10) return 'text-red-400';
  return 'text-zinc-500';
}

function itemsSummary(items?: Order['items']): string {
  if (!items || items.length === 0) return '';
  const preview = items.slice(0, 3).map(i => {
    const firstOpt = i.selectedOptions?.[0]?.optionName;
    return firstOpt ? `${i.quantity}× ${i.productName} (${firstOpt})` : `${i.quantity}× ${i.productName}`;
  });
  const remaining = items.length - 3;
  return preview.join(', ') + (remaining > 0 ? ` +${remaining}` : '');
}

function getCompactAction(status: OrderStatus, orderType: OrderType): { label: string; next: OrderStatus } | null {
  if (status === 'PENDING')    return { label: 'Aceptar pedido',       next: 'ACCEPTED' };
  if (status === 'ACCEPTED')   return { label: 'Iniciar preparación',  next: 'PREPARING' };
  if (status === 'PREPARING')  return { label: orderType === 'DELIVERY' ? 'Marcar en camino' : 'Listo para recoger', next: orderType === 'DELIVERY' ? 'ON_THE_WAY' : 'PICKED_UP' };
  if (status === 'ON_THE_WAY') return { label: 'Marcar entregado',     next: 'COMPLETED' };
  if (status === 'PICKED_UP')  return { label: 'Marcar entregado',     next: 'COMPLETED' };
  return null;
}

// ─── TypeBadge ────────────────────────────────────────────────────────────────

function TypeBadge({ orderType }: { orderType: OrderType }) {
  const label = orderType === 'DELIVERY' ? 'Delivery' : 'Local';
  const cls   = orderType === 'DELIVERY'
    ? 'text-blue-400 border border-blue-700'
    : 'text-emerald-400 border border-emerald-700';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{label}</span>;
}

// ─── Expanded: InfoRow ────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-zinc-800/60 last:border-0">
      <span className="text-[11px] text-zinc-600 shrink-0">{label}</span>
      <span className="text-[11px] font-semibold text-zinc-200 text-right">{value}</span>
    </div>
  );
}

// ─── Expanded: SectionLabel ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5">
      {children}
    </p>
  );
}

// ─── Expanded: StatusStepper ──────────────────────────────────────────────────

const STEP_INDEX: Partial<Record<OrderStatus, number>> = {
  PENDING:    0,
  ACCEPTED:   1,
  PREPARING:  2,
  ON_THE_WAY: 3,
  PICKED_UP:  3,
  COMPLETED:  4,
};

function ExpandedStepper({ status, orderType }: { status: OrderStatus; orderType: OrderType }) {
  if (status === 'CANCELLED') {
    return (
      <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Pedido cancelado
      </span>
    );
  }
  if (status === 'PENDING_PAYMENT') {
    return (
      <span className="inline-flex items-center rounded-full border border-orange-900/60 bg-orange-950/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-500">
        Esperando pago
      </span>
    );
  }
  if (status === 'PAYMENT_FAILED') {
    return (
      <span className="inline-flex items-center rounded-full border border-red-900/60 bg-red-950/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500">
        Pago fallido
      </span>
    );
  }

  const steps = orderType === 'DELIVERY'
    ? ['Recibido', 'Aceptado', 'Preparando', 'En camino', 'Entregado']
    : ['Recibido', 'Aceptado', 'Preparando', 'Para recoger', 'Entregado'];
  const current = STEP_INDEX[status] ?? 0;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => {
        const isDone    = i < current;
        const isCurrent = i === current;
        return (
          <span key={step} className="flex items-center gap-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isCurrent ? 'bg-red-600 border-red-600 text-white' :
              isDone    ? 'border-green-800/60 text-green-400 bg-green-900/20' :
                          'border-zinc-800 text-zinc-600'
            }`}>
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className={`text-[10px] shrink-0 ${isDone ? 'text-green-700' : 'text-zinc-800'}`}>›</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─── Expanded: AddressActions ─────────────────────────────────────────────────

function AddressActions({ address }: { address: NonNullable<Order['address']> }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = `https://www.google.com/maps?q=${address.latitude},${address.longitude}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mapsUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex gap-2 mt-2.5">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-900/20 border border-blue-800/60 text-blue-400 hover:bg-blue-900/40 transition-colors text-xs font-semibold"
      >
        <MapPin className="w-3.5 h-3.5" />
        Ver en Maps
      </a>
      <button
        onClick={handleCopy}
        className={`flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg border transition-colors text-xs font-semibold ${
          copied
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

// ─── Expanded: ExpandedActions ────────────────────────────────────────────────

interface StatusTransition { status: OrderStatus; label: string; }

function getFullNextStatuses(status: OrderStatus, orderType: OrderType): StatusTransition[] {
  switch (status) {
    case 'PENDING':
      return [
        { status: 'ACCEPTED',  label: 'Aceptar pedido' },
        { status: 'CANCELLED', label: 'Cancelar pedido' },
      ];
    case 'ACCEPTED':
      return [
        { status: 'PREPARING', label: 'Iniciar preparación' },
        { status: 'CANCELLED', label: 'Cancelar pedido' },
      ];
    case 'PREPARING':
      return orderType === 'DELIVERY'
        ? [{ status: 'ON_THE_WAY', label: 'Marcar en camino' },   { status: 'CANCELLED', label: 'Cancelar pedido' }]
        : [{ status: 'PICKED_UP',  label: 'Listo para recoger' }, { status: 'CANCELLED', label: 'Cancelar pedido' }];
    case 'ON_THE_WAY': return [{ status: 'COMPLETED', label: 'Marcar entregado' }];
    case 'PICKED_UP':  return [{ status: 'COMPLETED', label: 'Marcar entregado' }];
    default: return [];
  }
}

function ExpandedActions({ order, onStatusChange }: {
  order: Order;
  onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const transitions = getFullNextStatuses(order.status, order.orderType);

  if (order.status === 'PENDING_PAYMENT') {
    return (
      <div className="w-full py-3 rounded-xl bg-orange-950/40 border border-orange-900/60 text-center text-xs font-semibold text-orange-600 cursor-default">
        Esperando confirmación de pago
      </div>
    );
  }
  if (order.status === 'PAYMENT_FAILED') {
    return (
      <div className="w-full py-3 rounded-xl bg-red-950/40 border border-red-900/60 text-center text-xs font-semibold text-red-600 cursor-default">
        Pago fallido — sin acciones disponibles
      </div>
    );
  }
  if (transitions.length === 0) return null;

  const [primary, ...rest] = transitions;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, primary.status); }}
        className="w-full py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-colors"
      >
        {primary.label}
      </button>
      {rest.map(t => (
        <button
          key={t.status}
          onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, t.status); }}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:bg-white/5 transition-colors"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Print ticket ─────────────────────────────────────────────────────────────

function buildTicketHtml(order: Order): string {
  const clientName  = order.user ? `${order.user.firstName} ${order.user.lastName}` : '—';
  const phone       = order.user?.phone ?? null;
  const adminName   = order.attendedBy ? `${order.attendedBy.firstName} ${order.attendedBy.lastName}` : null;
  const hora       = new Date(order.createdAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
  const fecha      = new Date(order.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
  const total      = Number(order.total);
  const subtotal   = Number(order.subtotal);
  const delivery   = Number(order.deliveryFee);
  const statusLabel: Record<string, string> = {
    PENDING_PAYMENT: 'PAGO PENDIENTE', PENDING: 'PENDIENTE', ACCEPTED: 'ACEPTADO',
    PREPARING: 'PREPARANDO', ON_THE_WAY: 'EN CAMINO', PICKED_UP: 'PARA RECOGER',
    PAYMENT_FAILED: 'PAGO FALLIDO', CANCELLED: 'CANCELADO', COMPLETED: 'ENTREGADO',
  };

  const warningHtml = (order.status === 'PENDING_PAYMENT' || order.status === 'PAYMENT_FAILED')
    ? `<div class="alert">${order.status === 'PENDING_PAYMENT' ? '⚠ PAGO PENDIENTE — NO PREPARAR' : '✗ PAGO FALLIDO — PEDIDO NO VÁLIDO'}</div>`
    : '';

  const itemsHtml = (order.items ?? []).map((item: OrderItem) => {
    const opts = item.selectedOptions?.length
      ? item.selectedOptions.map(o => `<div class="option">→ ${o.optionName}${o.extraPrice > 0 ? ` (+Bs. ${o.extraPrice})` : ''}</div>`).join('')
      : '';
    const itemNote = item.notes ? `<div class="product-note">Nota: ${item.notes}</div>` : '';
    return `<div class="product">
      <div style="display:flex;justify-content:space-between;">
        <span class="product-qty">${item.quantity}×</span>
        <span class="product-name" style="flex:1;margin:0 8px;">${item.productName}</span>
        <span style="font-weight:600;">Bs. ${Number(item.subtotal).toFixed(2)}</span>
      </div>
      ${opts}${itemNote}
    </div>`;
  }).join('');

  const addressHtml = order.orderType === 'DELIVERY' && order.address
    ? `<div class="section">
        <div class="section-title">Dirección de entrega</div>
        <div>${order.address.direction}</div>
        ${order.address.departament ? `<div>Dpto: ${order.address.departament}</div>` : ''}
        ${order.address.reference ? `<div style="color:#555;">Ref: ${order.address.reference}</div>` : ''}
        ${order.address.contact ? `<div style="color:#555;">Contacto: ${order.address.contact}</div>` : ''}
      </div>` : '';

  const notesHtml = order.notes
    ? `<div class="section"><div class="section-title">Nota del cliente</div><div class="notes-box">${order.notes}</div></div>`
    : '';

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
<title>Ficha — ${order.orderNumber}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#fff;color:#000;font-size:13px;padding:16px;max-width:380px;margin:0 auto}
.header{text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:10px}
.logo{font-size:26px;font-weight:900;letter-spacing:3px}
.order-num{font-size:20px;font-weight:700;margin-top:4px}
.meta{font-size:11px;color:#555;margin-top:2px}
.status-badge{display:inline-block;border:1px solid #000;padding:2px 8px;font-size:11px;font-weight:700;margin-top:4px;letter-spacing:1px}
.section{margin:10px 0}
.section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;border-bottom:1px solid #ddd;padding-bottom:3px;margin-bottom:6px}
.product{padding:5px 0;border-bottom:1px dashed #ddd}
.product-name{font-weight:700;font-size:14px}
.option{color:#555;font-size:11px;padding-left:12px;margin-top:2px}
.product-note{font-style:italic;color:#888;font-size:11px;padding-left:12px;margin-top:1px}
.total-line{display:flex;justify-content:space-between;padding:3px 0}
.grand-total{display:flex;justify-content:space-between;padding:6px 0;font-size:16px;font-weight:700;border-top:2px solid #000;margin-top:4px}
.alert{border:2px solid #000;padding:8px;text-align:center;font-weight:700;font-size:12px;margin:10px 0;background:#fff3cd}
.notes-box{border:1px solid #000;padding:8px;font-style:italic;background:#fafaf0}
@media print{body{padding:0}@page{margin:8mm}}
</style></head><body>
<div class="header">
  <div class="logo">OKTAVA</div>
  <div class="order-num">${order.orderNumber}</div>
  <div class="meta">${fecha} · ${hora} · ${order.orderType === 'DELIVERY' ? 'Delivery' : 'Pickup / Local'}</div>
  <div class="status-badge">${statusLabel[order.status] ?? order.status}</div>
</div>
${warningHtml}
<div class="section">
  <div class="section-title">Cliente</div>
  <div style="font-weight:600;">${clientName}</div>
  ${phone ? `<div style="color:#555;">${phone}</div>` : ''}
  ${adminName ? `<div style="color:#555;font-size:11px;margin-top:4px;">Atendido por: ${adminName}</div>` : ''}
</div>
${addressHtml}
<div class="section">
  <div class="section-title">Detalle del pedido (${(order.items ?? []).length} ítems)</div>
  ${itemsHtml}
</div>
${notesHtml}
<div class="section">
  <div class="section-title">Totales</div>
  <div class="total-line"><span>Subtotal</span><span>Bs. ${subtotal.toFixed(2)}</span></div>
  ${delivery > 0 ? `<div class="total-line"><span>Envío</span><span>Bs. ${delivery.toFixed(2)}</span></div>` : ''}
  <div class="grand-total"><span>TOTAL</span><span>Bs. ${total.toFixed(2)}</span></div>
</div>
</body></html>`;
}

function printOrder(e: React.MouseEvent, order: Order) {
  e.stopPropagation();
  const win = window.open('', '_blank', 'width=480,height=700');
  if (!win) return;
  win.document.write(buildTicketHtml(order));
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  order: Order;
  isExpanded: boolean;
  onToggle: (order: Order) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  className?: string;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function OrderCard({ order, isExpanded, onToggle, onStatusChange, className = '' }: Props) {
  const clientName    = order.user ? `${order.user.firstName} ${order.user.lastName}` : '—';
  const total         = Number(order.total);
  const itemCount     = order.items?.length ?? 0;
  const summary       = itemsSummary(order.items);
  const mins          = elapsedMins(order.createdAt);
  const elapsed       = elapsedLabel(order.createdAt);
  const urgent        = isUrgent(order.createdAt, order.status);
  const compactAction = getCompactAction(order.status, order.orderType);

  const hasPendingPayment = order.status === 'PENDING_PAYMENT';
  const hasPaymentIssue   = order.status === 'PENDING_PAYMENT' || order.status === 'PAYMENT_FAILED';

  const hora  = new Date(order.createdAt).toLocaleTimeString('es-BO',  { hour: '2-digit', minute: '2-digit' });
  const fecha = new Date(order.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' });

  return (
    <div
      className={[
        'relative flex flex-col rounded-xl bg-[#161616] border-t-2 border border-zinc-800 cursor-pointer',
        'transition-colors duration-150',
        STATUS_BORDER[order.status],
        isExpanded ? 'border-zinc-600 shadow-lg shadow-black/30' : 'hover:border-zinc-700',
        urgent && !isExpanded ? 'shadow-sm shadow-red-900/20' : '',
        className,
      ].join(' ')}
      onClick={() => onToggle(order)}
    >

      {/* ══════════════════════ COMPACT SECTION ══════════════════════ */}

      <div className="px-4 pt-3.5 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-lg font-black text-red-500 font-mono tracking-tight leading-none">
              {order.orderNumber}
            </span>
            {hasPaymentIssue && (
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm font-bold text-white">
              Bs.&nbsp;{total.toLocaleString('es-BO', { minimumFractionDigits: 0 })}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${isExpanded ? '-rotate-180' : ''}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-1.5 gap-2">
          <span className="text-sm text-zinc-300 truncate">{clientName}</span>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800/80 shrink-0 ${timeClass(mins, order.status)}`}>
            <Clock className="w-3 h-3" />
            {elapsed}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 pb-2.5 flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${STATUS_BADGE[order.status]}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.status]}`} />
          {STATUS_LABEL[order.status]}
        </span>
        <TypeBadge orderType={order.orderType} />
      </div>

      {/* Divisor */}
      <div className="mx-4 border-t border-zinc-800/80" />

      {/* Ítems resumen */}
      <div className="px-4 py-2.5">
        {itemCount > 0 && (
          <p className="text-xs text-zinc-600 mb-1 flex items-center gap-1">
            <Package className="w-3 h-3" />
            {itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}
          </p>
        )}
        {summary && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{summary}</p>
        )}
        {order.orderType === 'DELIVERY' && order.address && (
          <p className="mt-2 text-xs text-zinc-600 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{order.address.direction}</span>
          </p>
        )}
      </div>

      {/* Botón de acción compacto — solo visible cuando NO está expandido */}
      {!isExpanded && (
        compactAction ? (
          <div className="px-4 pb-4 pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, compactAction.next); }}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
            >
              {compactAction.label}
            </button>
          </div>
        ) : hasPendingPayment ? (
          <div className="px-4 pb-4 pt-1">
            <div className="w-full py-2.5 rounded-lg bg-orange-950/40 border border-orange-900/60 text-center text-xs font-semibold text-orange-600 cursor-default">
              Esperando pago
            </div>
          </div>
        ) : null
      )}

      {/* ══════════════════════ EXPANDED SECTION ══════════════════════ */}

      {isExpanded && (
        <div
          onClick={e => e.stopPropagation()}
          className="border-t border-zinc-800 bg-zinc-900/30"
        >
          {/* Fila de estado compacta */}
          <div className="px-4 pt-3 pb-2.5 border-b border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
            <ExpandedStepper status={order.status} orderType={order.orderType} />
            <span className="text-[10px] text-zinc-600 shrink-0">{fecha} · {hora}</span>
          </div>

          {/* 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* COLUMNA IZQUIERDA — productos + notas */}
            <div className="px-4 py-3 md:border-r border-zinc-800 flex flex-col gap-3">
              <OrderList orderDetail={order.items} />

              {order.notes && (
                <div>
                  <SectionLabel>Nota del cliente</SectionLabel>
                  <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs italic text-amber-300/80 leading-relaxed">
                    {order.notes}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA — cliente / dirección / totales / acciones / imprimir */}
            <div className="px-4 py-3 border-t border-zinc-800 md:border-t-0 flex flex-col gap-3">

              {/* Admin que atiende */}
              <div>
                <SectionLabel>Atendido por</SectionLabel>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                  {order.attendedBy ? (
                    <span className="text-xs font-semibold text-teal-400">
                      {order.attendedBy.firstName} {order.attendedBy.lastName}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600">Sin asignar</span>
                  )}
                </div>
              </div>

              {/* Cliente */}
              <div>
                <SectionLabel>Cliente</SectionLabel>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3">
                  <InfoRow label="Nombre"   value={clientName} />
                  <InfoRow label="Teléfono" value={order.user?.phone ?? '—'} />
                </div>
              </div>

              {/* Dirección de entrega (solo DELIVERY) */}
              {order.orderType === 'DELIVERY' && (
                <div>
                  <SectionLabel>Dirección</SectionLabel>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3">
                    <InfoRow label="Calle" value={order.address?.direction ?? '—'} />
                    {order.address?.departament && (
                      <InfoRow label="Dpto."  value={order.address.departament} />
                    )}
                    {order.address?.reference && (
                      <InfoRow label="Ref."   value={order.address.reference} />
                    )}
                    {order.address?.contact && (
                      <InfoRow label="Contacto" value={order.address.contact} />
                    )}
                  </div>
                  {order.address && <AddressActions address={order.address} />}
                </div>
              )}

              {/* Resumen */}
              <div>
                <SectionLabel>Resumen</SectionLabel>
                <OrderSummary
                  subtotal={String(order.subtotal)}
                  deliveryFee={String(order.deliveryFee)}
                  total={String(order.total)}
                />
              </div>

              {/* Acciones operativas */}
              <ExpandedActions order={order} onStatusChange={onStatusChange} />

              {/* Botón imprimir ficha */}
              <button
                onClick={(e) => printOrder(e, order)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/60 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
