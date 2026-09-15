import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DentalCare",
  description: "Gestión integral para clínicas odontológicas",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
