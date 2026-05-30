'use client';

import { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MapPin, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthRequiredModal } from '@/components/ui/AuthRequiredModal';
import { addressService } from '@/services/address.service';
import type { Address, AddressPayload } from '@/types/address.types';
import { AddressCard } from './address-card';
import { AddressFormModal } from './address-form-modal';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export default function AddressesClient() {
  const { user, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Abrir modal automáticamente si llega a la página sin sesión
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthModalOpen(true);
    }
  }, [authLoading, user]);

  // Cargar direcciones solo cuando hay sesión
  useEffect(() => {
    if (authLoading || !user) return;
    addressService.getAll()
      .then(setAddresses)
      .catch(() => setError('No se pudieron cargar tus direcciones.'))
      .finally(() => setIsLoading(false));
  }, [authLoading, user]);

  // Skeleton mientras auth carga
  if (authLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className="h-44 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  // Sin sesión: modal + fallback si el modal se cierra
  if (!user) {
    return (
      <>
        <AuthRequiredModal
          open={authModalOpen}
          message="Necesitas iniciar sesión o registrarte para guardar tus direcciones."
          confirmHref="/sign-in?redirect=/addresses"
          onCancel={() => setAuthModalOpen(false)}
        />
        {!authModalOpen && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <p className="font-semibold text-white text-base">
              Inicia sesión para ver y guardar tus direcciones
            </p>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </>
    );
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setModalOpen(true);
  }

  async function handleSave(payload: AddressPayload) {
    try {
      setIsSaving(true);
      if (editing) {
        const updated = await addressService.update(editing.id, payload);
        setAddresses((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
      } else {
        const created = await addressService.create(payload);
        setAddresses((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch {
      setError('No se pudo guardar la dirección. Intentá de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar esta dirección?')) return;
    try {
      setDeletingId(id);
      await addressService.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError('No se pudo eliminar la dirección.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <section className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
              Mis direcciones
            </p>
            <h1 className="text-4xl leading-none text-white [font-family:var(--font-display)] md:text-5xl">
              ¿Dónde te llevamos?
            </h1>
            <p className="text-sm text-zinc-400">
              Guardá tus direcciones de entrega para pedidos más rápidos.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            <Plus size={16} />
            Nueva dirección
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-800 bg-red-950/40 px-5 py-4 flex items-center justify-between">
            <p className="text-sm text-red-400">{error}</p>
            <button type="button" onClick={() => setError(null)} className="text-xs text-zinc-400 hover:text-white ml-4">
              Cerrar
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/5 border border-white/10">
              <MapPin size={36} className="text-zinc-600" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white">Sin direcciones guardadas</p>
              <p className="text-sm text-zinc-500">Agregá una para agilizar tus pedidos.</p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <Plus size={16} />
              Agregar dirección
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isDeleting={deletingId === address.id}
                onEdit={() => openEdit(address)}
                onDelete={() => handleDelete(address.id)}
              />
            ))}
          </div>
        )}

        {/* Mobile FAB */}
        {!isLoading && addresses.length > 0 && (
          <button
            type="button"
            onClick={openCreate}
            className="md:hidden fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-900/40 transition hover:bg-red-500"
          >
            <Plus size={22} className="text-white" />
          </button>
        )}

        <AddressFormModal
          isOpen={modalOpen}
          initialData={editing}
          isSaving={isSaving}
          onClose={() => !isSaving && setModalOpen(false)}
          onSave={handleSave}
        />
      </section>
    </APIProvider>
  );
}
