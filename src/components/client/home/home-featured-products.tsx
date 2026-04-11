"use client";

import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { CustomerProductCard } from "@/components/client/product/customer-product-card";
import type { Product } from "@/types/storefront.types";

interface HomeFeaturedProductsProps {
  products: Product[];
}

export function HomeFeaturedProducts({ products }: HomeFeaturedProductsProps) {
  const { addToCart } = useStorefrontCart();

  return (
    <section className="space-y-4">
      <h2 className="text-3xl text-white [font-family:var(--font-display)] md:text-4xl">
        Destacados de hoy
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <CustomerProductCard
            key={product.id}
            product={product}
            onAdd={addToCart}
          />
        ))}
      </div>
    </section>
  );
}
