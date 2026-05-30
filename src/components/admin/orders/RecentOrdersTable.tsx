'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import type { Order, OrderStatus } from '@/types/order.types';

// ─── Etiquetas y estilos de estado ───────────────────────────────────────────

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pago pendiente',
  PENDING:         'Pendiente',
  ACCEPTED:        'Aceptado',
  PREPARING:       'Preparando',
  ON_THE_WAY:      'En camino',
  PICKED_UP:       'Recogido',
  PAYMENT_FAILED:  'Pago fallido',
  CANCELLED:       'Cancelado',
  COMPLETED:       'Entregado',
};

const STATUS_STYLE: Record<OrderStatus, string> = {
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

function EstadoBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─── Icono de ordenamiento ────────────────────────────────────────────────────

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc')  return <ChevronUp   className="inline w-3 h-3 ml-1" />;
  if (sorted === 'desc') return <ChevronDown  className="inline w-3 h-3 ml-1" />;
  return <ChevronsUpDown className="inline w-3 h-3 ml-1 text-gray-600" />;
}

// ─── Columnas ─────────────────────────────────────────────────────────────────

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor('orderNumber', {
    header: 'Pedido',
    cell: (info) => (
      <span className="font-mono text-red-400">#{info.getValue()}</span>
    ),
  }),
  columnHelper.display({
    id: 'cliente',
    header: 'Cliente',
    cell: ({ row }) => {
      const u = row.original.user;
      const name = u ? `${u.firstName} ${u.lastName}` : '—';
      return <span className="text-gray-200">{name}</span>;
    },
  }),
  columnHelper.accessor('orderType', {
    header: 'Tipo',
    cell: (info) => (
      <span className="text-gray-400">
        {info.getValue() === 'DELIVERY' ? 'Delivery' : 'Pickup'}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'items',
    header: 'Items',
    cell: ({ row }) => (
      <span className="text-gray-400">{row.original.items?.length ?? 0}</span>
    ),
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    cell: (info) => (
      <span className="text-green-400 font-semibold">
        Bs. {Number(info.getValue()).toFixed(0)}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: (info) => <EstadoBadge status={info.getValue()} />,
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Hora',
    cell: (info) => (
      <span className="text-gray-500 text-sm">
        {new Date(info.getValue()).toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    ),
  }),
];

// ─── Componente principal ─────────────────────────────────────────────────────

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-[#161616] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <h2 className="text-gray-200 font-semibold">Pedidos recientes</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
            className="bg-[#0D0D0D] text-gray-300 text-sm pl-8 pr-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-gray-500 w-48"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-800">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={[
                      'px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider',
                      header.column.getCanSort()
                        ? 'cursor-pointer select-none hover:text-gray-300'
                        : '',
                    ].join(' ')}
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-8 text-center text-gray-600"
                >
                  {orders.length === 0
                    ? 'No hay pedidos registrados aún.'
                    : 'Sin resultados para la búsqueda.'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800/50 hover:bg-white/2 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-600">
        {table.getFilteredRowModel().rows.length} pedido(s)
      </div>
    </div>
  );
}
