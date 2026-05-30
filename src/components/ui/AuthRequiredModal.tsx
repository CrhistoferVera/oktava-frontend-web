'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { LogIn, X } from 'lucide-react';

interface AuthRequiredModalProps {
  /** Controla si el modal está abierto */
  open: boolean;
  /** Mensaje contextual, p.ej. "Necesitas iniciar sesión para ver tus pedidos." */
  message: string;
  /** URL completa a la que va el botón "Iniciar sesión" (incluye ?redirect= si aplica) */
  confirmHref: string;
  /** Callback del botón "Volver atrás" y del overlay/Esc */
  onCancel: () => void;
}

/**
 * Modal reutilizable que pide al usuario iniciar sesión antes de continuar.
 * No redirige automáticamente — solo lo hace si el usuario presiona "Iniciar sesión".
 */
export function AuthRequiredModal({
  open,
  message,
  confirmHref,
  onCancel,
}: AuthRequiredModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Overlay oscuro — click fuera para cerrar */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/60 p-6 space-y-5"
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-zinc-500 transition-colors hover:text-white"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Ícono + título + mensaje */}
        <div className="flex flex-col items-center gap-3 text-center pt-2">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-red-500/10 border border-red-500/20">
            <LogIn size={22} className="text-red-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white">Inicia sesión para continuar</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2.5">
          <Link
            href={confirmHref}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-500"
          >
            <LogIn size={15} />
            Iniciar sesión
          </Link>
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}
