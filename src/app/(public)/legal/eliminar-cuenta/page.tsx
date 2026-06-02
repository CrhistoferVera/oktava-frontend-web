import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Eliminar cuenta | Oktava",
  description:
    "Aprende cómo solicitar la eliminación de tu cuenta y tus datos personales en Oktava.",
};

const steps = [
  {
    step: "1",
    title: "Ingresá a tu cuenta",
    body: "Iniciá sesión en la app de Oktava con tu correo y contraseña habituales.",
  },
  {
    step: "2",
    title: "Accedé a tu perfil",
    body: "Desde el menú principal, tocá tu nombre o foto de perfil para ingresar a la sección de configuración de cuenta.",
  },
  {
    step: "3",
    title: "Seleccioná «Eliminar cuenta»",
    body: "Dentro de la configuración, encontrarás la opción «Eliminar cuenta» al final de la página. Tocá esa opción para iniciar el proceso.",
  },
  {
    step: "4",
    title: "Confirmá la eliminación",
    body: "Se te pedirá que confirmes que querés eliminar tu cuenta. Leé el aviso con atención antes de confirmar.",
  },
];

const deletedData = [
  "Tu nombre, correo electrónico y número de teléfono.",
  "Tus direcciones de entrega guardadas.",
  "Tu historial de pedidos y preferencias.",
  "Tu foto de perfil y datos de sesión.",
];

const retainedData = [
  "Información contable o fiscal relacionada con transacciones procesadas, por el período mínimo exigido por la normativa vigente.",
  "Datos necesarios para resolver reclamos o disputas en curso.",
];

export default function EliminarCuentaPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* ── Back link ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft size={13} />
        Volver al inicio
      </Link>

      {/* ── Header ── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl text-white [font-family:var(--font-display)] uppercase">
          Eliminar cuenta
        </h1>
        <p className="text-sm text-zinc-500">Última actualización: Junio 2025</p>
      </div>

      {/* ── Intro ── */}
      <div className="oktava-surface rounded-2xl p-6 space-y-3">
        <p className="text-sm text-zinc-400 leading-relaxed">
          En Oktava respetamos tu derecho a controlar tu información personal.
          Si decidís eliminar tu cuenta, podés hacerlo directamente desde la
          aplicación siguiendo los pasos que se describen a continuación, o
          contactándonos por los medios disponibles en la plataforma.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          La eliminación de tu cuenta es <span className="text-white font-medium">permanente e irreversible</span>.
          Una vez confirmada, no podremos recuperar tu información ni el acceso
          a tu historial de pedidos.
        </p>
      </div>

      {/* ── Warning ── */}
      <div className="flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-300/80 leading-relaxed">
          Si tenés pedidos activos al momento de solicitar la eliminación, te
          recomendamos esperar a que estén completados antes de proceder.
        </p>
      </div>

      {/* ── Steps ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">
          Cómo eliminar tu cuenta desde la app
        </h2>
        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="oktava-surface rounded-2xl p-5 flex gap-4"
            >
              <span className="shrink-0 w-8 h-8 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-400">
                {s.step}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">{s.title}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── What gets deleted ── */}
      <div className="oktava-surface rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-red-400" />
          <h2 className="text-base font-bold text-white">
            Qué información se elimina
          </h2>
        </div>
        <ul className="space-y-2">
          {deletedData.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-zinc-400">
              <span className="text-red-400 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── What gets retained ── */}
      <div className="oktava-surface rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white">
          Qué información podemos conservar
        </h2>
        <p className="text-sm text-zinc-500">
          Por obligaciones legales, es posible que conservemos de forma limitada:
        </p>
        <ul className="space-y-2">
          {retainedData.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-zinc-400">
              <span className="text-zinc-500 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Alternative contact ── */}
      <div className="oktava-surface rounded-2xl p-6 space-y-3">
        <h2 className="text-base font-bold text-white">
          ¿No podés acceder a la app?
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Si no tenés acceso a tu cuenta o necesitás ayuda para completar el
          proceso, podés solicitar la eliminación contactándonos directamente a
          través de los medios de soporte disponibles en la plataforma. Respondemos
          a las solicitudes dentro de un plazo razonable.
        </p>
      </div>

      {/* ── Footer nav ── */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/8">
        <Link
          href="/legal/politica-de-privacidad"
          className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Política de privacidad
        </Link>
        <Link
          href="/legal/terminos-y-condiciones"
          className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Términos y condiciones
        </Link>
      </div>
    </div>
  );
}
