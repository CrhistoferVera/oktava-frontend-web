export function MenuEmptyState() {
  return (
    <div className="oktava-surface flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center">
      <h3 className="text-xl font-semibold text-white">
        No encontramos productos
      </h3>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        Prueba otro filtro de categoria para ver productos disponibles.
      </p>
    </div>
  );
}
