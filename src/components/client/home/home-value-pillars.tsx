const valuePillars = [
  {
    title: "Entrega rapida",
    description:
      "Flujo optimizado para que el pedido salga en minutos y sin friccion.",
  },
  {
    title: "Calidad consistente",
    description:
      "Estandares claros en porciones, coccion y empaque para cada orden.",
  },
  {
    title: "Experiencia premium",
    description:
      "Interfaz limpia y moderna enfocada en conversion y recompra recurrente.",
  },
];

export function HomeValuePillars() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl text-white [font-family:var(--font-display)] md:text-4xl">
        Por que pedir en Oktava
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {valuePillars.map((pillar) => (
          <article key={pillar.title} className="oktava-surface rounded-2xl p-5">
            <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {pillar.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
