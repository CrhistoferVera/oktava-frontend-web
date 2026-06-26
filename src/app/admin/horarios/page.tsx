'use client';

import { useEffect, useState } from 'react';
import { Clock3, Power } from 'lucide-react';
import { storeService } from '@/services/store.service';
import type { BusinessHour, StoreStatus } from '@/types/store.types';

// Orden de visualización Lunes→Domingo (dayOfWeek sigue convención JS: 0=Domingo).
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

function defaultDay(dayOfWeek: number): BusinessHour {
  return { dayOfWeek, isClosed: false, openTime: '09:00', closeTime: '22:00' };
}

const inputCls =
  'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-500 disabled:opacity-40';

export default function HorariosPage() {
  const [days, setDays] = useState<Record<number, BusinessHour>>({});
  const [ordersPaused, setOrdersPaused] = useState(false);
  const [pauseMessage, setPauseMessage] = useState('');
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);
      const [hours, settings, st] = await Promise.all([
        storeService.getHours(),
        storeService.getSettings(),
        storeService.getStatus(),
      ]);
      const map: Record<number, BusinessHour> = {};
      for (let d = 0; d < 7; d++) {
        map[d] = hours.find((h) => h.dayOfWeek === d) ?? defaultDay(d);
      }
      setDays(map);
      setOrdersPaused(settings.ordersPaused);
      setPauseMessage(settings.pauseMessage ?? '');
      setStatus(st);
    } catch {
      setError('No se pudieron cargar los horarios.');
    } finally {
      setIsLoading(false);
    }
  }

  function updateDay(dayOfWeek: number, patch: Partial<BusinessHour>) {
    setDays((prev) => ({ ...prev, [dayOfWeek]: { ...prev[dayOfWeek], ...patch } }));
    setSuccess(null);
  }

  // Cerrar / reabrir tienda al instante (pausa manual). No requiere "Guardar".
  async function togglePause(close: boolean) {
    try {
      setIsToggling(true);
      setError(null);
      setSuccess(null);
      await storeService.updateSettings({
        ordersPaused: close,
        pauseMessage: close ? pauseMessage.trim() || undefined : undefined,
      });
      setOrdersPaused(close);
      const st = await storeService.getStatus();
      setStatus(st);
    } catch {
      setError('No se pudo cambiar el estado de la tienda.');
    } finally {
      setIsToggling(false);
    }
  }

  async function handleSaveHours() {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      // Solo los campos del DTO (el backend rechaza extras como `id`).
      await storeService.updateHours({
        days: DAY_ORDER.map((d) => {
          const { dayOfWeek, isClosed, openTime, closeTime } = days[d];
          return { dayOfWeek, isClosed, openTime, closeTime };
        }),
      });
      const st = await storeService.getStatus();
      setStatus(st);
      setSuccess('Horarios guardados correctamente.');
    } catch {
      setError('No se pudieron guardar los horarios.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-zinc-500">Cargando horarios...</p>
      </div>
    );
  }

  const isOpen = status ? status.isOpen : true;
  const today = status?.today;
  let todayHours = '—';
  if (today) {
    todayHours = today.isClosed ? 'Cerrado' : `${today.openTime} – ${today.closeTime}`;
  }
  const todayLabel = today ? DAY_LABELS[today.dayOfWeek] : '';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Horarios</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Estado de la tienda y horario de atención. Fuera de horario los clientes no pueden hacer pedidos.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-800 bg-red-950/40 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 px-4 py-3">
          <p className="text-sm text-emerald-400">{success}</p>
        </div>
      )}

      {/* ── Estado actual de la tienda ── */}
      <div
        className={`rounded-2xl border p-5 ${
          isOpen ? 'border-emerald-700/60 bg-emerald-950/30' : 'border-red-800/60 bg-red-950/30'
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Info */}
          <div className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ${
                isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-bold ${isOpen ? 'text-emerald-300' : 'text-red-300'}`}>
                  {isOpen ? 'Tienda abierta' : 'Tienda cerrada'}
                </h2>
                {status?.paused && (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-300">
                    Cerrada manualmente
                  </span>
                )}
              </div>
              {status?.message && <p className="mt-0.5 text-sm text-zinc-400">{status.message}</p>}
              <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock3 size={13} />
                Hoy ({todayLabel}): <span className="font-medium text-zinc-300">{todayHours}</span>
              </p>
            </div>
          </div>

          {/* Acción de cierre/apertura inmediato */}
          <div className="flex flex-col items-stretch gap-2 lg:w-72">
            {!ordersPaused && (
              <input
                type="text"
                value={pauseMessage}
                onChange={(e) => setPauseMessage(e.target.value)}
                placeholder="Mensaje opcional (ej. Volvemos mañana)"
                maxLength={200}
                className={inputCls}
              />
            )}
            <button
              type="button"
              onClick={() => togglePause(!ordersPaused)}
              disabled={isToggling}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:opacity-50 ${
                ordersPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              <Power size={16} />
              {(() => {
                if (isToggling) return 'Aplicando...';
                return ordersPaused ? 'Reabrir tienda' : 'Cerrar tienda ahora';
              })()}
            </button>
            <p className="text-center text-[11px] text-zinc-500">
              {ordersPaused
                ? 'La tienda está cerrada manualmente. Reábrela para volver al horario normal.'
                : 'Cierra al instante sin importar el horario (día ocupado, feriado, etc.).'}
            </p>
          </div>
        </div>
      </div>

      {/* Horario por día */}
      <div className="flex flex-col gap-3">
        {DAY_ORDER.map((d) => {
          const day = days[d];
          return (
            <div
              key={d}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="w-28 font-medium text-white">{DAY_LABELS[d]}</span>

              <div className="flex flex-1 items-center gap-3">
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

      {/* Guardar horarios */}
      <div>
        <button
          type="button"
          onClick={handleSaveHours}
          disabled={isSaving}
          className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
