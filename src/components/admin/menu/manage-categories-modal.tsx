'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { productService } from '@/services/product.service';
import { CategoryAdminItem, UpdateCategoryPayload } from '@/types/product.types';

const inputCls =
  'rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition focus:border-zinc-500';

// ─── Create form ──────────────────────────────────────────────────────────────

type CreateFormProps = {
  onCreated: (cat: CategoryAdminItem) => void;
};

function CreateForm({ onCreated }: CreateFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName('');
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es obligatorio.'); return; }

    try {
      setSaving(true);
      setError(null);
      const created = await productService.createCategory({ name: name.trim() });
      onCreated({ ...created, productCount: 0 });
      reset();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo crear la categoría.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-white"
      >
        <Plus size={15} />
        Nueva categoría
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-4"
    >
      <p className="mb-3 text-sm font-semibold text-white">Nueva categoría</p>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-400">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Pollos"
          disabled={saving}
          className={inputCls}
          autoFocus
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-3 flex justify-end gap-2">
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
          {saving ? 'Creando...' : 'Crear'}
        </button>
      </div>
    </form>
  );
}

// ─── Category row ─────────────────────────────────────────────────────────────

type CategoryRowProps = {
  category: CategoryAdminItem;
  onUpdated: (cat: CategoryAdminItem) => void;
  onDeactivated: (id: string) => void;
};

function CategoryRow({ category, onUpdated, onDeactivated }: CategoryRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [isActive, setIsActive] = useState(category.isActive);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setName(category.name);
      setIsActive(category.isActive);
    }
  }, [category, editing]);

  function cancelEdit() {
    setEditing(false);
    setName(category.name);
    setIsActive(category.isActive);
    setError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es obligatorio.'); return; }

    try {
      setSaving(true);
      setError(null);
      const payload: UpdateCategoryPayload = { name: name.trim(), isActive };
      const updated = await productService.updateCategory(category.id, payload);
      onUpdated({ ...updated, productCount: category.productCount });
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo actualizar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!window.confirm(`¿Desactivar la categoría "${category.name}"?`)) return;
    try {
      setDeactivating(true);
      await productService.deleteCategory(category.id);
      onDeactivated(category.id);
    } catch {
      // silent — parent reflects state change
    } finally {
      setDeactivating(false);
    }
  }

  async function handleReactivate() {
    try {
      setSaving(true);
      const updated = await productService.updateCategory(category.id, { isActive: true });
      onUpdated({ ...updated, productCount: category.productCount });
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-zinc-600 bg-zinc-800/60 p-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              autoFocus
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Estado</label>
            <select
              value={isActive ? 'active' : 'inactive'}
              onChange={(e) => setIsActive(e.target.value === 'active')}
              disabled={saving}
              className={inputCls}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelEdit}
            disabled={saving}
            className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            <Check size={12} />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
        category.isActive
          ? 'border-zinc-800 bg-zinc-900'
          : 'border-zinc-800/50 bg-zinc-900/40'
      }`}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${
              category.isActive ? 'text-white' : 'text-zinc-500'
            }`}
          >
            {category.name}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              category.isActive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-zinc-700 text-zinc-400'
            }`}
          >
            {category.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        {category.productCount > 0 && (
          <span className="text-xs text-zinc-600">
            {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          disabled={deactivating || saving}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-white disabled:opacity-40"
        >
          <Pencil size={12} />
          Editar
        </button>

        {category.isActive ? (
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={deactivating || saving}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-red-700 hover:text-red-400 disabled:opacity-40"
          >
            <Trash2 size={12} />
            {deactivating ? '...' : 'Desactivar'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReactivate}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-emerald-700 hover:text-emerald-400 disabled:opacity-40"
          >
            <Check size={12} />
            {saving ? '...' : 'Activar'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ManageCategoriesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesChanged: () => void;
};

export function ManageCategoriesModal({
  isOpen,
  onClose,
  onCategoriesChanged,
}: ManageCategoriesModalProps) {
  const [categories, setCategories] = useState<CategoryAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    loadCategories();
  }, [isOpen]);

  async function loadCategories() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getAllCategoriesAdmin();
      setCategories(data);
    } catch {
      setError('No se pudieron cargar las categorías.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreated(cat: CategoryAdminItem) {
    setCategories((prev) =>
      [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)),
    );
    onCategoriesChanged();
  }

  function handleUpdated(cat: CategoryAdminItem) {
    setCategories((prev) =>
      prev
        .map((c) => (c.id === cat.id ? cat : c))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
    onCategoriesChanged();
  }

  function handleDeactivated(id: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: false } : c)),
    );
    onCategoriesChanged();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-8 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Categorías</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Crea, edita o desactiva categorías del menú.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-4 overflow-y-auto px-8 pb-8">
          {error && (
            <div className="flex items-center justify-between rounded-2xl border border-red-800 bg-red-950/40 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-4 text-xs text-zinc-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>
          )}

          <CreateForm onCreated={handleCreated} />

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-zinc-500">Cargando categorías...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-zinc-500">
                No hay categorías aún. Crea la primera.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onUpdated={handleUpdated}
                  onDeactivated={handleDeactivated}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
