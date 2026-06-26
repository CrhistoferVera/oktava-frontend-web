import Image from "next/image";
import Link from "next/link";

const APP_URL = "https://frontend-oktava-frontend-web.b5lsqc.easypanel.host";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Menú", href: "/menu" },
  { label: "Mis pedidos", href: "/orders" },
];

const laOktavaLinks = [
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Horarios", href: "/horarios" },
  { label: "Ubica la Oktava", href: "/ubica-a-oktava" },
];

const legalLinks = [
  { label: "Términos y condiciones", href: "/legal/terminos-y-condiciones" },
  { label: "Política de privacidad", href: "/legal/politica-de-privacidad" },
  { label: "Eliminar cuenta", href: "/legal/eliminar-cuenta" },
];

export function StorefrontFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-black py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/8">

          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/">
              <Image
                src="/oktava_logo.png"
                alt="Oktava"
                width={160}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-zinc-500 max-w-[200px] leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
              El sabor que te obsesiona. Fast food premium.
            </p>
          </div>

          {/* Navegar */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4" style={{ fontFamily: "var(--font-manrope)" }}>
              Navegar
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400" style={{ fontFamily: "var(--font-manrope)" }}>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* La Oktava */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4" style={{ fontFamily: "var(--font-manrope)" }}>
              La Oktava
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400" style={{ fontFamily: "var(--font-manrope)" }}>
              {laOktavaLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4" style={{ fontFamily: "var(--font-manrope)" }}>
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400" style={{ fontFamily: "var(--font-manrope)" }}>
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-600" style={{ fontFamily: "var(--font-manrope)" }}>
          <p>© {year} Oktava. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/terminos-y-condiciones" className="hover:text-zinc-400 transition-colors">
              Términos
            </Link>
            <Link href="/legal/politica-de-privacidad" className="hover:text-zinc-400 transition-colors">
              Privacidad
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
