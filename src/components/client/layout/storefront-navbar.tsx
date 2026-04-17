"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { UserMenuDropdown } from "@/components/client/layout/user-menu-dropdown";

const navigationLinks = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Mis pedidos" },
];

function formatNavLinkClass(isActive: boolean) {
  return [
    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "border-red-500 bg-red-500/20 text-white"
      : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-white",
  ].join(" ");
}

export function StorefrontNavbar() {
  const pathname = usePathname();
  const { totalItems, openCart, hydrated } = useStorefrontCart();
  const cartBadge = hydrated && totalItems > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-red-500/60 bg-red-500/20 text-sm font-bold text-red-100">
              O
            </span>

            <div className="leading-tight">
              <p className="text-2xl uppercase tracking-[0.16em] [font-family:var(--font-display)]">
                Oktava
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 transition-colors hover:text-white"
              aria-label="Carrito"
            >
              <ShoppingBag size={18} />
              {cartBadge && (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <UserMenuDropdown />
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {navigationLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={formatNavLinkClass(isActive)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 transition-colors hover:text-white"
            aria-label="Carrito"
          >
            <ShoppingBag size={18} />
            {cartBadge && (
              <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </button>

          <UserMenuDropdown />
        </div>
      </div>
    </header>
  );
}
