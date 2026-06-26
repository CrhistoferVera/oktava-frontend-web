import type { Metadata } from "next";
import { Clock3 } from "lucide-react";
import { HorariosView } from "@/components/client/horarios/horarios-view";

export const metadata: Metadata = {
  title: "Horarios | Oktava",
  description: "Conoce los horarios de atención de Oktava para hacer tus pedidos.",
};

export default function HorariosPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 py-4">
      {/* Header */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-black/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300">
          <Clock3 size={12} className="text-red-400" />
          Atención
        </span>
        <h1 className="text-[2.5rem] md:text-[3.5rem] leading-[0.95] text-white [font-family:var(--font-display)] uppercase">
          Nuestros<br />
          <span className="text-red-500">Horarios</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-zinc-400">
          Estos son los horarios en los que puedes hacer pedidos. Fuera de horario
          la tienda aparecerá como cerrada.
        </p>
      </div>

      <HorariosView />
    </div>
  );
}
