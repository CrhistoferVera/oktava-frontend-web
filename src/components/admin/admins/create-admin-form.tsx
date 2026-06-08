'use client';

import { type FormEvent, useState } from 'react';
import { Eye, EyeOff, Plus, ShieldCheck } from 'lucide-react';
import { userService, type AdminUser } from '@/services/user.service';

const inputCls =
  'w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition focus:border-zinc-500 disabled:opacity-50';

const inputErrCls =
  'w-full rounded-xl border border-red-500/60 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition disabled:opacity-50';

type Props = {
  onCreated: (admin: AdminUser) => void;
};

export function CreateAdminForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [touched, setTouched]       = useState(false);

  const emailErr    = touched && !/\S+@\S+\.\S+/.test(email.trim());
  const passwordErr = touched && password.length > 0 && password.length < 6;

  function reset() {
    setFirstName(''); setLastName(''); setEmail(''); setPassword('');
    setShowPass(false); setError(null); setTouched(false); setOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!firstName.trim() || !lastName.trim() || !email.trim() || password.length < 6) {
      setError('Completa todos los campos correctamente.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const created = await userService.createAdmin({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      onCreated(created);
      reset();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo crear el administrador.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        <Plus size={15} />
        Nuevo administrador
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck size={17} className="text-red-400 shrink-0" />
        <p className="text-sm font-semibold text-white">Nuevo administrador</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-400">Nombre *</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Juan"
            disabled={saving}
            autoFocus
            className={touched && !firstName.trim() ? inputErrCls : inputCls}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-400">Apellido *</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Pérez"
            disabled={saving}
            className={touched && !lastName.trim() ? inputErrCls : inputCls}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium text-zinc-400">Correo electrónico *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@oktava.com"
            disabled={saving}
            autoComplete="off"
            className={emailErr ? inputErrCls : inputCls}
          />
          {emailErr && (
            <p className="text-[11px] text-red-400">Ingresa un correo válido.</p>
          )}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium text-zinc-400">Contraseña * (mín. 6 caracteres)</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={saving}
              autoComplete="new-password"
              className={`${passwordErr ? inputErrCls : inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {passwordErr && (
            <p className="text-[11px] text-red-400">La contraseña debe tener al menos 6 caracteres.</p>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={reset}
          disabled={saving}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-400 transition hover:text-white disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Creando...' : 'Crear administrador'}
        </button>
      </div>
    </form>
  );
}
