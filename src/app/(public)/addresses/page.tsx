import { MapPin } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/5 border border-white/10">
        <MapPin size={36} className="text-zinc-600" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white [font-family:var(--font-display)] uppercase">
          Mis direcciones
        </h1>
        <p className="text-sm text-zinc-500">Esta sección estará disponible próximamente.</p>
      </div>
    </div>
  );
}
