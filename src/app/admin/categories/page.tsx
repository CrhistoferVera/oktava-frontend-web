'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import { CategoryCreateForm } from '@/components/admin/categories/category-create-form';
import { CategoriesList } from '@/components/admin/categories/categories-list';
import type { CategoryAdminItem } from '@/types/product.types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

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
    setCategories((prev) => [...prev, cat]);
  }

  function handleUpdated(cat: CategoryAdminItem) {
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
  }

  function handleDeactivated(id: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: false } : c)),
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Categorías</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Crea, edita o desactiva categorías del menú. El campo{' '}
          <span className="font-medium text-zinc-300">Orden</span> controla qué categoría aparece primero.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-800 bg-red-950/40 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={loadCategories}
            className="ml-4 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Create form */}
      <CategoryCreateForm onCreated={handleCreated} />

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-zinc-500">Cargando categorías...</p>
        </div>
      ) : (
        <CategoriesList
          categories={categories}
          onUpdated={handleUpdated}
          onDeactivated={handleDeactivated}
        />
      )}
    </div>
  );
}
