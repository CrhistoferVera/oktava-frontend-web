"use client";

import type {
  ProductCategory,
  ProductFilterCategory,
} from "@/types/storefront.types";

interface MenuCategoryTabsProps {
  categories: ProductCategory[];
  activeCategory: ProductFilterCategory;
  onChange: (category: ProductFilterCategory) => void;
}

export function MenuCategoryTabs({
  categories,
  activeCategory,
  onChange,
}: MenuCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={[
          "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
          activeCategory === "all"
            ? "border-red-500 bg-red-500/20 text-white"
            : "border-white/10 bg-white/5 text-zinc-300 hover:text-white",
        ].join(" ")}
      >
        Todos
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={[
            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            activeCategory === category.id
              ? "border-red-500 bg-red-500/20 text-white"
              : "border-white/10 bg-white/5 text-zinc-300 hover:text-white",
          ].join(" ")}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
