import type { ReactNode } from "react";
import { StorefrontShell } from "@/components/client/layout/storefront-shell";
import { StorefrontCartProvider } from "@/context/StorefrontCartContext";

export default function PublicLayout({ children }: { readonly children: ReactNode }) {
  return (
    <StorefrontCartProvider>
      <StorefrontShell>{children}</StorefrontShell>
    </StorefrontCartProvider>
  );
}
