'use client'
import { ChevronDown, ChevronsUpDown, ChevronUp, Search, X } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { Filters, FILTER_STATUS_MAP } from "./Filters";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { OrderDetail } from "./OrderDetail";
import type { Order, OrderStatus, OrderType } from "@/types/order.types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  readonly orders: Order[];
  readonly loading: boolean;
  readonly onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  readonly autoSelectedOrderId?: string | null;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

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
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

export function TipoBadge({ orderType }: { readonly orderType: 'DELIVERY' | 'PICKUP' }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${orderType === 'DELIVERY' ? 'text-blue-400 border border-blue-700' : 'text-purple-400 border border-purple-700'}`}>
      {orderType === 'DELIVERY' ? 'Delivery' : 'Local'}
    </span>
  );
}

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc')  return <ChevronUp   className="inline w-3 h-3 ml-1" />;
  if (sorted === 'desc') return <ChevronDown  className="inline w-3 h-3 ml-1" />;
  return <ChevronsUpDown className="inline w-3 h-3 ml-1 text-gray-600" />;
}

// ─── Hora + Espera cell ───────────────────────────────────────────────────────

function HoraCell({ createdAt, status }: { readonly createdAt: string; readonly status: OrderStatus }) {
  const time = new Date(createdAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
  const showWait = status === 'PENDING' || status === 'PREPARING';
  if (!showWait) return <span className="text-gray-500 text-sm">{time}</span>;

  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
  const waitLabel = mins < 1 ? '< 1 min' : `${mins} min`;
  const isUrgent = mins >= 10;

  return (
    <div>
      <span className="text-gray-500 text-sm">{time}</span>
      <p className={`text-xs mt-0.5 font-semibold ${isUrgent ? 'text-red-400 animate-pulse' : 'text-zinc-500'}`}>
        {waitLabel}
      </p>
    </div>
  );
}

// ─── Acción rápida ────────────────────────────────────────────────────────────

function getQuickNext(status: OrderStatus, orderType: OrderType): OrderStatus | null {
  if (status === 'PENDING') return 'PREPARING';
  if (status === 'PREPARING') return orderType === 'DELIVERY' ? 'ON_THE_WAY' : 'PICKED_UP';
  return null;
}

const QUICK_LABEL: Partial<Record<OrderStatus, string>> = {
  PREPARING:  'Aceptar',
  ON_THE_WAY: 'En camino',
  PICKED_UP:  'Listo',
};

function QuickActionCell({ order, onStatusChange }: {
  readonly order: Order;
  readonly onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const next = getQuickNext(order.status, order.orderType);
  if (!next) return null;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, next); }}
      className="rounded-lg bg-red-600/20 border border-red-600/40 px-2.5 py-1 text-xs font-bold text-red-400 hover:bg-red-600/40 transition-colors whitespace-nowrap"
    >
      {QUICK_LABEL[next]}
    </button>
  );
}

// ─── Date helper ─────────────────────────────────────────────────────────────

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth()    === now.getMonth()    &&
    d.getDate()     === now.getDate()
  );
}

// ─── Row styling ──────────────────────────────────────────────────────────────

function rowClass(isSelected: boolean, status: OrderStatus, createdAt: string): string {
  if (isSelected) return 'bg-red-950/30 border-l-2 border-l-red-600 border-b-gray-800/50';
  if (status === 'PENDING') {
    const mins = (Date.now() - new Date(createdAt).getTime()) / 60_000;
    if (mins >= 10) return 'border-l-2 border-l-red-500 border-b-gray-800/50 bg-red-950/10';
    return 'border-l-2 border-l-yellow-600/60 border-b-gray-800/50 hover:bg-white/2';
  }
  return 'border-b-gray-800/50 hover:bg-white/2';
}

// ─── Column helper ────────────────────────────────────────────────────────────

const columnHelper = createColumnHelper<Order>();

// ─── Componente principal ─────────────────────────────────────────────────────

export const OrdersTable = ({ orders, loading, onStatusChange, autoSelectedOrderId }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('Activos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const autoSelectConsumedRef = useRef<string | null>(null);

  // Keep selected order in sync when orders refresh
  const syncedSelected = useMemo(() => {
    if (!selectedOrder) return null;
    return orders.find(o => o.id === selectedOrder.id) ?? null;
  }, [orders, selectedOrder]);

  // Auto-select incoming order if not already consumed and nothing active is selected
  useEffect(() => {
    if (!autoSelectedOrderId || autoSelectedOrderId === autoSelectConsumedRef.current) return;
    autoSelectConsumedRef.current = autoSelectedOrderId;
    const order = orders.find(o => o.id === autoSelectedOrderId);
    if (!order) return;
    setSelectedOrder(prev => {
      if (!prev || prev.status === 'COMPLETED' || prev.status === 'CANCELLED') return order;
      return prev;
    });
  }, [autoSelectedOrderId, orders]);

  // Base: only today's orders (active + inactive)
  const baseOrders = useMemo(
    () => orders.filter(o => isToday(o.createdAt)),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'Activos') {
      return baseOrders.filter(o => o.status !== 'CANCELLED' && o.status !== 'COMPLETED');
    }
    const statusFilter = FILTER_STATUS_MAP[activeFilter];
    return statusFilter === null ? baseOrders : baseOrders.filter(o => o.status === statusFilter);
  }, [baseOrders, activeFilter]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: baseOrders.length };
    counts['Activos'] = baseOrders.filter(
      o => o.status !== 'CANCELLED' && o.status !== 'COMPLETED',
    ).length;
    Object.entries(FILTER_STATUS_MAP).forEach(([label, status]) => {
      if (status !== null) counts[label] = baseOrders.filter(o => o.status === status).length;
    });
    return counts;
  }, [baseOrders]);

  const columns = useMemo(() => [
    columnHelper.accessor('orderNumber', {
      header: '#',
      cell: info => <span className="font-mono text-red-400 font-bold">{info.getValue()}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.user ? `${row.user.firstName} ${row.user.lastName}` : row.userId, {
      id: 'client',
      header: 'Cliente',
      cell: info => <span className="text-gray-200">{info.getValue()}</span>,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Hora',
      cell: info => (
        <HoraCell createdAt={info.getValue()} status={info.row.original.status} />
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: info => <EstadoBadge status={info.getValue()} />,
      enableSorting: false,
    }),
    columnHelper.accessor('orderType', {
      header: 'Tipo',
      cell: info => <TipoBadge orderType={info.getValue()} />,
      enableSorting: false,
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: info => (
        <span className="text-green-400 font-semibold">
          Bs. {Number(info.getValue()).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'action',
      header: '',
      cell: info => (
        <QuickActionCell order={info.row.original} onStatusChange={onStatusChange} />
      ),
    }),
  ], [onStatusChange]);

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-left mb-4 gap-5">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
          <input
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar por #pedido, cliente..."
            className="bg-[#282828] text-gray-300 text-sm pl-8 pr-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-gray-500 w-64"
          />
        </div>
        <Filters value={activeFilter} onChange={setActiveFilter} counts={filterCounts} />
      </div>

      <div className="flex gap-5 items-start">
        <div className="bg-[#161616] border border-gray-800 rounded-lg overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-gray-800">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-300' : ''}`}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon sorted={header.column.getIsSorted()} />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      {columns.map((_, j) => (
                        <td key={j} className="px-5 py-3">
                          <div className="h-4 rounded bg-white/5 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-5 py-8 text-center text-gray-600">
                      Sin resultados
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => {
                    const isSelected = row.original.id === syncedSelected?.id;
                    return (
                      <tr
                        key={row.id}
                        className={`border-b transition-colors cursor-pointer ${rowClass(isSelected, row.original.status, row.original.createdAt)}`}
                        onClick={() => setSelectedOrder(row.original)}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-5 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel desktop */}
        <div className="hidden md:block w-110 shrink-0 sticky top-4 self-start">
          <OrderDetail order={syncedSelected} onStatusChange={onStatusChange} />
        </div>
      </div>

      {/* Modal bottom sheet móvil */}
      {syncedSelected && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-[#161616] rounded-t-2xl max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 shrink-0">
              <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto" />
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute right-4 top-3 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <OrderDetail order={syncedSelected} onStatusChange={onStatusChange} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
