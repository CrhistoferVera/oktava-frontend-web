'use client';

import { useEffect, useState } from 'react';
import { Category, ProductStatus } from '@/types/product.types';
import {
  CreateProductFormErrors,
  CreateProductFormFields,
  CreateProductPayload,
  ProductFormMode,
} from '@/types/product-form.types';
import { INITIAL_FORM_FIELDS, STATUS_OPTIONS } from './product-form.constants';
import { validateProductForm } from './product-form.utils';
import { ImageUpload } from './image-upload';

type CreateProductFormProps = {
  mode: ProductFormMode;
  categories: Category[];
  initialValues?: CreateProductFormFields;
  isSaving?: boolean;
  onSubmit: (payload: CreateProductPayload) => void;
  onCancel: () => void;
};

const inputBase =
  'rounded-2xl border bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 transition';
const inputNormal = `${inputBase} border-zinc-800`;
const inputErrorClass = `${inputBase} border-red-500`;

function fieldClass(hasError: boolean) {
  return hasError ? inputErrorClass : inputNormal;
}

const SUBMIT_LABEL: Record<ProductFormMode, string> = {
  create: 'Guardar producto',
  edit: 'Actualizar producto',
};

export function CreateProductForm({
  mode,
  categories,
  initialValues,
  isSaving = false,
  onSubmit,
  onCancel,
}: CreateProductFormProps) {
  const [fields, setFields] = useState<CreateProductFormFields>(
    initialValues ?? INITIAL_FORM_FIELDS,
  );
  const [errors, setErrors] = useState<CreateProductFormErrors>({});

  useEffect(() => {
    setFields(initialValues ?? INITIAL_FORM_FIELDS);
    setErrors({});
  }, [initialValues]);

  function setField<K extends keyof CreateProductFormFields>(
    key: K,
    value: CreateProductFormFields[K],
  ) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setFields(INITIAL_FORM_FIELDS);
    setErrors({});
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateProductForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: CreateProductPayload = {
      name: fields.name.trim(),
      description: fields.description.trim(),
      categoryId: fields.categoryId,
      price: Number(fields.price),
      imageUrl: fields.imageUrl.trim(),
      isAvailable: fields.status === 'active',
    };

    onSubmit(payload);
    reset();
  }

  function handleCancel() {
    reset();
    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {/* Nombre */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-zinc-300">
          Nombre del producto
        </label>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Ej. Pollo a la Brasa Clásico"
          className={fieldClass(!!errors.name)}
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-zinc-300">Descripción</label>
        <textarea
          value={fields.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Describe brevemente el producto"
          rows={4}
          className={`resize-none ${fieldClass(!!errors.description)}`}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Categoría — dinámica desde API */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Categoría</label>
        <select
          value={fields.categoryId}
          onChange={(e) => setField('categoryId', e.target.value)}
          className={fieldClass(!!errors.categoryId)}
        >
          <option value="">Seleccionar categoría...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-red-400">{errors.categoryId}</p>
        )}
      </div>

      {/* Estado */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Estado</label>
        <select
          value={fields.status}
          onChange={(e) => setField('status', e.target.value as ProductStatus)}
          className={fieldClass(!!errors.status)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-xs text-red-400">{errors.status}</p>
        )}
      </div>

      {/* Precio */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Precio (Bs.)</label>
        <input
          type="number"
          value={fields.price}
          onChange={(e) => setField('price', e.target.value)}
          placeholder="Ej. 45"
          className={fieldClass(!!errors.price)}
        />
        {errors.price && (
          <p className="text-xs text-red-400">{errors.price}</p>
        )}
      </div>

      {/* Imagen */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-zinc-300">Imagen del producto</label>
        <ImageUpload
          value={fields.imageUrl}
          disabled={isSaving}
          onChange={(url) => setField('imageUrl', url)}
        />
        {errors.imageUrl && (
          <p className="text-xs text-red-400">{errors.imageUrl}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-4 pt-4 md:col-span-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="rounded-2xl border border-zinc-800 px-5 py-3 font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {isSaving ? 'Guardando...' : SUBMIT_LABEL[mode]}
        </button>
      </div>
    </form>
  );
}
