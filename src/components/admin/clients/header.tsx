import React from 'react';

type ClientsHeaderProps = {
  onAddClientClick?: () => void;
};

export function ClientsHeader({ onAddClientClick }: ClientsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white">Clientes</h1>
        <p className="text-lg text-zinc-400">
          Gestiona la base de clientes del restaurante.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClientClick}
        className="rounded-2xl bg-red-600 px-10 py-4 text-lg font-semibold text-white transition hover:bg-red-700"
      >
        + Agregar Cliente
      </button>
    </div>
  );
}
