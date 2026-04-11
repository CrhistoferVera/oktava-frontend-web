import Link from "next/link";

export function OrdersEmptyState() {
  return (
    <div className="oktava-surface flex min-h-[320px] flex-col items-center justify-center rounded-3xl px-6 py-10 text-center">
      <p className="text-sm uppercase tracking-[0.14em] text-red-300">
        Estado inicial
      </p>
      <h2 className="mt-2 text-3xl text-white [font-family:var(--font-display)] md:text-4xl">
        Todavia no tienes pedidos
      </h2>
      <p className="mt-3 max-w-md text-sm text-zinc-400 md:text-base">
        Cuando hagas tu primer pedido, aqui veras su estado, total y hora de
        creacion.
      </p>

      <Link
        href="/menu"
        className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
      >
        Ir al menu
      </Link>
    </div>
  );
}
