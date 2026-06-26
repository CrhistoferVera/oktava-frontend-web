'use client';

import { useState } from 'react';
import { Power } from 'lucide-react';

type Props = {
  initialMessage: string;
  isSaving: boolean;
  onConfirm: (message: string) => void;
  onClose: () => void;
};

export function CloseStoreModal({ initialMessage, isSaving, onConfirm, onClose }: Props) {
  const [message, setMessage] = useState(initialMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-7">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <Power size={20} className="text-red-400" />
          </span>
          <h2 className="text-xl font-bold text-white">¿Cerrar la tienda?</h2>
        </div>

        <p className="mt-3 text-sm text-zinc-400">
          Los clientes no podrán hacer pedidos hasta que la reabras, sin importar el horario configurado.
        </p>

        {/* Mensaje opcional */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Mensaje para el cliente (opcional)
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ej. Volvemos mañana a las 10:00"
            maxLength={200}
            autoFocus
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-500"
          />
          <p className="text-[11px] text-zinc-500">
            Se mostrará a los clientes mientras la tienda esté cerrada.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(message.trim())}
            disabled={isSaving}
            className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isSaving ? 'Cerrando...' : 'Cerrar tienda'}
          </button>
        </div>
      </div>
    </div>
  );
}
