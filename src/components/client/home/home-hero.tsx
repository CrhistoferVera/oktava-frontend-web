import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { HeroStatusBadge } from "./hero-status-badge";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl min-h-[500px] md:min-h-[540px] flex items-center">
      {/* Hero background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-bg.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
      />

      {/* Overlays — mismo stack que la landing */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 oktava-grid-bg opacity-40 pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-red-600/[0.07] blur-[140px] pointer-events-none" />
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-red-700/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-red-600/5 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative px-6 py-12 md:px-12 md:py-16 w-full max-w-2xl space-y-6">
        {/* Open/closed badge — dinámico según el horario del local */}
        <HeroStatusBadge />

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

    </section>
  );
}
