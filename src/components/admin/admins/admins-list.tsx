'use client';

import { ShieldCheck, Mail, Calendar } from 'lucide-react';
import type { AdminUser } from '@/services/user.service';

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(d));
}

type Props = {
  admins: AdminUser[];
  currentUserId?: string;
};

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isActive
          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
          : 'bg-zinc-700/40 text-zinc-500 border border-zinc-700'
      }`}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export function AdminsList({ admins, currentUserId }: Props) {
  if (admins.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-16 text-center">
        <ShieldCheck size={36} className="mx-auto mb-3 text-zinc-700" />
        <p className="text-sm text-zinc-500">No hay administradores registrados.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-600/20 border border-red-500/30">
                  <ShieldCheck size={15} className="text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">
                    {admin.firstName} {admin.lastName}
                    {admin.id === currentUserId && (
                      <span className="ml-2 rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                        Tú
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <StatusBadge isActive={admin.isActive} />
            </div>

            <div className="flex flex-col gap-1.5 pl-12">
              <p className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
                <Mail size={11} className="shrink-0" />
                {admin.email}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar size={11} className="shrink-0" />
                {formatDate(admin.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Administrador
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Correo
              </th>
              <th className="hidden lg:table-cell px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Creado
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {admins.map((admin) => (
              <tr key={admin.id} className="bg-zinc-900/20 transition hover:bg-zinc-900/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-600/20 border border-red-500/30">
                      <ShieldCheck size={15} className="text-red-400" />
                    </div>
                    <p className="font-semibold text-white">
                      {admin.firstName} {admin.lastName}
                      {admin.id === currentUserId && (
                        <span className="ml-2 rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                          Tú
                        </span>
                      )}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-400">{admin.email}</td>
                <td className="hidden lg:table-cell px-5 py-4 text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {formatDate(admin.createdAt)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge isActive={admin.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
