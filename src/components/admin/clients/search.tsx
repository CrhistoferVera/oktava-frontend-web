import React from 'react';

type ClientsSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ClientsSearch({ value, onChange }: ClientsSearchProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
      <div className="flex items-center gap-4">
        <span className="text-zinc-400">⌕</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar clientes por nombre, email o teléfono..."
          className="w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
        />
      </div>
    </div>
  );
}
