'use client';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';
import Image from 'next/image';
import { PasswordInput } from '../ui/PasswordInput';
import { useLogin } from '@/hooks/auth/useLogin';
import { ArrowLeft } from 'lucide-react';

export const SignInForm = () => {
  const router = useRouter();
  const { email, password, error, isLoading, setEmail, setPassword, handleLogin } = useLogin();

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left panel — hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
        />
        {/* Overlay — mismo que la landing */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 pointer-events-none" />
        {/* Grid */}
        <div className="absolute inset-0 oktava-grid-bg opacity-40 pointer-events-none" />
        {/* Glow orbs */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-red-600/[0.07] blur-[140px] pointer-events-none" />
        <div className="absolute -left-24 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-red-700/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-red-600/5 blur-[100px] pointer-events-none" />

        {/* Branding */}
        <div className="relative flex flex-col justify-between h-full p-10">
          <Link href="/">
            <Image src="/oktava_logo.png" alt="Oktava" width={160} height={40} className="object-contain" />
          </Link>

          <div className="space-y-4">
            <h2 className="text-6xl leading-none text-white [font-family:var(--font-display)] uppercase drop-shadow-lg">
              El Sabor<br />
              <span className="text-red-500">Que Te</span><br />
              Obsesiona
            </h2>
            <p className="text-zinc-300 text-sm max-w-xs">
              Pollo a la leña, combos crispy y guarniciones irresistibles. Listos en minutos.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Grid bg */}
        <div className="pointer-events-none absolute inset-0 lg:left-1/2 oktava-grid-bg opacity-20" />

        {/* Back button */}
        <div className="relative p-5 lg:p-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Volver al inicio
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden">
            <Image src="/oktava_logo.png" alt="Oktava" width={110} height={28} className="object-contain" />
          </div>
        </div>

        {/* Form container */}
        <div className="relative flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1">
              <h1 className="text-4xl text-white [font-family:var(--font-display)] uppercase">
                Iniciar sesión
              </h1>
              <p className="text-sm text-zinc-400">
                Bienvenido de nuevo. Ingresa tus datos para continuar.
              </p>
            </div>

            {/* Error de credenciales */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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
              />
              <div className="space-y-1.5">
                <PasswordInput
                  label="Contraseña"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  maxLength={128}
                  disabled={isLoading}
                />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full py-3 rounded-xl text-sm font-bold" variant="primary" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#050505] px-3 text-zinc-500">O continúa con</span>
              </div>
            </div>

            <GoogleButton disabled={isLoading} />

            <p className="text-center text-sm text-zinc-500">
              ¿No tienes cuenta?{' '}
              <Link href="/sign-up" className="text-red-400 hover:text-red-300 transition-colors font-medium">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
