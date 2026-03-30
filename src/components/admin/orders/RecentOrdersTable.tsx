'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';

// ─── Tipo de dato ────────────────────────────────────────────────────────────

interface Order {
  id: string;
  cliente: string;
  items: number;
  total: number;
  estado: 'Pendiente' | 'En preparación' | 'Listo' | 'Entregado';
  hora: string;
}

// ─── Datos de ejemplo (reemplazar con fetch real) ─────────────────────────────

const mockOrders: Order[] = [
  { id: '#0041', cliente: 'María López',    items: 3, total: 850,  estado: 'Entregado',     hora: '09:12' },
  { id: '#0042', cliente: 'Carlos Ruiz',    items: 1, total: 220,  estado: 'En preparación', hora: '09:34' },
  { id: '#0043', cliente: 'Ana Martínez',   items: 5, total: 1340, estado: 'Listo',          hora: '09:47' },
  { id: '#0044', cliente: 'Pedro Sánchez',  items: 2, total: 480,  estado: 'Pendiente',      hora: '09:55' },
  { id: '#0045', cliente: 'Laura García',   items: 4, total: 960,  estado: 'En preparación', hora: '10:03' },
  { id: '#0046', cliente: 'Diego Torres',   items: 1, total: 190,  estado: 'Entregado',      hora: '10:10' },
  { id: '#0047', cliente: 'Sofía Herrera',  items: 6, total: 1780, estado: 'Pendiente',      hora: '10:22' },
];

// ─── Badge de estado ──────────────────────────────────────────────────────────

const estadoStyles: Record<Order['estado'], string> = {
  Pendiente:      'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  'En preparación': 'bg-blue-900/40 text-blue-400 border border-blue-700',
  Listo:          'bg-green-900/40 text-green-400 border border-green-700',
  Entregado:      'bg-gray-800 text-gray-400 border border-gray-600',
};

function EstadoBadge({ estado }: { estado: Order['estado'] }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${estadoStyles[estado]}`}>
      {estado}
    </span>
  );
}

// ─── Icono de ordenamiento ────────────────────────────────────────────────────

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc')  return <ChevronUp   className="inline w-3 h-3 ml-1" />;
  if (sorted === 'desc') return <ChevronDown  className="inline w-3 h-3 ml-1" />;
  return <ChevronsUpDown className="inline w-3 h-3 ml-1 text-gray-600" />;
}

// ─── Definición de columnas ───────────────────────────────────────────────────

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Pedido',
    cell: info => <span className="font-mono text-red-400">{info.getValue()}</span>,
  }),
  columnHelper.accessor('cliente', {
    header: 'Cliente',
    cell: info => <span className="text-gray-200">{info.getValue()}</span>,
  }),
  columnHelper.accessor('items', {
    header: 'Items',
    cell: info => <span className="text-gray-400">{info.getValue()}</span>,
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    cell: info => (
      <span className="text-green-400 font-semibold">${info.getValue().toLocaleString()}</span>
    ),
  }),
  columnHelper.accessor('estado', {
    header: 'Estado',
    cell: info => <EstadoBadge estado={info.getValue()} />,
    enableSorting: false,
  }),
  columnHelper.accessor('hora', {
    header: 'Hora',
    cell: info => <span className="text-gray-500 text-sm">{info.getValue()}</span>,
  }),
];

// ─── Componente principal ─────────────────────────────────────────────────────

export function RecentOrdersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data: mockOrders,
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
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
            className="bg-[#0D0D0D] text-gray-300 text-sm pl-8 pr-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-gray-500 w-48"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-gray-800">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`
                      px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
                      ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-300' : ''}
                    `}
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
                <td colSpan={columns.length} className="px-5 py-8 text-center text-gray-600">
                  Sin resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
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
