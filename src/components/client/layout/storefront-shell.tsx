import type { ReactNode } from "react";
import { StorefrontNavbar } from "@/components/client/layout/storefront-navbar";
import { StorefrontFooter } from "@/components/client/layout/storefront-footer";
import { CartDrawer } from "@/components/client/layout/cart-drawer";
import { CartFloatingBar } from "@/components/client/layout/cart-floating-bar";
import { ActiveOrdersDrawer } from "@/components/client/layout/active-orders-drawer";
import { ActiveOrderBar } from "@/components/client/layout/active-order-bar";
import { SessionExpiredModal } from "@/components/client/layout/session-expired-modal";

export function StorefrontShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050505]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 oktava-grid-bg opacity-40" />
        <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/25 blur-[150px]" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-40">
        <StorefrontNavbar />
        <ActiveOrderBar />
      </div>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-20 md:px-6 md:pt-24">
        {children}
      </main>

      <StorefrontFooter />

      <CartFloatingBar />
      <CartDrawer />
      <ActiveOrdersDrawer />

      {/* Modal global de sesión expirada — escucha auth:session-expired */}
      <SessionExpiredModal />
    </div>
  );
}
