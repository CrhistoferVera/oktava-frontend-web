'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

/**
 * Escucha el evento global 'auth:session-expired' que dispara AuthContext
 * cuando una llamada API devuelve 401.
 *
 * Muestra un modal "Tu sesión expiró" y al confirmar navega a /sign-in.
 * Al no haber sesión activa, el proxy.ts no bloqueará la navegación a /sign-in.
 */
export function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setOpen(true);
    globalThis.addEventListener('auth:session-expired', handler);
    return () => globalThis.removeEventListener('auth:session-expired', handler);
  }, []);

  function handleConfirm() {
    setOpen(false);
    router.push('/sign-in');
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/60 p-6 space-y-5"
      >
        {/* Ícono + contenido */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle size={22} className="text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white">Sesión expirada</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Tu sesión expiró. Inicia sesión nuevamente para continuar.
            </p>
          </div>
        </div>

        {/* Botón */}
        <button
          type="button"
          onClick={handleConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-500"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
