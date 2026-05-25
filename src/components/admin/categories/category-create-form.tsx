'use client';

import { type FormEvent, useState } from 'react';
import { Plus } from 'lucide-react';
import { productService } from '@/services/product.service';
import { ImageUpload } from '@/components/admin/menu/image-upload';
import type { CategoryAdminItem } from '@/types/product.types';

const inputCls =
  'rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition focus:border-zinc-500';

type Props = {
  onCreated: (cat: CategoryAdminItem) => void;
};

export function CategoryCreateForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName('');
    setImageUrl('');
    setSortOrder(0);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es obligatorio.'); return; }

    try {
      setSaving(true);
      setError(null);
      const created = await productService.createCategory({
        name: name.trim(),
        imageUrl: imageUrl || undefined,
        sortOrder,
      });
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
      <p className="mb-4 text-sm font-semibold text-white">Nueva categoría</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-400">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Pollos a la Brasa"
            disabled={saving}
            className={inputCls}
            autoFocus
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
          <p className="text-[11px] text-zinc-600">0 aparece primero</p>
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

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-4 flex justify-end gap-2">
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
