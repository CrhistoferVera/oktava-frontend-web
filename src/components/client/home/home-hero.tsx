import Link from "next/link";

export function HomeHero() {
  return (
    <section className="oktava-surface relative overflow-hidden rounded-3xl p-6 md:p-10">
      <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-red-600/30 blur-[110px]" />

      <div className="relative max-w-2xl space-y-6">
        <p className="inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-200">
          Oktava Signature
        </p>

        <h1 className="text-4xl leading-none text-white md:text-6xl [font-family:var(--font-display)]">
          Sabor intenso, servicio rapido, experiencia premium.
        </h1>

        <p className="max-w-xl text-sm text-zinc-300 md:text-base">
          El menu de Oktava combina pollo a la lena, guarniciones crispy y
          combos listos para resolver cada comida en minutos.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/menu"
            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            Ver menu
          </Link>
          <Link
            href="/orders"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-white/25"
          >
            Revisar pedidos
          </Link>
        </div>
      </div>
    </section>
  );
}
