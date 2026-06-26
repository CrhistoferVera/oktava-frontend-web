'use client';

import { useState } from 'react';
import type { BusinessHour } from '@/types/store.types';

// Orden Lunes→Domingo (dayOfWeek sigue convención JS: 0=Domingo).
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

const inputCls =
  'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-500 disabled:opacity-40';

type Props = {
  initialDays: Record<number, BusinessHour>;
  isSaving: boolean;
  onClose: () => void;
  onSave: (days: BusinessHour[]) => void;
};

export function HoursEditModal({ initialDays, isSaving, onClose, onSave }: Props) {
  // Borrador local: editar en el modal no afecta la página hasta guardar.
  const [draft, setDraft] = useState<Record<number, BusinessHour>>(() => {
    const clone: Record<number, BusinessHour> = {};
    for (const k of Object.keys(initialDays)) clone[+k] = { ...initialDays[+k] };
    return clone;
  });

  function updateDay(dayOfWeek: number, patch: Partial<BusinessHour>) {
    setDraft((prev) => ({ ...prev, [dayOfWeek]: { ...prev[dayOfWeek], ...patch } }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Editar horarios</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Define la hora de apertura y cierre de cada día, o márcalo como cerrado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
          >
            Cerrar
          </button>
        </div>

        {/* Días */}
        <div className="mt-6 flex flex-col gap-3">
          {DAY_ORDER.map((d) => {
            const day = draft[d];
            return (
              <div
                key={d}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="w-24 font-medium text-white">{DAY_LABELS[d]}</span>

                <div className="flex flex-1 items-center gap-2.5">
                  <input
                    type="time"
                    value={day.openTime}
                    disabled={day.isClosed}
                    onChange={(e) => updateDay(d, { openTime: e.target.value })}
                    className={inputCls}
                  />
                  <span className="text-zinc-500">a</span>
                  <input
                    type="time"
                    value={day.closeTime}
                    disabled={day.isClosed}
                    onChange={(e) => updateDay(d, { closeTime: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={day.isClosed}
                    onChange={(e) => updateDay(d, { isClosed: e.target.checked })}
                    className="h-4 w-4 accent-red-600"
                  />
                  Cerrado
                </label>
              </div>
            );
          })}
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
            onClick={() => onSave(DAY_ORDER.map((d) => draft[d]))}
            disabled={isSaving}
            className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar horarios'}
          </button>
        </div>
      </div>
    </div>
  );
}
