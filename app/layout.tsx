import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anime App",
  description: "Plateforme de streaming d'anime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <main className=" mx-auto bg-[#0F1117]">
          <NavBar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
