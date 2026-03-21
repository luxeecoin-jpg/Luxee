import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/hooks/useCart";
import { CartDrawer } from "@/components/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxee | Premium Fragrances & Perfumes",
  description: "Discover luxury fragrances at honest prices. Shop premium perfumes, attars & gift sets at Luxee.",
  keywords: ["perfume", "fragrance", "luxury", "attar", "Luxee", "premium perfumes"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
