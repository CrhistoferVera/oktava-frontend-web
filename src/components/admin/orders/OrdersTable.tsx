'use client'
import { ChevronDown, ChevronsUpDown, ChevronUp, Divide, Heading1, Search } from "lucide-react";
import { useState } from "react";
import { Filters } from "./Filters";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { OrderDetail } from "./OrderDetail";

interface OrderProps {
    id: string;
    orderNumber: string;
    client: string;
    time: string;
    status: string;
    total: number;
}


const mockOrders: OrderProps[] = [
    { id: '1', orderNumber: '#0041', client: 'María López', time: '09:12', status: 'Entregado', total: 850 },
    { id: '2', orderNumber: '#0042', client: 'Carlos Ruiz', time: '09:34', status: 'Preparando', total: 220 },
    { id: '3', orderNumber: '#0043', client: 'Ana Martínez', time: '09:47', status: 'En camino', total: 1340 },
    { id: '4', orderNumber: '#0044', client: 'Pedro Sánchez', time: '09:55', status: 'Pendiente', total: 480 },
];
// ─── Badge de estado ──────────────────────────────────────────────────────────

const estadoStyles: Record<OrderProps['status'], string> = {
  Pendiente:      'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  Preparando : 'bg-blue-900/40 text-blue-400 border border-blue-700',
  'En camino':          'bg-red-900/40 text-red-400 border border-red-700',
  Entregado:      'bg-green-900 text-green-400 border border-green-600',
  Cancelado:     'bg-gray-800 text-gray-400 border border-gray-600',
};

function EstadoBadge({ estado }: { estado: OrderProps['status'] }) {
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

const columnHelper = createColumnHelper<OrderProps>();

const columns = [
  columnHelper.accessor('orderNumber', {
    header: '#',
    cell: info => <span className="font-mono text-red-400 font-bold">{info.getValue()}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('client', {
    header: 'Cliente',
    cell: info => <span className="text-gray-200">{info.getValue()}</span>,
  }),
  columnHelper.accessor('time', {
    header: 'Hora',
    cell: info => <span className="text-gray-500 text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: info => <EstadoBadge estado={info.getValue()} />,
    enableSorting: false,
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    cell: info => (
      <span className="text-green-400 font-semibold">${info.getValue().toLocaleString()}</span>
    ),
  }),
  
];


export const OrdersTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
  const table = useReactTable({
    data: mockOrders,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
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
        <Filters/> 
    </div>
    <div className="flex gap-5">
      <div className="bg-[#161616] border border-gray-800 rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-gray-800" >
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
            {
              table.getRowModel().rows.length===0 ?(
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-gray-600">
                  Sin resultados
                </td>
              </tr>
              ):(
                table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id}
                    className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors"
                    onClick={() => setSelectedOrder(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-5 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td> 
                  ))}
                  </tr>
                ))
              )
            }
          </tbody>
        </table>
        </div>
      </div>
      <OrderDetail order={selectedOrder} />
    </div>
     
  </>
  )
}
