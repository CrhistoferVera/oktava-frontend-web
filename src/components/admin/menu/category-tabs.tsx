import { Settings } from 'lucide-react';
import { Category, Product, ProductFilterCategory } from '@/types/product.types';

type MenuCategoryTabsProps = {
  products: Product[];
  categories: Category[];
  activeCategory: ProductFilterCategory;
  onCategoryChange: (category: ProductFilterCategory) => void;
  onManageClick: () => void;
};

export function MenuCategoryTabs({
  products,
  categories,
  activeCategory,
  onCategoryChange,
  onManageClick,
}: MenuCategoryTabsProps) {
  function getCount(categoryId: ProductFilterCategory): number {
    if (categoryId === 'all') return products.length;
    return products.filter((p) => p.categoryId === categoryId).length;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Scrollable carousel row */}
      <div className="flex flex-1 gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {/* "Todos" — always first */}
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`shrink-0 rounded-2xl border px-6 py-3.5 text-lg font-semibold transition ${
            activeCategory === 'all'
              ? 'border-red-600 bg-red-600 text-white'
              : 'border-zinc-800 bg-zinc-900 text-white hover:border-zinc-700 hover:bg-zinc-800'
          }`}
        >
          Todos ({getCount('all')})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={`shrink-0 rounded-2xl border px-6 py-2 text-lg font-semibold transition ${
              activeCategory === cat.id
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-zinc-800 bg-zinc-900 text-white hover:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            {cat.name} ({getCount(cat.id)})
          </button>
        ))}
      </div>

      {/* Manage button — fixed at right, never scrolls */}
      <button
        type="button"
        onClick={onManageClick}
        className="shrink-0 flex items-center gap-2 rounded-2xl border border-zinc-700 px-5 py-3.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-white"
        title="Gestionar categorías"
      >
        <Settings size={16} />
        <span className="hidden sm:inline">Categorías</span>
      </button>
    </div>
  );
}
