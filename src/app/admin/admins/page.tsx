'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userService, type AdminUser } from '@/services/user.service';
import { CreateAdminForm } from '@/components/admin/admins/create-admin-form';
import { AdminsList } from '@/components/admin/admins/admins-list';

export default function AdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getAdmins()
      .then(setAdmins)
      .catch(() => setError('No se pudieron cargar los administradores.'))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(newAdmin: AdminUser) {
    setAdmins((prev) => [newAdmin, ...prev]);
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={20} className="text-red-400" />
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
              Sistema
            </p>
          </div>
          <h1 className="text-3xl font-bold text-white">Administradores</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestiona los usuarios con acceso al panel de administración.
          </p>
        </div>

        <CreateAdminForm onCreated={handleCreated} />
      </div>

      {/* Counter */}
      {!loading && !error && (
        <p className="text-xs text-zinc-600">
          {admins.length} {admins.length === 1 ? 'administrador registrado' : 'administradores registrados'}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* List */}
      {!loading && !error && (
        <AdminsList admins={admins} currentUserId={user?.id} />
      )}
    </div>
  );
}
