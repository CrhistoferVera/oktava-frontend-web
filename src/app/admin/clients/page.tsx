'use client';

import { useCallback, useEffect, useState } from 'react';
import { ClientsHeader } from '@/components/admin/clients/header';
import { ClientsMetrics } from '@/components/admin/clients/metrics';
import { ClientsSegmentSummary } from '@/components/admin/clients/segment-summary';
import { ClientsSearch } from '@/components/admin/clients/search';
import { ClientsGrid } from '@/components/admin/clients/clients-grid';
import { EditClientModal } from '@/components/admin/clients/edit-client-modal';
import { userService } from '@/services/user.service';
import { Client, UpdateClientPayload } from '@/types/client.types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Load clients — re-runs with debounced search ────────────────────────

  const loadClients = useCallback(async (search: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getClients(search);
      setClients(data);
    } catch {
      setError('Error al cargar los clientes. Intenta recargar la página.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadClients(searchTerm);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, loadClients]);

  // ─── Edit handlers ────────────────────────────────────────────────────────

  function openEditModal(client: Client) {
    setEditingClient(client);
  }

  function closeEditModal() {
    if (isSaving) return;
    setEditingClient(null);
  }

  async function handleUpdateClient(payload: UpdateClientPayload) {
    if (!editingClient) return;
    const clientId = editingClient.id;

    try {
      setIsSaving(true);
      setError(null);
      const updated = await userService.updateClient(clientId, payload);
      // Backend only returns { id, firstName, lastName, email, phone, isActive }
      // Merge with local state to preserve totalOrders, totalSpent, segment, etc.
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? {
                ...c,
                firstName: updated.firstName,
                lastName: updated.lastName,
                phone: updated.phone,
                isActive: updated.isActive,
              }
            : c,
        ),
      );
      setEditingClient(null);
    } catch {
      setError('No se pudo actualizar el cliente. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  // ─── Deactivate handler ───────────────────────────────────────────────────

  async function handleDeactivate(client: Client) {
    if (
      !window.confirm(
        `¿Desactivar a "${client.firstName} ${client.lastName}"? El cliente quedará inactivo.`,
      )
    ) {
      return;
    }

    try {
      setDeactivatingId(client.id);
      setError(null);
      await userService.deactivateClient(client.id);
      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, isActive: false } : c)),
      );
    } catch {
      setError('No se pudo desactivar el cliente. Intenta de nuevo.');
    } finally {
      setDeactivatingId(null);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading && clients.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-zinc-400">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <ClientsHeader />

        {error && (
          <div className="flex items-center justify-between rounded-2xl border border-red-800 bg-red-950/40 px-5 py-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-4 text-sm text-zinc-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
        )}

        <ClientsMetrics clients={clients} />
        <ClientsSegmentSummary clients={clients} />
        <ClientsSearch value={searchTerm} onChange={setSearchTerm} />

        {isLoading ? (
          <div className="flex min-h-70 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <p className="text-zinc-400">Buscando...</p>
          </div>
        ) : (
          <ClientsGrid
            clients={clients}
            deactivatingId={deactivatingId}
            onEdit={openEditModal}
            onDeactivate={handleDeactivate}
          />
        )}
      </div>

      <EditClientModal
        client={editingClient}
        isSaving={isSaving}
        onClose={closeEditModal}
        onSubmit={handleUpdateClient}
      />
    </>
  );
}
