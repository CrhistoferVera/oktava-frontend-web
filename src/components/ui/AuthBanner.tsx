'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

interface AuthBannerProps {
  /** Mensaje a mostrar al usuario */
  message: string;
  /** Ruta base de login */
  redirectTo?: string;
  /** Ruta a la que volver después del login */
  returnTo?: string;
  /** Milisegundos antes de redirigir automáticamente (default 1500) */
  delay?: number;
}

/**
 * Muestra un mensaje contextual cuando el usuario no está autenticado
 * y redirige al login después de un breve delay.
 *
 * Uso: reemplaza el contenido de una página protegida cuando !user.
 */
export function AuthBanner({
  message,
  redirectTo = '/sign-in',
  returnTo,
  delay = 1500,
}: AuthBannerProps) {
  const router = useRouter();

  const href = returnTo
    ? `${redirectTo}?redirect=${encodeURIComponent(returnTo)}`
    : redirectTo;

  useEffect(() => {
    const t = setTimeout(() => router.push(href), delay);
    return () => clearTimeout(t);
  }, [href, router, delay]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-zinc-800/80 border border-white/10">
        <LogIn size={26} className="text-zinc-400" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <p className="text-base font-semibold text-white">{message}</p>
        <p className="text-sm text-zinc-500">Redirigiendo al inicio de sesión…</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
      >
        Iniciar sesión ahora
      </Link>
    </div>
  );
}
