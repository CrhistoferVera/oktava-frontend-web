'use client'
import { Search } from "lucide-react";
import { useState } from "react";
import { Filters } from "./Filters";

interface OrdersTableProps {
    id: string;
    client: string;
    time: string;
    status: string;
    total: number;
}



export const OrdersTable = () => {
    const [globalFilter, setGlobalFilter] = useState('');
  return (
    <div className="flex flex-col md:flex-row items-center justify-left mb-4 gap-5">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
          <input
            value={globalFilter}  
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar por #pedido, cliente..."
            className="bg-[#0D0D0D] text-gray-300 text-sm pl-8 pr-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-gray-500 w-64"
          />
        </div>
        <Filters/>
    </div>
  )
}
