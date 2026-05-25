import Link from "next/link";
import type { ProductCategory } from "@/types/storefront.types";

interface HomeCategoryStripProps {
  readonly categories: ProductCategory[];
}

export function HomeCategoryStrip({ categories }: HomeCategoryStripProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Explora
          </p>
          <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)]">
            ¿Qué te antojas hoy?
          </h2>
        </div>
        <Link
          href="/menu"
          className="hidden md:inline-block text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Ver todo el menú →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            href="/menu"
            className="group snap-start shrink-0 w-44 md:w-52 h-36 rounded-2xl overflow-hidden relative transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
          >
            {/* Background image */}
            {category.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.imageUrl}
                alt={category.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-800" />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            {/* Label */}
            <p className="absolute bottom-0 left-0 right-0 px-4 pb-4 font-bold text-white text-base leading-tight drop-shadow-md">
              {category.label}
            </p>
          </Link>
        ))}
      </div>

      <Link
        href="/menu"
        className="md:hidden block text-center text-sm text-zinc-400 hover:text-white transition-colors pt-1"
      >
        Ver todo el menú →
      </Link>
    </section>
  );
}
