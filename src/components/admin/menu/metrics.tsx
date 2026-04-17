import { useMemo } from 'react';
import { Product } from '@/types/product.types';
import { MenuMetricCard } from '@/components/admin/menu/metric-card';

type MenuMetricsProps = {
  products: Product[];
};

export function MenuMetrics({ products }: MenuMetricsProps) {
  const metrics = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === 'active').length;
    const inactive = products.filter((p) => p.status === 'inactive').length;

    const productsWithPrice = products.filter((p) => p.price != null);
    const avgPrice =
      productsWithPrice.length === 0
        ? 0
        : Math.round(
            productsWithPrice.reduce((sum, p) => sum + (p.price ?? 0), 0) /
              productsWithPrice.length,
          );

    return [
      { label: 'Total Productos', value: String(total) },
      { label: 'Activos', value: String(active) },
      { label: 'Inactivos', value: String(inactive) },
      { label: 'Precio Promedio', value: `Bs. ${avgPrice}` },
    ];
  }, [products]);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MenuMetricCard key={metric.label} label={metric.label} value={metric.value} />
      ))}
    </div>
  );
}
