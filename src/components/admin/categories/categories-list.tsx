'use client';

import { useMemo } from 'react';
import { CategoryCard } from './category-card';
import type { CategoryAdminItem } from '@/types/product.types';

type Props = {
  categories: CategoryAdminItem[];
  onUpdated: (cat: CategoryAdminItem) => void;
  onDeactivated: (id: string) => void;
};

export function CategoriesList({ categories, onUpdated, onDeactivated }: Props) {
  const sorted = useMemo(
    () =>
      [...categories].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      ),
    [categories],
  );

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-zinc-500">
          No hay categorías aún. Crea la primera.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          onUpdated={onUpdated}
          onDeactivated={onDeactivated}
        />
      ))}
    </div>
  );
}
