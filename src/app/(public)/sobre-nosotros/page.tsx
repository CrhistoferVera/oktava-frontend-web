import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  UtensilsCrossed,
  Flame,
  Heart,
  Zap,
  Star,
  Sparkles,
  ShoppingBag,
  MapPin,
  Clock3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre nosotros | Oktava",
  description: "Conoce la historia, misión y experiencia de Oktava.",
};

const values = [
  {
    icon: Flame,
    label: "Sabor auténtico",
    description:
      "Cada plato mantiene la esencia de la cocina peruana, con ingredientes frescos y recetas que respetan la tradición.",
    accent: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: Heart,
    label: "Atención cercana",
    description:
      "Tratamos a cada cliente con calidez y disposición, porque detrás de cada pedido hay una persona real.",
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: Zap,
    label: "Rapidez",
    description:
      "Flujo de pedido optimizado para que recibas tu comida en el menor tiempo posible, sin sacrificar calidad.",
    accent: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: Star,
    label: "Calidad",
    description:
      "Estándares claros en porciones, cocción y presentación para que cada pedido sea exactamente lo que esperas.",
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Sparkles,
    label: "Innovación",
    description:
      "Pedidos digitales, seguimiento en tiempo real y una experiencia moderna que hace todo más simple.",
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
];

const experience = [
  {
    icon: ShoppingBag,
    title: "Pedido online",
    desc: "Arma tu pedido desde el menú digital, personaliza tus opciones y confirma en segundos.",
  },
  {
    icon: MapPin,
    title: "Delivery y pickup",
    desc: "Entrega a domicilio o recojo en tienda. Tú eliges cómo y cuándo recibirlo.",
  },
  {
    icon: Clock3,
    title: "Atención local",
    desc: "Un equipo real, disponible para ayudarte con tu pedido o resolver cualquier consulta.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <div className="space-y-14 md:space-y-20">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl min-h-[400px] md:min-h-[440px] flex items-center border border-white/8">
        <div className="absolute inset-0 oktava-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-red-700/20 blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]/50" />

        <div className="relative px-6 py-14 md:px-12 md:py-16 w-full max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-black/50 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            Restaurante peruano · Experiencia digital
          </span>

          <h1 className="text-[3.5rem] md:text-[5.5rem] leading-[0.9] text-white [font-family:var(--font-display)] uppercase">
            Sobre
            <br />
            <span className="text-red-500">Oktava</span>
          </h1>

          <p className="text-zinc-300 text-sm md:text-base max-w-md leading-relaxed">
            Sabor peruano auténtico, atención ágil y una experiencia de pedido
            100% digital. Así es Oktava.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-red-500 hover:scale-105 active:scale-100"
            >
              Ver menú <ArrowRight size={15} />
            </Link>
            <Link
              href="/ubica-a-oktava"
              className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-zinc-100 transition-all hover:border-white/30 hover:bg-white/10"
            >
              Ubícanos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Historia ── */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Nuestra historia
          </p>
          <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)]">
            Cómo nació Oktava
          </h2>
        </div>

        <div className="oktava-surface rounded-2xl p-6 md:p-8">
          <div className="flex gap-5 items-start">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
              <UtensilsCrossed size={22} className="text-red-400" />
            </span>
            <div className="space-y-3 text-zinc-400 text-sm md:text-base leading-relaxed">
              <p>
                Oktava nació con una idea simple: llevar el sabor auténtico de
                la cocina peruana a más personas, sin complicaciones. Desde el
                primer día quisimos que pedir tu plato favorito fuera tan fácil
                como abrirlo en tu teléfono.
              </p>
              <p>
                Combinamos recetas tradicionales con una operación moderna:
                pedidos digitales, tiempos claros y atención directa. No hay
                secretos, solo buena comida y un equipo comprometido con hacer
                que cada experiencia valga la pena.
              </p>
              <p>
                Hoy, Oktava sigue creciendo con la misma energía del primer día:
                el sabor que te obsesiona y la facilidad que te hace volver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Misión + Visión ── */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Quiénes somos
          </p>
          <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)]">
            Misión y visión
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="oktava-surface rounded-2xl p-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Misión
            </span>
            <h3 className="text-xl font-bold text-white">
              Lo que hacemos cada día
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ofrecer comida peruana de calidad, con atención ágil y una
              experiencia digital simple que haga que pedir sea lo más fácil del
              día.
            </p>
          </div>

          <div className="oktava-surface rounded-2xl p-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Visión
            </span>
            <h3 className="text-xl font-bold text-white">A dónde vamos</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ser una marca reconocida por sabor, confianza y facilidad para
              pedir: el referente de comida peruana digital en nuestra ciudad.
            </p>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Lo que nos mueve
          </p>
          <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)]">
            Nuestros valores
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <article
                key={v.label}
                className="oktava-surface rounded-2xl p-6 flex flex-col gap-4"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${v.bg} border ${v.border}`}
                >
                  <Icon size={22} className={v.accent} />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">{v.label}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {v.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Experiencia ── */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Cómo funciona
          </p>
          <h2 className="text-3xl md:text-4xl text-white [font-family:var(--font-display)]">
            La experiencia Oktava
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {experience.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="oktava-surface rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                    <Icon size={18} className="text-red-400" />
                  </span>
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
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
            ¿Listo para
            <br className="hidden md:block" /> probar Oktava?
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto md:mx-0">
            Arma tu pedido, elige cómo recibirlo y disfruta del sabor peruano
            en minutos.
          </p>
        </div>

        <div className="relative flex flex-wrap justify-center md:flex-col gap-3 shrink-0">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-900/40 transition-all hover:bg-red-500 hover:scale-105 active:scale-100"
          >
            Ir al menú <ArrowRight size={15} />
          </Link>
          <Link
            href="/ubica-a-oktava"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-100 transition-all hover:border-white/30 hover:bg-white/10"
          >
            Ubícanos
          </Link>
        </div>
      </section>
    </div>
  );
}
