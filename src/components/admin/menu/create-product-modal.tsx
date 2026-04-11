import {
  CreateProductFormFields,
  CreateProductPayload,
  ProductFormMode,
} from '@/types/product-form.types';
import { CreateProductForm } from './create-product-form';

type CreateProductModalProps = {
  isOpen: boolean;
  mode: ProductFormMode;
  initialValues?: CreateProductFormFields;
  onClose: () => void;
  onSubmit: (payload: CreateProductPayload) => void;
};

const MODAL_COPY: Record<ProductFormMode, { title: string; subtitle: string }> = {
  create: {
    title: 'Nuevo Producto',
    subtitle: 'Completa la información para agregar un nuevo producto al menú.',
  },
  edit: {
    title: 'Editar Producto',
    subtitle: 'Modifica la información del producto seleccionado.',
  },
};

export function CreateProductModal({
  isOpen,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: CreateProductModalProps) {
  if (!isOpen) return null;

  function handleSubmit(payload: CreateProductPayload) {
    onSubmit(payload);
    onClose();
  }

  const { title, subtitle } = MODAL_COPY[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-base text-zinc-400">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
          >
            Cerrar
          </button>
        </div>

        <CreateProductForm
          mode={mode}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
