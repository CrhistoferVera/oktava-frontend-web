import { ProductCard } from '@/components/admin/menu/product-card';
import { Product } from '@/types/product.types';

type ProductGridProps = {
  products: Product[];
  busyId: string | null;
  onEdit: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onHardDelete: (product: Product) => void;
};

export function ProductGrid({ products, busyId, onEdit, onToggleStatus, onHardDelete }: Readonly<ProductGridProps>) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900 px-6 py-12 text-center">
        <h3 className="text-zinc-400">No se encontraron productos</h3>
        <p className="mt-3 max-w-xl text-base text-zinc-400">
          Prueba cambiando la categoría o escribiendo otro término en el buscador.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isBusy={busyId === product.id}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onHardDelete={onHardDelete}
        />
      ))}
    </div>
  );
}
