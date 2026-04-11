import Link from "next/link";
import type { ProductCategory } from "@/types/storefront.types";

interface HomeCategoryStripProps {
  categories: ProductCategory[];
}

export function HomeCategoryStrip({ categories }: HomeCategoryStripProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl text-white [font-family:var(--font-display)] md:text-4xl">
          Categorias principales
        </h2>
        <Link href="/menu" className="text-sm text-red-300 hover:text-red-200">
          Ver todo el menu
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href="/menu"
            className="oktava-surface rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
          >
            <p className="text-lg font-semibold text-white">{category.label}</p>
            <p className="mt-2 text-sm text-zinc-400">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
