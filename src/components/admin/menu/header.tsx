import React from 'react';

type MenuHeaderProps = {
  onCreateProductClick?: () => void;
};

export function MenuHeader({ onCreateProductClick }: MenuHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white">Menú</h1>
        <p className="text-lg text-zinc-400">
          Gestiona tus productos del restaurante desde aquí.
        </p>
      </div>

      <button
      type='button'
      onClick={onCreateProductClick}
      className='rounded-2xl bg-red-600 px-6 py-2 text-lg font-semibold text-white transition hover:bg-red-700'
      >
        + Nuevo Producto
      </button>

    </div>
  );
}
