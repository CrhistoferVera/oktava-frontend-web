'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { email, setEmail, step, error, isLoading, handleSubmit, goToResetPassword } = useForgotPassword();

  // ─── Estado: email enviado ──────────────────────────────────────────────────
  if (step === 'sent') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="pointer-events-none fixed inset-0 oktava-grid-bg opacity-20" />
        <div className="pointer-events-none fixed left-1/2 -top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/20 blur-[130px]" />

        <div className="relative w-full max-w-sm space-y-6 text-center">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-green-500/10 border border-green-500/30">
            <CheckCircle size={28} className="text-green-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl text-white [font-family:var(--font-display)] uppercase">
              Revisa tu correo
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Si el correo existe, recibirás un código de 6 dígitos para restablecer tu contraseña.
              <br />
              <span className="text-zinc-500 text-xs mt-1 block">
                El código expira en 15 minutos.
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={goToResetPassword}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-red-700 hover:bg-red-600 py-3 text-sm font-bold text-white transition"
          >
            Ingresar código
          </button>

          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={14} />
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  // ─── Estado: formulario ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Panel izquierdo — imagen */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1200&auto=format&fit=crop"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-red-700/30 blur-[120px] pointer-events-none" />

        <div className="relative flex flex-col justify-between h-full p-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-red-500/60 bg-red-500/20 text-sm font-bold text-red-100">
              O
            </span>
            <span className="text-2xl uppercase tracking-[0.16em] text-white [font-family:var(--font-display)]">
              Oktava
            </span>
          </Link>

          <div className="space-y-4">
            <h2 className="text-6xl leading-none text-white [font-family:var(--font-display)] uppercase drop-shadow-lg">
              Sin acceso?<br />
              <span className="text-red-500">Te</span><br />
              Ayudamos
            </h2>
            <p className="text-zinc-300 text-sm max-w-xs">
              Ingresa tu correo y te enviaremos un código para recuperar tu cuenta.
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="pointer-events-none absolute inset-0 lg:left-1/2 oktava-grid-bg opacity-20" />

        {/* Barra superior */}
        <div className="relative p-5 lg:p-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/sign-in')}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Volver a iniciar sesión
          </button>

          {/* Logo móvil */}
          <div className="lg:hidden flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-red-500/60 bg-red-500/20 text-xs font-bold text-red-100">
              O
            </span>
            <span className="text-lg uppercase tracking-widest text-white [font-family:var(--font-display)]">
              Oktava
            </span>
          </div>
        </div>

        {/* Formulario */}
        <div className="relative flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                <Mail size={22} className="text-red-400" />
              </div>
              <h1 className="text-4xl text-white [font-family:var(--font-display)] uppercase">
                Recuperar contraseña
              </h1>
              <p className="text-sm text-zinc-400">
                Ingresa tu correo y te enviaremos un código de recuperación.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Correo electrónico"
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                disabled={isLoading}
                autoComplete="email"
              />

              <Button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold"
                variant="primary"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? 'Enviando código…' : 'Enviar código'}
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-500">
              ¿Recordaste tu contraseña?{' '}
              <Link
                href="/sign-in"
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
