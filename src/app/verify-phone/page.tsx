'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

export default function VerifyPhonePage() {
  return (
    <Suspense>
      <VerifyPhoneContent />
    </Suspense>
  );
}

function VerifyPhoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/menu';
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState<'send' | 'otp'>('send');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  function startCooldown() {
    setCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSendCode() {
    setError(null);
    setIsLoading(true);
    try {
      await authService.sendPhoneVerification();
      setStep('otp');
      startCooldown();
      setTimeout(() => digitRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'No se pudo enviar el código.');
    } finally {
      setIsLoading(false);
    }
  }

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

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) { setError('Ingresa el código completo.'); return; }
    setError(null);
    setIsLoading(true);
    try {
      await authService.verifyPhone(code);
      await updateUser({ phoneVerified: true });
      router.push(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Código incorrecto o expirado.');
    } finally {
      setIsLoading(false);
    }
  }

  if(!user?.phone){
    router.push("/complete-profile?redirect=/verify-phone");
  }
  const phone = user?.phone ?? '';
  const maskedPhone = phone.length > 4
    ? phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4)
    : phone;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="pointer-events-none fixed inset-0 oktava-grid-bg opacity-20" />
      <div className="pointer-events-none fixed left-1/2 top-[-200px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[130px]" />

      <div className="relative w-full max-w-md space-y-8 text-center">
        <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-red-500/10 border border-red-500/30">
          <ShieldCheck size={28} className="text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl text-white [font-family:var(--font-display)] uppercase tracking-wide">
            Verifica tu WhatsApp
          </h1>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto">
            {step === 'send'
              ? `Te enviaremos un código de 6 dígitos a tu número ${maskedPhone ? `terminado en ${phone.slice(-4)}` : 'registrado'}.`
              : <>Ingresa el código enviado a <span className="font-semibold text-white">{maskedPhone}</span></>
            }
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300 text-left">
            {error}
          </div>
        )}

        {step === 'send' ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 disabled:opacity-60"
            >
              {isLoading ? 'Enviando…' : 'Enviar código por WhatsApp'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP digits */}
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

            <button
              type="submit"
              disabled={isLoading || code.length < 6}
              className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 disabled:opacity-60"
            >
              {isLoading ? 'Verificando…' : 'Confirmar código'}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
              <RotateCcw size={13} />
              {cooldown > 0 ? (
                <span>Reenviar en {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                >
                  Reenviar código
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
