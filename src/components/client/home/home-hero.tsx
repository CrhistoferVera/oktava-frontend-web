import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl min-h-[500px] md:min-h-[540px] flex items-center">
      {/* Food background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1600&auto=format&fit=crop"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Gradient overlay: opaque on left, transparent on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Red glow accent */}
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-red-700/25 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative px-6 py-12 md:px-12 md:py-16 w-full max-w-2xl space-y-6">
        {/* Open badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-black/50 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          Pedidos en línea · Abierto ahora
        </span>

        {/* Main headline */}
        <h1 className="text-[4rem] md:text-[6rem] leading-[0.9] text-white [font-family:var(--font-display)] uppercase drop-shadow-lg">
          El Sabor<br />
          <span className="text-red-500">Que Te</span><br />
          Obsesiona
        </h1>

        <p className="text-zinc-300 text-sm md:text-base max-w-xs leading-relaxed">
          Pollo a la leña, combos crispy y guarniciones irresistibles.
          Listos en minutos, entregados a tu puerta.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-red-500 hover:scale-105 active:scale-100"
          >
            Pedir ahora
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/menu"
            className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-sm font-semibold text-zinc-100 transition-all hover:border-white/30 hover:bg-white/10"
          >
            Ver menú
          </Link>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
          <span className="flex items-center gap-1.5">
            <Clock3 size={13} className="text-zinc-500" />
            15–25 min promedio
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-zinc-500" />
            Delivery y recojo en tienda
          </span>
        </div>
      </div>

      {/* Price callout badge — bottom right */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center justify-center h-28 w-28 rounded-full bg-red-600 border-4 border-red-400/30 shadow-2xl shadow-red-900/60 rotate-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-100">desde</p>
        <p className="text-3xl font-black text-white leading-none [font-family:var(--font-display)]">Bs. 36</p>
      </div>
    </section>
  );
}
