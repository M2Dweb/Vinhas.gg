import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vinhas.gg — Produtos Gaming Digitais Premium",
  description:
    "Produtos e subscrições gaming digitais premium. Pagamentos seguros pelo Stripe, entrega instantânea e uma plataforma de confiança para gamers.",
  keywords: [
    "gaming subscriptions",
    "digital gaming products",
    "game accounts",
    "in-game currency",
    "boosting services",
    "Vinhas.gg",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <body className="antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
