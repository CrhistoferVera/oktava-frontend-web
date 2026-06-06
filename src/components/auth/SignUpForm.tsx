'use client';

import { useRef } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';
import Image from 'next/image';
import { PasswordInput } from '../ui/PasswordInput';
import { PasswordRequirements } from '../ui/PasswordRequirements';
import { PhoneInput } from '../ui/PhoneInput';
import { TermsCheckbox } from './TermsCheckBox';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { ArrowLeft, Mail, MessageCircle, RotateCcw, ShieldCheck, X } from 'lucide-react';

export const SignUpForm = () => {
  const router = useRouter();
  const {
    acceptedTerms, confirmPassword, email, error, firstName,
    handleSendCode, handleVerifyAndRegister, handleResend,
    handleGoVerifyPhone, handleSkipPhone,
    isLoading, lastName, password, phone, step, code, setCode,
    setConfirmPassword, setEmail, setFirstName,
    setLastName, setPassword, setPhone, setAcceptedTerms,
    resendCooldown, goBack,
  } = useSignUp();

  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const chars = code.split('');
    chars[index] = digit;
    const next = chars.join('');
    setCode(next);
    if (digit && index < 5) digitRefs.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setCode(pasted.padEnd(6, '').slice(0, 6));
    digitRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  const leftPanel = (
    <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
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
      <div className="relative flex flex-col justify-between h-full p-10">
        <Link href="/">
          <Image src="/oktava_logo.png" alt="Oktava" width={160} height={40} className="object-contain" />
        </Link>
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            Nuevo por aquí
          </p>
          <h2 className="text-6xl leading-none text-white [font-family:var(--font-display)] uppercase drop-shadow-lg">
            Crea tu<br /><span className="text-red-500">cuenta</span><br />gratis
          </h2>
          <p className="text-zinc-300 text-sm max-w-xs">
            Haz tus pedidos más rápido, revisa tu historial y disfruta de ofertas exclusivas.
          </p>
        </div>
      </div>
    </div>
  );

  // ─── Step 3: Phone prompt ───────────────────────────────────────────────────
  if (step === 'phone-prompt') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="pointer-events-none fixed inset-0 oktava-grid-bg opacity-20" />
        <div className="pointer-events-none fixed left-1/2 -top-50 h-120 w-120 -translate-x-1/2 rounded-full bg-red-600/20 blur-[130px]" />

        <div className="relative w-full max-w-sm space-y-6 text-center">
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-green-500/10 border border-green-500/30">
            <ShieldCheck size={28} className="text-green-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl text-white [font-family:var(--font-display)] uppercase">
              ¡Cuenta creada!
            </h1>
            <p className="text-sm text-zinc-400">
              ¿Querés verificar tu número de WhatsApp ahora? Esto te permite recibir actualizaciones de tus pedidos.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoVerifyPhone}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-500"
            >
              <MessageCircle size={16} />
              Verificar por WhatsApp
            </button>
            <button
              type="button"
              onClick={handleSkipPhone}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={14} />
              Omitir por ahora
            </button>
          </div>

          <p className="text-[11px] text-zinc-600">
            Podrás verificarlo más tarde desde tu perfil.
          </p>
        </div>
      </div>
    );
  }

  // ─── Step 2: OTP ────────────────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-[#050505] flex">
        {leftPanel}
        <div className="w-full lg:w-[58%] flex flex-col">
          <div className="pointer-events-none absolute inset-0 lg:left-[42%] oktava-grid-bg opacity-20" />
          <div className="relative p-5 lg:p-8">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> Volver
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center px-6 pb-10">
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-red-500/10 border border-red-500/30">
                <Mail size={28} className="text-red-400" />
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl text-white [font-family:var(--font-display)] uppercase">
                  Verifica tu correo
                </h1>
                <p className="text-sm text-zinc-400">
                  Enviamos un código de 6 dígitos a{' '}
                  <span className="font-semibold text-white">{email}</span>
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300 text-left">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                {/* 6-digit inputs */}
                <div className="flex justify-center gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => { digitRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={code[i] ?? ''}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      onPaste={handleDigitPaste}
                      disabled={isLoading}
                      className="h-14 w-11 rounded-xl border border-zinc-700 bg-zinc-900 text-center text-xl font-bold text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-bold"
                  variant="primary"
                  disabled={isLoading || code.length < 6}
                >
                  {isLoading ? 'Verificando…' : 'Confirmar código'}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                <RotateCcw size={13} />
                {resendCooldown > 0 ? (
                  <span>Reenviar en {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                  >
                    Reenviar código
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 1: form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] flex">
      {leftPanel}
      <div className="w-full lg:w-[58%] flex flex-col">
        <div className="pointer-events-none absolute inset-0 lg:left-[42%] oktava-grid-bg opacity-20" />
        <div className="relative p-5 lg:p-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} /> Volver al inicio
          </button>
          <div className="lg:hidden">
            <Image src="/oktava_logo.png" alt="Oktava" width={110} height={28} className="object-contain" />
          </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-lg space-y-5">
            <div className="space-y-1">
              <h1 className="text-4xl text-white [font-family:var(--font-display)] uppercase">Crear cuenta</h1>
              <p className="text-sm text-zinc-400">Solo toma un minuto. Empieza a pedir hoy.</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Nombre" id="firstName" type="text" placeholder="Tu nombre"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  required maxLength={254} disabled={isLoading} />
                <Input label="Apellido" id="lastName" type="text" placeholder="Tu apellido"
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  required maxLength={254} disabled={isLoading} />
              </div>
              <Input label="Correo electrónico" id="email" type="email" placeholder="tu@ejemplo.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required maxLength={254} disabled={isLoading} />
              <PhoneInput
                id="phoneNumber"
                label="Número de teléfono"
                value={phone}
                onChange={setPhone}
                disabled={isLoading}
              />
              <div className="grid grid-cols-2 gap-3">
                <PasswordInput label="Contraseña" id="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••"
                  required maxLength={128} disabled={isLoading} />
                <PasswordInput label="Confirmar contraseña" id="confirmPassword" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••"
                  required maxLength={128} disabled={isLoading} />
              </div>
              <PasswordRequirements password={password} show={password.length > 0} />
              <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />
              <Button type="submit" className="w-full py-3 rounded-xl text-sm font-bold" variant="primary" disabled={isLoading}>
                {isLoading ? 'Enviando código…' : 'Continuar'}
              </Button>
            </form>

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
