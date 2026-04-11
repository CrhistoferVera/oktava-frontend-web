import React, { useMemo } from "react";
import { MenuMetricCard } from "@/components/admin/menu/metric-card";
import { Product } from "@/types/product.types";

type MenuMetricsProps = {
  products: Product[];
};

export function MenuMetrics({ products }: MenuMetricsProps) {
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(
      (product) => product.status === "active"
    ).length;
    const inactiveProducts = products.filter(
      (product) => product.status === "inactive"
    ).length;

    const averageMargin =
      totalProducts === 0
        ? 0
        : Math.round(
            products.reduce((sum, product) => sum + product.margin, 0) /
              totalProducts
          );

    return [
      { label: "Total Productos", value: String(totalProducts) },
      { label: "Activos", value: String(activeProducts) },
      { label: "Inactivos", value: String(inactiveProducts) },
      { label: "Margen Promedio", value: `${averageMargin}%` },
    ];
  }, [products]);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MenuMetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
        />
      ))}
    </div>
  );
}