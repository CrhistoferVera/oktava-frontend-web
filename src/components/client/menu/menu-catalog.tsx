"use client";

import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { MenuCategoryTabs } from "@/components/client/menu/menu-category-tabs";
import { MenuEmptyState } from "@/components/client/menu/menu-empty-state";
import { CustomerProductCard } from "@/components/client/product/customer-product-card";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import type {
  Product,
  ProductCategory,
  ProductFilterCategory,
} from "@/types/storefront.types";

interface MenuCatalogProps {
  categories: ProductCategory[];
  products: Product[];
}

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(0)}`;
}

export function MenuCatalog({ categories, products }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] =
    useState<ProductFilterCategory>("all");
  const { addToCart, totalAmount, totalItems } = useStorefrontCart();

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }

    return products.filter((product) => product.categoryId === activeCategory);
  }, [activeCategory, products]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl leading-none text-white [font-family:var(--font-display)] md:text-5xl">
          Menu para pedir
        </h1>
        <p className="text-sm text-zinc-400 md:text-base">
          Elige tus favoritos y agregalos al carrito en un solo toque.
        </p>
      </header>

      <div className="oktava-surface flex flex-wrap items-center justify-between gap-4 rounded-2xl px-4 py-3">
        <div className="inline-flex items-center gap-3 text-zinc-100">
          <div className="rounded-full border border-white/10 bg-white/5 p-2">
            <ShoppingBag size={18} />
          </div>
          <p className="text-sm md:text-base">
            Carrito: <span className="font-semibold">{totalItems}</span> items
          </p>
        </div>
        <p className="text-sm font-semibold text-red-200 md:text-base">
          Total mock: {formatCurrency(totalAmount)}
        </p>
      </div>

      <MenuCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {filteredProducts.length === 0 ? (
        <MenuEmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <CustomerProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
