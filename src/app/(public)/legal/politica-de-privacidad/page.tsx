import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de privacidad | Oktava",
  description:
    "Conoce cómo Oktava recopila, usa y protege tu información personal.",
};

const sections = [
  {
    title: "1. Introducción",
    body: `En Oktava nos comprometemos a proteger tu privacidad. Esta Política de Privacidad describe qué información recopilamos, cómo la usamos y qué derechos tienes sobre ella.

Al utilizar nuestra plataforma, aceptas las prácticas descritas en este documento. Si no estás de acuerdo, te pedimos que no utilices el servicio.`,
  },
  {
    title: "2. Datos que recopilamos",
    body: `Recopilamos información de las siguientes fuentes:

Información que nos proporcionas directamente:
• Nombre y apellido.
• Número de teléfono.
• Correo electrónico.
• Dirección de entrega.

Información generada por el uso del servicio:
• Historial de pedidos.
• Preferencias de entrega (delivery o pickup).
• Interacciones con la plataforma.

Información técnica:
• Dirección IP y tipo de dispositivo.
• Navegador y sistema operativo.
• Páginas visitadas y tiempo de navegación (datos agregados y anonimizados).`,
  },
  {
    title: "3. Uso de los datos",
    body: `Utilizamos tu información para:

• Procesar y gestionar tus pedidos.
• Enviarte confirmaciones y actualizaciones sobre el estado de tu pedido.
• Mejorar nuestro servicio y la experiencia en la plataforma.
• Comunicarnos contigo ante cualquier consulta, reclamo o incidencia relacionada con tu pedido.
• Cumplir con obligaciones legales y regulatorias cuando corresponda.

No utilizamos tu información para publicidad de terceros sin tu consentimiento explícito.`,
  },
  {
    title: "4. Datos de pedidos",
    body: `Almacenamos el historial de tus pedidos para:

• Permitirte hacer seguimiento de órdenes activas y anteriores.
• Facilitar nuevos pedidos con datos que ya has utilizado.
• Atender reclamos o consultas sobre pedidos específicos.

El historial de pedidos se conserva mientras tu cuenta esté activa y por el período mínimo requerido por la normativa aplicable.`,
  },
  {
    title: "5. Datos de dirección",
    body: `Las direcciones de entrega que registras en la plataforma se almacenan para facilitar futuros pedidos. Puedes gestionar, editar o eliminar tus direcciones guardadas desde tu perfil en cualquier momento.

No compartimos tus datos de dirección con terceros ajenos al proceso de entrega de tu pedido.`,
  },
  {
    title: "6. Datos de contacto",
    body: `Tu número de teléfono y correo electrónico se utilizan únicamente para:

• Enviarte confirmaciones y notificaciones relacionadas con tus pedidos.
• Contactarte en caso de inconvenientes con una entrega.
• Responder a tus consultas o solicitudes de soporte.

No realizamos envíos de marketing sin tu consentimiento previo. Puedes solicitar la eliminación de tus datos de contacto en cualquier momento.`,
  },
  {
    title: "7. Pagos y seguridad",
    body: `Los datos sensibles asociados a tu método de pago (número de tarjeta, CVV, fecha de vencimiento) son procesados directamente por una pasarela de pago externa certificada. Oktava no almacena ni tiene acceso a esta información.

Solo recibimos una confirmación del resultado de la transacción (aprobada o rechazada) para poder gestionar tu pedido correctamente. Te recomendamos revisar las políticas de privacidad del proveedor de pago correspondiente para mayor información.`,
  },
  {
    title: "8. Cookies y tecnologías similares",
    body: `Utilizamos cookies y tecnologías de almacenamiento local para:

• Mantener tu sesión activa mientras navegas la plataforma.
• Recordar tus preferencias de usuario.
• Medir el uso de la plataforma de forma agregada y anónima para mejorar el servicio.

Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funciones de la plataforma. No utilizamos cookies de rastreo de terceros con fines publicitarios sin tu consentimiento.`,
  },
  {
    title: "9. Conservación de la información",
    body: `Conservamos tu información personal mientras tu cuenta esté activa. Si decides eliminar tu cuenta, procederemos a eliminar o anonimizar tus datos personales, salvo aquellos que debamos conservar por obligación legal.

Los datos relacionados con transacciones pueden conservarse por el período mínimo exigido por la normativa tributaria o comercial aplicable.`,
  },
  {
    title: "10. Derechos del usuario",
    body: `Tienes derecho a:

• Acceder a los datos personales que Oktava tiene sobre ti.
• Solicitar la corrección de datos incorrectos o incompletos.
• Solicitar la eliminación de tus datos personales, sujeto a obligaciones legales.
• Revocar tu consentimiento para el uso de tus datos cuando corresponda.
• Solicitar la portabilidad de tus datos en un formato legible.

Para ejercer cualquiera de estos derechos, contáctanos a través de los medios disponibles en la plataforma.`,
  },
  {
    title: "11. Contacto",
    body: `Si tienes preguntas, preocupaciones o deseas ejercer tus derechos sobre tus datos personales, puedes contactarnos a través de los medios disponibles en la plataforma.

Haremos nuestro mejor esfuerzo para responder en un plazo razonable.`,
  },
  {
    title: "12. Cambios en esta política",
    body: `Oktava se reserva el derecho de actualizar esta Política de Privacidad en cualquier momento. Los cambios serán publicados en esta página con indicación de la fecha de actualización.

Te recomendamos revisar esta página periódicamente. El uso continuado del servicio tras la publicación de cambios implica la aceptación de la nueva política.`,
  },
];

export default function PoliticaPrivacidadPage() {
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
          Política de privacidad
        </h1>
        <p className="text-sm text-zinc-500">
          Última actualización: Mayo 2025
        </p>
      </div>

      {/* ── Disclaimer ── */}
      <div className="flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-300/80 leading-relaxed">
          Este documento es un texto base editable con fines informativos. Debe
          ser revisado y validado por el equipo de Oktava y, de ser necesario,
          por asesoría legal antes de su publicación en producción.
        </p>
      </div>

      {/* ── Sections ── */}
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="oktava-surface rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-bold text-white">{section.title}</h2>
            <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
              {section.body}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer nav ── */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/8">
        <Link
          href="/legal/terminos-y-condiciones"
          className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Términos y condiciones
        </Link>
        <Link
          href="/sobre-nosotros"
          className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Sobre nosotros
        </Link>
      </div>
    </div>
  );
}
