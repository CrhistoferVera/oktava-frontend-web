import { Pencil } from 'lucide-react';
import { Product } from '@/types/product.types';

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
};

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const isActive = product.status === 'active';
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
      <div className="h-56 w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white">{product.name}</h3>
            <p className="text-sm uppercase tracking-wide text-red-500">
              {product.category}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-zinc-700 text-zinc-300'
            }`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <p className="text-base leading-relaxed text-zinc-400">
          {product.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black/30 px-4 py-3">
            <p className="text-sm text-zinc-500">Precio</p>
            <p className="mt-2 text-xl font-bold text-white">
              Bs. {product.price}
            </p>
          </div>

          <div className="rounded-2xl bg-black/30 px-4 py-3">
            <p className="text-sm text-zinc-500">Stock</p>
            <p className="mt-2 text-xl font-bold text-white">{product.stock}</p>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-white"
          >
            <Pencil size={14} />
            Editar
          </button>
        </div>
      </div>
    </article>
  );
}
