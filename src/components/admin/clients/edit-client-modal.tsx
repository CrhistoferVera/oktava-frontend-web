import { Client, EditClientFormFields, UpdateClientPayload } from '@/types/client.types';
import { EditClientForm } from './edit-client-form';

type EditClientModalProps = {
  client: Client | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateClientPayload) => void;
};

export function EditClientModal({
  client,
  isSaving = false,
  onClose,
  onSubmit,
}: EditClientModalProps) {
  if (!client) return null;

  const initialValues: EditClientFormFields = {
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone ?? '',
    isActive: client.isActive,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Editar Cliente</h2>
            <p className="mt-2 text-base text-zinc-400">
              Modifica los datos de{' '}
              <span className="text-white">
                {client.firstName} {client.lastName}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
          >
            Cerrar
          </button>
        </div>

        <EditClientForm
          initialValues={initialValues}
          isSaving={isSaving}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
