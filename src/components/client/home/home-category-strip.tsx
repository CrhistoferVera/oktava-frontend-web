import Link from "next/link";
import type { ProductCategory } from "@/types/storefront.types";

interface HomeCategoryStripProps {
  readonly categories: ProductCategory[];
}

const SLUG_STYLE: Record<string, { emoji: string; from: string; border: string; glow: string }> = {
  combos: {
    emoji: "🍗",
    from: "from-red-900/70 to-red-950/80",
    border: "border-red-600/30",
    glow: "group-hover:shadow-red-900/50",
  },
  pollos: {
    emoji: "🔥",
    from: "from-orange-900/70 to-orange-950/80",
    border: "border-orange-600/30",
    glow: "group-hover:shadow-orange-900/50",
  },
  guarniciones: {
    emoji: "🍟",
    from: "from-yellow-900/70 to-yellow-950/80",
    border: "border-yellow-600/30",
    glow: "group-hover:shadow-yellow-900/50",
  },
  bebidas: {
    emoji: "🥤",
    from: "from-sky-900/70 to-sky-950/80",
    border: "border-sky-600/30",
    glow: "group-hover:shadow-sky-900/50",
  },
  postres: {
    emoji: "🍩",
    from: "from-pink-900/70 to-pink-950/80",
    border: "border-pink-600/30",
    glow: "group-hover:shadow-pink-900/50",
  },
};

const fallbackStyle = {
  emoji: "🍴",
  from: "from-zinc-800/80 to-zinc-900/80",
  border: "border-zinc-600/30",
  glow: "group-hover:shadow-zinc-800/50",
};

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
        {categories.map((category) => {
          const style = SLUG_STYLE[category.slug] ?? fallbackStyle;
          return (
            <Link
              key={category.id}
              href="/menu"
              className={`group snap-start shrink-0 w-44 md:w-52 rounded-2xl border bg-linear-to-br ${style.from} ${style.border} p-5 transition-all hover:-translate-y-1 hover:shadow-xl ${style.glow}`}
            >
              <span className="block text-4xl mb-3 transition-transform group-hover:scale-110">
                {style.emoji}
              </span>
              <p className="font-bold text-white text-base leading-tight">
                {category.label}
              </p>
            </Link>
          );
        })}
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
