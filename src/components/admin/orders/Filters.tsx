import { CheckCircle, Hourglass, ScanSearch, Truck, XCircle } from 'lucide-react'
import React, { useState } from 'react'

const filters = [
    {
        name: "Todos"
    },
    {
        name: "Pendientes",
        icon: <Hourglass size={16} color="orange"/>
    },
    {
        name: "Preparando",
        icon: <ScanSearch size={16} color="blue"/>
    },
    {
        name: "En camino",
        icon: <Truck size={16} color="red"/>,
    },
    {
        name: 'Entregados',
        icon: <CheckCircle size={16} color="green"/>,
    },
    {
        name: 'Cancelados',
    icon: <XCircle size={16} color="gray"/>,
    }
]

export const Filters = () => {

    const [activeFilter, setActiveFilter] = useState('Todos');

    return (
        <div className="flex gap-2 mt-2 md:mt-0 text-[11px] text-gray-500">
            {filters.map((filter) => (
                <button key={filter.name} onClick={() => setActiveFilter(filter.name)} className={`flex items-center gap-2 px-3 py-2  rounded-full border focus:outline-none hover:bg-gray-800 ${activeFilter === filter.name ? 'bg-gray-700 border-gray-400 text-gray-200' : 'bg-[#0D0D0D] border-gray-700 text-gray-300'}`}>
                    {filter.icon}
                    <span className='hidden md:block'>{filter.name}</span>
                </button>

            ))}
            <h1 className='text-white'>{activeFilter}</h1>
        </div>
    )
}
