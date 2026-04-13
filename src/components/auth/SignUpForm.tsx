'use client';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';
import { PasswordInput } from '../ui/PasswordInput';
import { PasswordRequirements } from '../ui/PasswordRequirements';
import { TermsCheckbox } from './TermsCheckBox';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { ArrowLeft } from 'lucide-react';

export const SignUpForm = () => {
  const router = useRouter();
  const {
    acceptedTerms, confirmPassword, email, error, firstName,
    handleSignUp, isLoading, lastName, password, phone,
    setConfirmPassword, setEmail, setFirstName,
    setLastName, setPassword, setPhone, setAcceptedTerms,
  } = useSignUp();

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left panel — food image */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=1200&auto=format&fit=crop"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute -top-10 -right-10 h-80 w-80 rounded-full bg-red-700/25 blur-[100px] pointer-events-none" />

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
            <p className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              Nuevo por aquí
            </p>
            <h2 className="text-6xl leading-none text-white [font-family:var(--font-display)] uppercase drop-shadow-lg">
              Crea tu<br />
              <span className="text-red-500">cuenta</span><br />
              gratis
            </h2>
            <p className="text-zinc-300 text-sm max-w-xs">
              Haz tus pedidos más rápido, revisa tu historial y disfruta de ofertas exclusivas.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[58%] flex flex-col">
        <div className="pointer-events-none absolute inset-0 lg:left-[42%] oktava-grid-bg opacity-20" />

        <div className="relative p-5 lg:p-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Volver al inicio
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-red-500/60 bg-red-500/20 text-xs font-bold text-red-100">O</span>
            <span className="text-lg uppercase tracking-widest text-white [font-family:var(--font-display)]">Oktava</span>
          </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-lg space-y-5">
            <div className="space-y-1">
              <h1 className="text-4xl text-white [font-family:var(--font-display)] uppercase">
                Crear cuenta
              </h1>
              <p className="text-sm text-zinc-400">
                Solo toma un minuto. Empieza a pedir hoy.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Nombre"
                  id="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  maxLength={254}
                  disabled={isLoading}
                />
                <Input
                  label="Apellido"
                  id="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  maxLength={254}
                  disabled={isLoading}
                />
              </div>

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

              <Input
                label="Número de teléfono"
                id="phoneNumber"
                type="tel"
                placeholder="+591 70000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                maxLength={20}
                disabled={isLoading}
              />

              <div className="grid grid-cols-2 gap-3">
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
                <PasswordInput
                  label="Confirmar contraseña"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  maxLength={128}
                  disabled={isLoading}
                />
              </div>

              <PasswordRequirements password={password} show={password.length > 0} />
              <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />

              <Button type="submit" className="w-full py-3 rounded-xl text-sm font-bold" variant="primary" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
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
              ¿Ya tienes cuenta?{' '}
              <Link href="/sign-in" className="text-red-400 hover:text-red-300 transition-colors font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
