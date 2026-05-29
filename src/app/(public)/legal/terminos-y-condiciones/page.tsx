import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y condiciones | Oktava",
  description:
    "Términos y condiciones de uso del servicio de pedidos Oktava.",
};

const sections = [
  {
    title: "1. Introducción",
    body: `Bienvenido a Oktava. Al acceder y utilizar este sitio web o nuestra plataforma de pedidos, aceptas cumplir y estar sujeto a los siguientes términos y condiciones. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices el servicio.

Estos términos se aplican a todos los usuarios del sitio, incluyendo visitantes, clientes registrados y cualquier persona que realice un pedido a través de nuestra plataforma.`,
  },
  {
    title: "2. Uso del sitio",
    body: `El uso de este sitio está permitido exclusivamente para fines lícitos y personales. Queda prohibido:

• Usar el sitio de manera que cause daño, interrupciones o sobrecarga en nuestros servidores.
• Intentar acceder sin autorización a áreas restringidas del sistema.
• Utilizar el sitio para actividades ilegales, fraudulentas o que violen derechos de terceros.
• Publicar o transmitir contenido ofensivo, engañoso o difamatorio.

Oktava se reserva el derecho de restringir el acceso a usuarios que incumplan estas condiciones.`,
  },
  {
    title: "3. Registro y cuenta de usuario",
    body: `Para realizar pedidos a través de la plataforma es necesario crear una cuenta. Al registrarte, te comprometes a:

• Proporcionar información veraz, completa y actualizada.
• Mantener la confidencialidad de tus credenciales de acceso.
• Notificarnos de inmediato si sospechas de un acceso no autorizado a tu cuenta.

Eres responsable de todas las actividades realizadas desde tu cuenta. Oktava no se hace responsable por pérdidas derivadas del uso no autorizado de tus credenciales por tu negligencia.`,
  },
  {
    title: "4. Pedidos",
    body: `Al realizar un pedido a través de Oktava:

• Confirmas que la información de entrega proporcionada es correcta y actualizada.
• Entiendes que el pedido queda sujeto a disponibilidad de productos y capacidad operativa del local.
• Recibirás una confirmación de pedido vía la plataforma. Esta confirmación no garantiza la entrega inmediata, sino que indica que tu pedido fue recibido y está siendo procesado.

Oktava se reserva el derecho de rechazar o cancelar un pedido en caso de errores de precio, indisponibilidad de producto o sospecha de fraude.`,
  },
  {
    title: "5. Precios y disponibilidad",
    body: `Los precios mostrados en la plataforma están expresados en la moneda local vigente e incluyen los impuestos aplicables, salvo indicación contraria. Oktava se reserva el derecho de modificar los precios en cualquier momento sin previo aviso.

La disponibilidad de productos puede variar según el horario, demanda y stock. En caso de que un producto no esté disponible después de confirmado tu pedido, nos comunicaremos contigo para ofrecerte una alternativa o procesar el reembolso correspondiente.`,
  },
  {
    title: "6. Pagos",
    body: `Los pagos se procesan a través de medios habilitados en la plataforma. Al realizar un pago:

• Confirmas que estás autorizado a utilizar el método de pago seleccionado.
• Aceptas los cargos correspondientes al monto total del pedido, incluyendo costos de entrega si aplican.

Los datos sensibles de tarjeta de crédito o débito son procesados directamente por nuestra pasarela de pago externa y no son almacenados por Oktava. Ante cualquier inconveniente con un cobro, contáctanos a través de los medios disponibles en la plataforma.`,
  },
  {
    title: "7. Delivery y pickup",
    body: `Oktava ofrece dos modalidades de entrega:

Delivery: El pedido es enviado a la dirección que proporciones. Los tiempos estimados son referenciales y pueden variar según condiciones externas (tráfico, clima, demanda). Nos comprometemos a informarte si existe un retraso significativo.

Pickup (recojo en tienda): Puedes recoger tu pedido directamente en nuestro local. Te notificaremos cuando tu pedido esté listo.

Oktava no se hace responsable por demoras causadas por información de dirección incorrecta proporcionada por el usuario.`,
  },
  {
    title: "8. Cancelaciones",
    body: `Las cancelaciones están sujetas al estado del pedido:

• Si el pedido aún no ha sido confirmado o procesado, puedes solicitar la cancelación y se gestionará el reembolso correspondiente.
• Una vez que el pedido está en preparación, la cancelación puede no ser posible.
• En casos donde la cancelación sea imputable a Oktava (error de producto, indisponibilidad), se procesará el reembolso completo.

Para solicitar una cancelación, contáctanos a través de la plataforma lo antes posible.`,
  },
  {
    title: "9. Responsabilidad del usuario",
    body: `El usuario es responsable de:

• Asegurar que la información de su pedido (dirección, contacto, instrucciones) sea correcta.
• Estar disponible para recibir el pedido en el domicilio indicado o acudir al local en el tiempo estimado si eligió pickup.
• No realizar pedidos con información fraudulenta o con intención de perjudicar a Oktava o a terceros.

Oktava no se responsabiliza por pedidos no entregados debido a información incorrecta o ausencia del receptor.`,
  },
  {
    title: "10. Cambios en los términos",
    body: `Oktava se reserva el derecho de actualizar o modificar estos términos y condiciones en cualquier momento. Los cambios serán publicados en esta página con indicación de la fecha de actualización.

El uso continuado del servicio tras la publicación de cambios constituye la aceptación de los nuevos términos. Te recomendamos revisar esta página periódicamente.`,
  },
  {
    title: "11. Contacto",
    body: `Si tienes preguntas, consultas o reclamos relacionados con estos términos, puedes contactarnos a través de los medios disponibles en la plataforma.

Haremos nuestro mejor esfuerzo para responder a la brevedad posible.`,
  },
];

export default function TerminosPage() {
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
          Términos y condiciones
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
          href="/legal/politica-de-privacidad"
          className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Política de privacidad
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
