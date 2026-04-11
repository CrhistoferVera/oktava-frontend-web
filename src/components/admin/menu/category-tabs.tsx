import React from "react";
import { Product, ProductFilterCategory } from "@/types/product.types";

type MenuCategoryTabsProps = {
  products: Product[];
  activeCategory: ProductFilterCategory;
  onCategoryChange: (category: ProductFilterCategory) => void;
};

const categoryLabels: Record<ProductFilterCategory, string> = {
  all: "Todos",
  pollos: "Pollos",
  guarniciones: "Guarniciones",
  bebidas: "Bebidas",
  postres: "Postres",
};

const categoryOrder: ProductFilterCategory[] = [
  "all",
  "pollos",
  "guarniciones",
  "bebidas",
  "postres",
];

export function MenuCategoryTabs({
  products,
  activeCategory,
  onCategoryChange,
}: MenuCategoryTabsProps) {
  const getCategoryCount = (category: ProductFilterCategory) => {
    if (category === "all") {
      return products.length;
    }

    return products.filter((product) => product.category === category).length;
  };

  return (
    <div className="flex flex-wrap gap-4">
      {categoryOrder.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-2xl border px-7 py-4 text-xl font-semibold transition ${
              isActive
                ? "border-red-600 bg-red-600 text-white"
                : "border-zinc-800 bg-zinc-900 text-white hover:border-zinc-700 hover:bg-zinc-800"
            }`}
          >
            {categoryLabels[category]} ({getCategoryCount(category)})
          </button>
        );
      })}
    </div>
  );
}