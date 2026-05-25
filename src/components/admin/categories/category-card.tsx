'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { Check, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { productService } from '@/services/product.service';
import { ImageUpload } from '@/components/admin/menu/image-upload';
import type { CategoryAdminItem, UpdateCategoryPayload } from '@/types/product.types';

const inputCls =
  'rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition focus:border-zinc-500';

type Props = {
  category: CategoryAdminItem;
  onUpdated: (cat: CategoryAdminItem) => void;
  onDeactivated: (id: string) => void;
};

export function CategoryCard({ category, onUpdated, onDeactivated }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [imageUrl, setImageUrl] = useState(category.imageUrl ?? '');
  const [sortOrder, setSortOrder] = useState(category.sortOrder);
  const [isActive, setIsActive] = useState(category.isActive);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setName(category.name);
      setImageUrl(category.imageUrl ?? '');
      setSortOrder(category.sortOrder);
      setIsActive(category.isActive);
    }
  }, [category, editing]);

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es obligatorio.'); return; }

    try {
      setSaving(true);
      setError(null);
      const payload: UpdateCategoryPayload = {
        name: name.trim(),
        imageUrl: imageUrl || undefined,
        sortOrder,
        isActive,
      };
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
      // silent
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

  // ── Edit mode ──────────────────────────────────────────────────────────────

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
            <label className="text-xs font-medium text-zinc-400">
              Orden de pantalla
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              disabled={saving}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-400">Imagen</label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            disabled={saving}
          />
        </div>

        <div className="mt-3 flex flex-col gap-1 sm:w-1/2">
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

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
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

  // ── View mode ──────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border px-4 py-3 ${
        category.isActive
          ? 'border-zinc-800 bg-zinc-900'
          : 'border-zinc-800/50 bg-zinc-900/40'
      }`}
    >
      {/* Thumbnail */}
      {category.imageUrl ? (
        <img
          src={category.imageUrl}
          alt={category.name}
          className="h-12 w-12 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
          <ImageIcon size={18} className="text-zinc-600" />
        </div>
      )}

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-2">
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
          <span className="rounded-lg bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400">
            #{category.sortOrder}
          </span>
        </div>
        {category.productCount > 0 && (
          <span className="text-xs text-zinc-600">
            {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Actions */}
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
