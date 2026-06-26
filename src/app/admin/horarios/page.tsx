'use client';

import { useEffect, useState } from 'react';
import { Clock3, Power, Pencil } from 'lucide-react';
import { storeService } from '@/services/store.service';
import { HoursEditModal } from '@/components/admin/horarios/hours-edit-modal';
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
  const [editing, setEditing] = useState(false);
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

  async function handleSaveHours(updated: BusinessHour[]) {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      // Solo los campos del DTO (el backend rechaza extras como `id`).
      await storeService.updateHours({
        days: updated.map(({ dayOfWeek, isClosed, openTime, closeTime }) => ({
          dayOfWeek,
          isClosed,
          openTime,
          closeTime,
        })),
      });
      setDays((prev) => {
        const map = { ...prev };
        updated.forEach((d) => (map[d.dayOfWeek] = d));
        return map;
      });
      const st = await storeService.getStatus();
      setStatus(st);
      setEditing(false);
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

      {/* ── Horario semanal (solo lectura) ── */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
          <h2 className="text-base font-semibold text-white">Horario de atención</h2>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Pencil size={14} />
            Editar Horarios
          </button>
        </div>

        <ul>
          {DAY_ORDER.map((d) => {
            const day = days[d];
            const isToday = today?.dayOfWeek === d;
            return (
              <li
                key={d}
                className={`flex items-center justify-between border-t border-zinc-800/70 px-5 py-3.5 first:border-t-0 ${
                  isToday ? 'bg-red-500/6' : ''
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
                    day.isClosed ? 'font-semibold text-red-400' : 'text-zinc-400'
                  }`}
                >
                  {day.isClosed ? 'Cerrado' : `${day.openTime} – ${day.closeTime}`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal de edición */}
      {editing && (
        <HoursEditModal
          initialDays={days}
          isSaving={isSaving}
          onClose={() => setEditing(false)}
          onSave={handleSaveHours}
        />
      )}
    </div>
  );
}
