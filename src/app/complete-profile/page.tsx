'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone } from 'lucide-react';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/menu';
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 7) {
      setError('Ingresa un número válido.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await authService.updateProfile(phone);
      await updateUser({ phone });
      router.push(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'No se pudo guardar el número.');
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (user?.phone) router.push('/menu');
  }, [user?.phone, router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="pointer-events-none fixed inset-0 oktava-grid-bg opacity-20" />
      <div className="pointer-events-none fixed left-1/2 top-[-200px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[130px]" />

      <div className="relative w-full max-w-md space-y-8 text-center">
        <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-red-500/10 border border-red-500/30">
          <Phone size={28} className="text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl text-white [font-family:var(--font-display)] uppercase tracking-wide">
            Un paso más
          </h1>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto">
            Necesitamos tu número de teléfono para poder contactarnos contigo.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <PhoneInput
            id="phone"
            label="Número de WhatsApp"
            value={phone}
            onChange={setPhone}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 disabled:opacity-60"
          >
            {isLoading ? 'Guardando…' : 'Continuar al menú'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push('/menu')}
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Omitir por ahora
        </button>
      </div>
    </div>
  );
}
