import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, MapPin, Navigation, Truck, ShoppingBag } from "lucide-react";
import { CopyLinkButton } from "@/components/client/ubica/copy-link-button";

export const metadata: Metadata = {
  title: "Ubica a Oktava | Oktava",
  description: "Encuentra la ubicación de Oktava y abre la ruta en Google Maps.",
};

const MAPS_LINK = "https://maps.app.goo.gl/F7C2gFg2tNZeBKQY6";

const tips = [
  {
    icon: Navigation,
    title: "Indicaciones precisas",
    desc: "Abre Google Maps para obtener la ruta más rápida desde tu ubicación actual.",
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Truck,
    title: "Delivery y recojo",
    desc: "Puedes recoger tu pedido en el local o pedir delivery a tu dirección.",
    accent: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: ShoppingBag,
    title: "Pedido online",
    desc: "Arma tu pedido desde el menú digital antes de llegar para ahorrar tiempo.",
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
];

export default function UbicaAOktavaPage() {
  return (
    <div className="space-y-14 md:space-y-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl min-h-[360px] md:min-h-[420px] flex items-center border border-white/8">
        <div className="absolute inset-0 oktava-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-red-700/20 blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]/50" />

        <div className="relative px-6 py-14 md:px-12 md:py-16 w-full max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-black/50 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300">
            <MapPin size={12} className="text-red-400" />
            Nuestra ubicación
          </span>

          <h1 className="text-[3rem] md:text-[5rem] leading-[0.9] text-white [font-family:var(--font-display)] uppercase">
            Ubica a<br />
            <span className="text-red-500">Oktava</span>
          </h1>

          <p className="text-zinc-300 text-sm md:text-base max-w-md leading-relaxed">
            Encuéntranos fácilmente y visítanos en nuestra ubicación.
            Abre Google Maps para obtener indicaciones desde donde estés.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-red-500 hover:scale-105 active:scale-100"
            >
              Abrir en Google Maps <ExternalLink size={14} />
            </a>
            <CopyLinkButton />
          </div>
        </div>
      </section>

      {/* ── Mapa + Info ── */}
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Mapa embed */}
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900 min-h-[320px] lg:min-h-[420px]">
          <iframe
            title="Ubicación de Oktava en Google Maps"
            src={`https://maps.google.com/maps?q=-17.392267,-66.069302&z=15&output=embed&hl=es`}
            width="100%"
            height="100%"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Info card */}
        <div className="flex flex-col gap-4">
          {/* Nombre del local */}
          <div className="oktava-surface rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                <MapPin size={22} className="text-red-400" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-0.5">
                  Local
                </p>
                <h2 className="text-xl font-bold text-white [font-family:var(--font-display)] uppercase tracking-wide">
                  Oktava
                </h2>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Visítanos y disfruta de la experiencia Oktava en nuestro local.
              Puedes abrir la ubicación en Google Maps para obtener indicaciones
              precisas desde donde te encuentres.
            </p>

            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white group"
            >
              <span className="truncate text-xs text-zinc-500">
                Haz clic para abrir en Google Maps
              </span>
              <ExternalLink size={14} className="shrink-0 text-red-400 group-hover:text-red-300 transition-colors" />
            </a>
          </div>

          {/* Cómo llegar */}
          <div className="oktava-surface rounded-2xl p-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
              Cómo llegar
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Puedes abrir la ubicación directamente en Google Maps para obtener
              indicaciones de cómo llegar desde cualquier punto.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ideal para visitas presenciales, de referencia para delivery o
              para coordinar recogida en el local.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tips / Visita ── */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Tu visita
          </p>
          <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)]">
            Todo lo que necesitas saber
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <article
                key={tip.title}
                className="oktava-surface rounded-2xl p-6 flex flex-col gap-4"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${tip.bg} border ${tip.border}`}
                >
                  <Icon size={22} className={tip.accent} />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">{tip.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{tip.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/8 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="absolute inset-0 oktava-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-red-700/15 blur-[90px] pointer-events-none" />

        <div className="relative flex-1 space-y-2">
          <h3 className="text-4xl md:text-5xl font-black text-white [font-family:var(--font-display)] uppercase">
            Nos vemos<br className="hidden md:block" /> en Oktava
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto md:mx-0">
            Ven a visitarnos o arma tu pedido online desde el menú digital.
          </p>
        </div>

        <div className="relative flex flex-wrap justify-center md:flex-col gap-3 shrink-0">
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-900/40 transition-all hover:bg-red-500 hover:scale-105 active:scale-100"
          >
            Abrir ubicación <ExternalLink size={14} />
          </a>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-100 transition-all hover:border-white/30 hover:bg-white/10"
          >
            Ver menú <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
