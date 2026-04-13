"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { CustomerProductCard } from "@/components/client/product/customer-product-card";
import type { Product } from "@/types/storefront.types";

interface HomeFeaturedProductsProps {
  readonly products: Product[];
}

export function HomeFeaturedProducts({ products }: HomeFeaturedProductsProps) {

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Selección del día
          </p>
          <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)] flex items-center gap-3">
            <span>Destacados de hoy</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/20 border border-red-500/30 px-3 py-1 text-sm font-semibold text-red-300 [font-family:var(--font-manrope)]">
              <Flame size={13} />
              Popular
            </span>
          </h2>
        </div>
        <Link
          href="/menu"
          className="hidden md:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Ver menú completo
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <CustomerProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile CTA */}
      <Link
        href="/menu"
        className="md:hidden flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/10 transition-colors"
      >
        Ver menú completo
        <ArrowRight size={14} />
      </Link>

      {/* Promo strip */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-950 to-red-900 border border-red-700/30 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 justify-between">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-red-500/20 blur-[60px] pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-300 mb-1">
            Oferta limitada
          </p>
          <h3 className="text-2xl md:text-3xl font-black text-white [font-family:var(--font-display)] uppercase">
            Combo Fuego — solo Bs. 129
          </h3>
          <p className="text-sm text-red-200/70 mt-1">
            Pollo entero + papas familiares + 2 bebidas. Disponible hoy.
          </p>
        </div>
        <Link
          href="/menu"
          className="relative shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-red-700 shadow-lg transition-all hover:bg-zinc-100 hover:scale-105"
        >
          Pedir ahora
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
