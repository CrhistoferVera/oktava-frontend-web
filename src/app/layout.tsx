import type { Metadata } from "next";
import { Roboto_Condensed, Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oktava",
  description: "Oktava fast food premium ordering experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoCondensed.variable} ${bebasNeue.variable} ${manrope.variable}`}
    >
      <body className="min-h-full flex flex-col bg-black">
          <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  );
}
