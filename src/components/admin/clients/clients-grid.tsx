import React from 'react';
import { Client } from '@/types/client.types';
import { ClientCard } from '@/components/admin/clients/client-card';

type ClientsGridProps = {
  clients: Client[];
};

export function ClientsGrid({ clients }: ClientsGridProps) {
  if (clients.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900 px-6 py-12 text-center">
        <h3 className="text-lg font-semibold text-zinc-400">
          No se encontraron clientes
        </h3>
        <p className="mt-3 max-w-xl text-base text-zinc-500">
          Prueba con otro nombre, email o teléfono en el buscador.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
