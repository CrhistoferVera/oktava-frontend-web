"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Package, Menu } from "lucide-react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { useActiveOrders } from "@/context/ActiveOrdersContext";
import { useAuth } from "@/context/AuthContext";
import { UserMenuDropdown } from "@/components/client/layout/user-menu-dropdown";
import { DrawerMenu } from "@/components/ui/DrawerMenu";
import { AuthRequiredModal } from "@/components/ui/AuthRequiredModal";

const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menu" },
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
  const router = useRouter();
  const { user } = useAuth();
  const { totalItems, openCart, hydrated } = useStorefrontCart();
  const { activeOrders, openDrawer } = useActiveOrders();
  const cartBadge = hydrated && totalItems > 0;
  const activeCount = activeOrders.length;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  function handleMisPedidos() {
    if (user) {
      router.push("/orders");
    } else {
      setAuthModalOpen(true);
    }
  }

  const isPedidosActive = pathname === "/orders" || pathname.startsWith("/orders/");

  return (
    <>
      <header className="relative z-1 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          {/* Logo + mobile actions */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/oktava_logo.png"
                alt="Oktava"
                width={160}
                height={40}
                className="object-contain"
                priority
              />
            </Link>

            {/* Mobile only */}
            <div className="flex items-center gap-2 md:hidden">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={openDrawer}
                  className="relative rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 transition-colors hover:text-white"
                  aria-label="Pedidos activos"
                >
                  <Package size={18} />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                </button>
              )}
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
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 transition-colors hover:text-white"
                aria-label="Menú"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {/* Links públicos sin auth */}
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link key={link.href} href={link.href} className={formatNavLinkClass(isActive)}>
                  {link.label}
                </Link>
              );
            })}

            {/* Mis pedidos — verifica auth antes de navegar */}
            <button
              type="button"
              onClick={handleMisPedidos}
              className={formatNavLinkClass(isPedidosActive)}
            >
              Mis pedidos
            </button>

            {/* Desktop extra items — hidden on mobile */}
            <div className="hidden md:contents">
              <Link
                href="/ubica-a-oktava"
                className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-[#e50909] transition-colors hover:bg-red-500/20"
              >
                Ubica la Oktava
              </Link>
            </div>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-2 md:flex">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={openDrawer}
                className="relative rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 transition-colors hover:text-white"
                aria-label="Pedidos activos"
              >
                <Package size={18} />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              </button>
            )}
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

      {/* Rendered outside header so the backdrop doesn't cover the navbar */}
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Modal de auth requerida para "Mis pedidos" */}
      <AuthRequiredModal
        open={authModalOpen}
        message="Necesitas iniciar sesión o registrarte para ver tus pedidos."
        confirmHref="/sign-in?redirect=/orders"
        onCancel={() => setAuthModalOpen(false)}
      />
    </>
  );
}
