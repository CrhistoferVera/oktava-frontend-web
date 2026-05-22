'use client';

import { useEffect, useRef, useState } from 'react';
import { Category, ProductStatus } from '@/types/product.types';
import { productService } from '@/services/product.service';
import {
  CreateProductFormErrors,
  CreateProductFormFields,
  CreateProductPayload,
  OptionGroupFormField,
  OptionFormItem,
  ProductFormMode,
} from '@/types/product-form.types';
import { INITIAL_FORM_FIELDS, STATUS_OPTIONS } from './product-form.constants';
import { validateProductForm } from './product-form.utils';
import { ImageUpload } from './image-upload';

type CreateProductFormProps = Readonly<{
  mode: ProductFormMode;
  categories: Category[];
  initialValues?: CreateProductFormFields;
  isSaving?: boolean;
  onSubmit: (payload: CreateProductPayload) => void;
  onCancel: () => void;
}>;

const inputBase =
  'rounded-2xl border bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 transition';
const inputNormal = `${inputBase} border-zinc-800`;
const inputErrorClass = `${inputBase} border-red-500`;
const inputSm =
  'rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition';

function fieldClass(hasError: boolean) {
  return hasError ? inputErrorClass : inputNormal;
}

const SUBMIT_LABEL: Record<ProductFormMode, string> = {
  create: 'Guardar producto',
  edit: 'Actualizar producto',
};

function OptionImageUpload({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);
    try {
      const url = await productService.uploadImage(file);
      onChange(url);
    } catch {
      setError('Error al subir');
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = '';
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      {value ? (
        <div className="group relative h-16 w-16 overflow-hidden rounded-xl border border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            disabled={disabled}
            className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/70 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100"
            aria-label="Quitar imagen"
          >
            <span>✕</span>
            <span>Quitar</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || isUploading}
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-700 text-zinc-500 transition hover:border-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 disabled:opacity-50"
          aria-label="Añadir imagen a la opción"
          title="Añadir imagen"
        >
          {isUploading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-red-500" />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-[9px] font-medium">Foto</span>
            </>
          )}
        </button>
      )}
      {error && <p className="text-[9px] leading-none text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
}

function emptyOption(): OptionFormItem {
  return { _key: crypto.randomUUID(), name: '', extraPrice: '0', isAvailable: true, imageUrl: '' };
}

function emptyGroup(): OptionGroupFormField {
  return {
    _key: crypto.randomUUID(),
    name: '',
    isRequired: true,
    minSelections: '1',
    maxSelections: '1',
    sortOrder: '0',
    options: [emptyOption()],
  };
}

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

  // ─── OptionGroup helpers ───────────────────────────────────────────────────

  function addGroup() {
    setField('optionGroups', [...fields.optionGroups, emptyGroup()]);
  }

  function removeGroup(gi: number) {
    setField('optionGroups', fields.optionGroups.filter((_, i) => i !== gi));
  }

  function updateGroup(gi: number, patch: Partial<OptionGroupFormField>) {
    setField(
      'optionGroups',
      fields.optionGroups.map((g, i) => (i === gi ? { ...g, ...patch } : g)),
    );
  }

  function addOption(gi: number) {
    updateGroup(gi, { options: [...fields.optionGroups[gi].options, emptyOption()] });
  }

  function removeOption(gi: number, oi: number) {
    updateGroup(gi, {
      options: fields.optionGroups[gi].options.filter((_, i) => i !== oi),
    });
  }

  function updateOption(gi: number, oi: number, patch: Partial<OptionFormItem>) {
    updateGroup(gi, {
      options: fields.optionGroups[gi].options.map((o, i) =>
        i === oi ? { ...o, ...patch } : o,
      ),
    });
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const validationErrors = validateProductForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: CreateProductPayload = {
      name: fields.name.trim(),
      description: fields.description.trim(),
      ...(fields.includes.trim() && { includes: fields.includes.trim() }),
      categoryId: fields.categoryId,
      price: Number(fields.price),
      ...(fields.imageUrl.trim() && { imageUrl: fields.imageUrl.trim() }),
      isAvailable: fields.status === 'active',
      ...(fields.optionGroups.length > 0 && {
        optionGroups: fields.optionGroups.map((g, gi) => ({
          name: g.name.trim(),
          isRequired: g.isRequired,
          minSelections: Number(g.minSelections) || 1,
          maxSelections: Number(g.maxSelections) || 1,
          sortOrder: Number(g.sortOrder) || gi,
          options: g.options
            .filter((o) => o.name.trim())
            .map((o, oi) => ({
              name: o.name.trim(),
              ...(Number(o.extraPrice) > 0 && { extraPrice: Number(o.extraPrice) }),
              isAvailable: o.isAvailable,
              sortOrder: oi,
              ...(o.imageUrl.trim() && { imageUrl: o.imageUrl.trim() }),
            })),
        })),
      }),
    };

    onSubmit(payload);
    reset();
  }

  function handleCancel() {
    reset();
    onCancel();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

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
          rows={3}
          className={`resize-none ${fieldClass(!!errors.description)}`}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Incluye */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-sm font-medium text-zinc-300">
          Incluye{' '}
          <span className="text-xs font-normal text-zinc-500">(opcional)</span>
        </label>
        <textarea
          value={fields.includes}
          onChange={(e) => setField('includes', e.target.value)}
          placeholder="Ej. Ensalada + Papas fritas + Refresco"
          rows={2}
          className={`resize-none ${inputNormal}`}
        />
      </div>

      {/* Categoría */}
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

      {/* Grupos de opciones */}
      <div className="flex flex-col gap-4 md:col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">Grupos de opciones</span>
          <button
            type="button"
            onClick={addGroup}
            className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
          >
            + Agregar grupo
          </button>
        </div>

        {fields.optionGroups.length === 0 && (
          <p className="text-xs text-zinc-500">
            Sin grupos de opciones. Úsalos para personalizar el producto (ej. &quot;Elige tu presa&quot;).
          </p>
        )}

        {fields.optionGroups.map((group, gi) => (
          <div key={group._key} className="rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
            {/* Cabecera del grupo */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <label
                  htmlFor={`ig-${gi}-name`}
                  className="text-xs font-medium text-zinc-400"
                >
                  Nombre del grupo
                </label>
                <input
                  id={`ig-${gi}-name`}
                  type="text"
                  value={group.name}
                  onChange={(e) => updateGroup(gi, { name: e.target.value })}
                  placeholder='Ej. "Elige tu presa"'
                  className={inputSm}
                />
              </div>
              <button
                type="button"
                onClick={() => removeGroup(gi)}
                className="mt-6 rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400"
              >
                Eliminar
              </button>
            </div>

            {/* Configuración del grupo */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <label
                htmlFor={`ig-${gi}-req`}
                className="flex cursor-pointer items-center gap-2 text-xs text-zinc-400"
              >
                <input
                  id={`ig-${gi}-req`}
                  type="checkbox"
                  checked={group.isRequired}
                  onChange={(e) => updateGroup(gi, { isRequired: e.target.checked })}
                  className="accent-red-500"
                />
                <span>Obligatorio</span>
              </label>
              <label
                htmlFor={`ig-${gi}-min`}
                className="flex items-center gap-2 text-xs text-zinc-400"
              >
                <span>Mín.</span>
                <input
                  id={`ig-${gi}-min`}
                  type="number"
                  value={group.minSelections}
                  onChange={(e) => updateGroup(gi, { minSelections: e.target.value })}
                  min={1}
                  className="w-14 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-center text-sm text-white outline-none"
                />
              </label>
              <label
                htmlFor={`ig-${gi}-max`}
                className="flex items-center gap-2 text-xs text-zinc-400"
              >
                <span>Máx.</span>
                <input
                  id={`ig-${gi}-max`}
                  type="number"
                  value={group.maxSelections}
                  onChange={(e) => updateGroup(gi, { maxSelections: e.target.value })}
                  min={1}
                  className="w-14 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-center text-sm text-white outline-none"
                />
              </label>
            </div>

            {/* Lista de opciones */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Opciones</span>

              {group.options.map((opt, oi) => (
                <div key={opt._key} className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                  {/* Imagen */}
                  <OptionImageUpload
                    value={opt.imageUrl}
                    disabled={isSaving}
                    onChange={(url) => updateOption(gi, oi, { imageUrl: url })}
                  />

                  {/* Campos */}
                  <div className="flex flex-1 flex-col gap-2">
                    {/* Fila 1: nombre + eliminar */}
                    <div className="flex items-center gap-2">
                      <input
                        id={`io-${gi}-${oi}-name`}
                        type="text"
                        value={opt.name}
                        onChange={(e) => updateOption(gi, oi, { name: e.target.value })}
                        placeholder="Nombre de la opción"
                        aria-label="Nombre de la opción"
                        className={`${inputSm} flex-1`}
                      />
                      {group.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(gi, oi)}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-600 transition hover:bg-zinc-800 hover:text-red-400"
                          aria-label="Eliminar opción"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Fila 2: precio + activo */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">+Bs.</span>
                        <input
                          id={`io-${gi}-${oi}-price`}
                          type="number"
                          value={opt.extraPrice}
                          onChange={(e) => updateOption(gi, oi, { extraPrice: e.target.value })}
                          placeholder="0"
                          aria-label="Precio extra en bolivianos"
                          min={0}
                          className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-sm text-white outline-none"
                        />
                      </div>
                      <label
                        htmlFor={`io-${gi}-${oi}-avail`}
                        className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-400"
                      >
                        <input
                          id={`io-${gi}-${oi}-avail`}
                          type="checkbox"
                          checked={opt.isAvailable}
                          onChange={(e) => updateOption(gi, oi, { isAvailable: e.target.checked })}
                          className="accent-red-500"
                        />
                        <span>Activo</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addOption(gi)}
                className="mt-1 w-fit rounded-xl border border-dashed border-zinc-700 px-3 py-1.5 text-xs text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300"
              >
                + Agregar opción
              </button>
            </div>
          </div>
        ))}
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
