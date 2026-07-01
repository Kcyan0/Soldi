import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Soldi — Plataforma Comercial de Treinamento",
  description:
    "Treinamento, performance e evolução para times de vendas. A academia comercial para SDRs que querem evoluir.",
  keywords: ["SDR", "vendas", "treinamento comercial", "sales training"],
  openGraph: {
    title: "Soldi — Plataforma Comercial",
    description: "Treine, evolua e domine as vendas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
