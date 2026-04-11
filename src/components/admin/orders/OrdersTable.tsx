'use client'
import { ChevronDown, ChevronsUpDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import { Filters } from "./Filters";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { OrderDetail } from "./OrderDetail";
import { Order, OrderStatus } from "@/types";

// ─── Mock data alineado con la interface Order ────────────────────────────────

const mockOrders: Order[] = [
  {
    id: '1', orderNumber: '#0041', userId: 'u1', addressId: 'a1',
    orderType: 'DELIVERY', status: 'COMPLETED',
    subtotal: '800.00', deliveryFee: '50.00', total: '850.00',
    notes: 'Sin cebolla por favor',
    createdAt: '2025-04-11T09:12:00Z', updatedAt: '2025-04-11T09:45:00Z',
    user: { id: 'u1', firstName: 'María', lastName: 'López', email: 'maria.lopez@gmail.com', phone: '68119348' },
    address: {
      id: 'a1', label: 'Casa', direction: 'Av. Blanco Galindo km 5, Villa Cochabamba',
      departament: 'Dpto. 3B', reference: 'Portón verde, frente a la farmacia Chávez',
      contact: 'María López', latitude: '-17.38964000', longitude: '-66.15832000',
    },
    items: [
      { id: 'i1', orderId: '1', variantId: 'v1', productName: 'Pizza Margarita', variantName: 'Familiar', quantity: 1, unitPrice: '450.00', subtotal: '450.00' },
      { id: 'i2', orderId: '1', variantId: 'v2', productName: 'Alitas BBQ',      variantName: '10 unidades', quantity: 1, unitPrice: '200.00', subtotal: '200.00' },
      { id: 'i3', orderId: '1', variantId: 'v3', productName: 'Coca-Cola',       variantName: '2L',          quantity: 1, unitPrice: '150.00', subtotal: '150.00' },
    ],
  },
  {
    id: '2', orderNumber: '#0042', userId: 'u2', addressId: null,
    orderType: 'PICKUP', status: 'PREPARING',
    subtotal: '220.00', deliveryFee: '0.00', total: '220.00',
    notes: null,
    createdAt: '2025-04-11T09:34:00Z', updatedAt: '2025-04-11T09:34:00Z',
    user: { id: 'u2', firstName: 'Carlos', lastName: 'Ruiz', email: 'carlos.ruiz@hotmail.com', phone: '71207953' },
    address: {
      id: 'a2', label: 'Casa', direction: 'Av. Blanco Galindo km 5, Villa Cochabamba',
      departament: 'Dpto. 3B', reference: 'Portón verde, frente a la farmacia Chávez',
      contact: 'María López', latitude: '-17.38964000', longitude: '-66.15832000',
    },
    items: [
      { id: 'i4', orderId: '2', variantId: 'v4', productName: 'Hamburguesa Clásica', variantName: 'Doble', quantity: 2, unitPrice: '85.00', subtotal: '170.00' },
      { id: 'i5', orderId: '2', variantId: 'v5', productName: 'Papas Fritas',        variantName: 'Personal', quantity: 1, unitPrice: '50.00', subtotal: '50.00' },
    ],
  },
  {
    id: '3', orderNumber: '#0043', userId: 'u3', addressId: 'a3',
    orderType: 'DELIVERY', status: 'ON_THE_WAY',
    subtotal: '1290.00', deliveryFee: '50.00', total: '1340.00',
    notes: 'Tocar el timbre, no ladra el perro',
    createdAt: '2025-04-11T09:47:00Z', updatedAt: '2025-04-11T09:47:00Z',
    user: { id: 'u3', firstName: 'Ana', lastName: 'Martínez', email: 'ana.martinez@gmail.com', phone: '76543210' },
    address: {
      id: 'a3', label: 'Trabajo', direction: 'Calle Sucre N° 874, Zona Central',
      departament: 'Piso 2, Of. 201', reference: 'Edificio Torre del Sol, ingreso por Nataniel Aguirre',
      contact: 'Ana Martínez', latitude: '-17.39321000', longitude: '-66.15701000',
    },
    items: [
      { id: 'i6', orderId: '3', variantId: 'v1', productName: 'Pizza Margarita',    variantName: 'Familiar',     quantity: 2, unitPrice: '450.00', subtotal: '900.00' },
      { id: 'i7', orderId: '3', variantId: 'v6', productName: 'Pizza Pepperoni',    variantName: 'Personal',     quantity: 1, unitPrice: '240.00', subtotal: '240.00' },
      { id: 'i8', orderId: '3', variantId: 'v3', productName: 'Coca-Cola',          variantName: '2L',           quantity: 1, unitPrice: '150.00', subtotal: '150.00' },
    ],
  },
  {
    id: '4', orderNumber: '#0044', userId: 'u4', addressId: null,
    orderType: 'PICKUP', status: 'PENDING',
    subtotal: '480.00', deliveryFee: '0.00', total: '480.00',
    notes: null,
    createdAt: '2025-04-11T09:55:00Z', updatedAt: '2025-04-11T09:55:00Z',
    user: { id: 'u4', firstName: 'Pedro', lastName: 'Sánchez', email: 'pedro.s@outlook.com', phone: '60112233' },
    address: null,
    items: [
      { id: 'i9',  orderId: '4', variantId: 'v7', productName: 'Pollo a la Brasa', variantName: '1/2 pollo', quantity: 2, unitPrice: '180.00', subtotal: '360.00' },
      { id: 'i10', orderId: '4', variantId: 'v8', productName: 'Ensalada Fresca',  variantName: 'Grande',    quantity: 2, unitPrice: '60.00',  subtotal: '120.00' },
    ],
  },
];

// ─── Etiquetas y estilos de estado ───────────────────────────────────────────

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
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${orderType === 'DELIVERY' ? ' text-blue-400 border border-blue-700' : ' text-purple-400 border border-purple-700'}`}>
      {orderType === 'DELIVERY' ? 'Delivery' : 'Local'}
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
      <span className="text-gray-500 text-sm">
        {new Date(info.getValue()).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
      </span>
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
    enableSorting: false
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    cell: info => (
      <span className="text-green-400 font-semibold">
        Bs. {Number.parseFloat(info.getValue()).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
      </span>
    ),
  }),
];

// ─── Componente principal ─────────────────────────────────────────────────────

export const OrdersTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        <Filters />
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
                      className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(row.original)}
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
        </div>
        <div className="hidden md:block w-80 shrink-0 sticky top-4 self-start">
          <OrderDetail order={selectedOrder} />
        </div>
        
      </div>
    </>
  );
};
