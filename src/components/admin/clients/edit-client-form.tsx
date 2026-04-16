'use client';

import { FormEvent, useEffect, useState } from 'react';
import { EditClientFormFields, UpdateClientPayload } from '@/types/client.types';

type FormErrors = Partial<Record<keyof EditClientFormFields, string>>;

type EditClientFormProps = {
  initialValues: EditClientFormFields;
  isSaving?: boolean;
  onSubmit: (payload: UpdateClientPayload) => void;
  onCancel: () => void;
};

const inputBase =
  'rounded-2xl border bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 transition';
const inputNormal = `${inputBase} border-zinc-800`;
const inputError = `${inputBase} border-red-500`;

function fieldClass(hasError: boolean) {
  return hasError ? inputError : inputNormal;
}

function validate(fields: EditClientFormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
  if (!fields.lastName.trim()) errors.lastName = 'El apellido es obligatorio.';
  return errors;
}

export function EditClientForm({
  initialValues,
  isSaving = false,
  onSubmit,
  onCancel,
}: EditClientFormProps) {
  const [fields, setFields] = useState<EditClientFormFields>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setFields(initialValues);
    setErrors({});
  }, [initialValues]);

  function setField<K extends keyof EditClientFormFields>(
    key: K,
    value: EditClientFormFields[K],
  ) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: UpdateClientPayload = {
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      phone: fields.phone.trim() || undefined,
      isActive: fields.isActive,
    };

    onSubmit(payload);
  }

  function handleCancel() {
    setFields(initialValues);
    setErrors({});
    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Nombre</label>
        <input
          type="text"
          value={fields.firstName}
          onChange={(e) => setField('firstName', e.target.value)}
          placeholder="Ej. María"
          disabled={isSaving}
          className={fieldClass(!!errors.firstName)}
        />
        {errors.firstName && (
          <p className="text-xs text-red-400">{errors.firstName}</p>
        )}
      </div>

      {/* Apellido */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Apellido</label>
        <input
          type="text"
          value={fields.lastName}
          onChange={(e) => setField('lastName', e.target.value)}
          placeholder="Ej. Rodríguez"
          disabled={isSaving}
          className={fieldClass(!!errors.lastName)}
        />
        {errors.lastName && (
          <p className="text-xs text-red-400">{errors.lastName}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">
          Teléfono{' '}
          <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          type="text"
          value={fields.phone}
          onChange={(e) => setField('phone', e.target.value)}
          placeholder="Ej. +591 765-4321"
          disabled={isSaving}
          className={inputNormal}
        />
      </div>

      {/* Estado */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Estado</label>
        <select
          value={fields.isActive ? 'active' : 'inactive'}
          onChange={(e) => setField('isActive', e.target.value === 'active')}
          disabled={isSaving}
          className={inputNormal}
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
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
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
