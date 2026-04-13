"use client";

import { useMemo, useState } from "react";
import { MenuCategoryTabs } from "@/components/client/menu/menu-category-tabs";
import { MenuEmptyState } from "@/components/client/menu/menu-empty-state";
import { CustomerProductCard } from "@/components/client/product/customer-product-card";
import type {
  Product,
  ProductCategory,
  ProductFilterCategory,
} from "@/types/storefront.types";

interface MenuCatalogProps {
  readonly categories: ProductCategory[];
  readonly products: Product[];
}

export function MenuCatalog({ categories, products }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] =
    useState<ProductFilterCategory>("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.categoryId === activeCategory);
  }, [activeCategory, products]);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
          Carta completa
        </p>
        <h1 className="text-4xl leading-none text-white [font-family:var(--font-display)] md:text-5xl">
          ¿Qué vas a pedir?
        </h1>
        <p className="text-sm text-zinc-400 md:text-base">
          Elige tus favoritos y agrégalos al carrito en un solo toque.
        </p>
      </header>

      <MenuCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {filteredProducts.length === 0 ? (
        <MenuEmptyState />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <CustomerProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
