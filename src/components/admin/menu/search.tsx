import React from 'react';

type MenuSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MenuSearch({ value, onChange }: MenuSearchProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg bg-zinc-900 px-5 py-4 mb-5">
      <div className="flex items-center gap-4">
        <span className="text-zinc-400">⌕</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar producto..."
          className="w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
        />
      </div>
    </div>
  );
}
