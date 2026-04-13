import type { ReactNode } from "react";
import { StorefrontNavbar } from "@/components/client/layout/storefront-navbar";
import { CartDrawer } from "@/components/client/layout/cart-drawer";
import { CartFloatingBar } from "@/components/client/layout/cart-floating-bar";

export function StorefrontShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050505]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 oktava-grid-bg opacity-40" />
        <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/25 blur-[150px]" />
      </div>

      <StorefrontNavbar />

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-32 pt-8 md:px-6 md:pt-12">
        {children}
      </main>

      <CartFloatingBar />
      <CartDrawer />
    </div>
  );
}
