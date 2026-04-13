import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Star } from "lucide-react";

const valuePillars = [
  {
    icon: Zap,
    title: "Entrega rápida",
    description:
      "Flujo optimizado para que el pedido salga en minutos y sin fricción.",
    accent: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Calidad consistente",
    description:
      "Estándares claros en porciones, cocción y empaque para cada orden.",
    accent: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: Star,
    title: "Experiencia premium",
    description:
      "Interfaz limpia y moderna, enfocada en que disfrutes cada pedido.",
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
];

export function HomeValuePillars() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
          Por qué elegirnos
        </p>
        <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)]">
          Oktava en 3 palabras
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {valuePillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.title}
              className="oktava-surface rounded-2xl p-6 flex flex-col gap-4"
            >
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${pillar.bg} border ${pillar.border}`}>
                <Icon size={22} className={pillar.accent} />
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {pillar.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Final CTA banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/8 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="absolute inset-0 oktava-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-red-700/15 blur-[80px] pointer-events-none" />

        <div className="relative flex-1 space-y-2">
          <h3 className="text-3xl md:text-4xl font-black text-white [font-family:var(--font-display)] uppercase">
            ¿Listo para pedir?
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto md:mx-0">
            Explora el menú completo y arma tu pedido perfecto en segundos.
          </p>
        </div>

        <Link
          href="/menu"
          className="relative shrink-0 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-red-900/40 transition-all hover:bg-red-500 hover:scale-105 active:scale-100"
        >
          Ir al menú
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
