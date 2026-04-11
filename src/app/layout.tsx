import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
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
      className={robotoCondensed.variable}
    >
      <body className="min-h-full flex flex-col bg-black">
          <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  );
}
