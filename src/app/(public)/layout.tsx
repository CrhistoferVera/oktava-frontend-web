import { Bebas_Neue, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { StorefrontShell } from "@/components/client/layout/storefront-shell";
import { StorefrontCartProvider } from "@/context/StorefrontCartContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <StorefrontCartProvider>
      <div className={`${manrope.variable} ${bebasNeue.variable}`}>
        <StorefrontShell>{children}</StorefrontShell>
      </div>
    </StorefrontCartProvider>
  );
}
