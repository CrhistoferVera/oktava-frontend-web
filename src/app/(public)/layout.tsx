import type { ReactNode } from "react";
import { StorefrontShell } from "@/components/client/layout/storefront-shell";
import { StorefrontCartProvider } from "@/context/StorefrontCartContext";
import { ActiveOrdersProvider } from "@/context/ActiveOrdersContext";

export default function PublicLayout({ children }: { readonly children: ReactNode }) {
  return (
    <StorefrontCartProvider>
      <ActiveOrdersProvider>
        <StorefrontShell>{children}</StorefrontShell>
      </ActiveOrdersProvider>
    </StorefrontCartProvider>
  );
}
