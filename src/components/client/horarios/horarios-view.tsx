'use client';

import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { storeService } from '@/services/store.service';
import type { BusinessHour, StoreStatus } from '@/types/store.types';

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

export function HorariosView() {
  const [hours, setHours] = useState<BusinessHour[] | null>(null);
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Día actual en hora de Bolivia (UTC-4).
  const todayDow = new Date(Date.now() - 4 * 3600 * 1000).getUTCDay();

  useEffect(() => {
    Promise.all([storeService.getHours(), storeService.getStatus()])
      .then(([h, s]) => {
        setHours(h);
        setStatus(s);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const isOpen = status ? status.isOpen : true;

  return (
    <div className="space-y-5">
      {/* Estado actual */}
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${
          isOpen
            ? 'border-emerald-500/40 bg-emerald-500/10'
            : 'border-red-500/40 bg-red-500/10'
        }`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
          }`}
        />
        <div>
          <p className={`text-sm font-bold ${isOpen ? 'text-emerald-300' : 'text-red-300'}`}>
            {isOpen ? 'Abierto ahora' : 'Cerrado'}
          </p>
          {!isOpen && status?.message && (
            <p className="text-xs text-red-300/80">{status.message}</p>
          )}
        </div>
      </div>

      {/* Lista semanal */}
      <div className="oktava-surface overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <Clock3 size={16} className="text-red-400" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
            Horario de atención
          </h2>
        </div>

        {loading ? (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">Cargando horarios...</p>
        ) : error || !hours ? (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">
            No se pudieron cargar los horarios.
          </p>
        ) : (
          <ul>
            {DAY_ORDER.map((d) => {
              const day = hours.find((h) => h.dayOfWeek === d);
              const isToday = d === todayDow;
              return (
                <li
                  key={d}
                  className={`flex items-center justify-between px-5 py-3.5 border-t border-white/5 first:border-t-0 ${
                    isToday ? 'bg-red-500/[0.06]' : ''
                  }`}
                >
                  <span
                    className={`flex items-center gap-2 text-sm ${
                      isToday ? 'font-bold text-white' : 'font-medium text-zinc-300'
                    }`}
                  >
                    {isToday && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                    {DAY_LABELS[d]}
                    {isToday && <span className="text-xs font-semibold text-red-400">· Hoy</span>}
                  </span>
                  <span
                    className={`text-sm ${
                      day?.isClosed
                        ? 'font-semibold text-red-400'
                        : isToday
                          ? 'text-white'
                          : 'text-zinc-400'
                    }`}
                  >
                    {day?.isClosed ? 'Cerrado' : `${day?.openTime} – ${day?.closeTime}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
