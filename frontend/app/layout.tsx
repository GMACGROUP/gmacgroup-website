import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { NavigationProgressBar } from "@/components/common/NavigationProgressBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "GMACGROUP — Bridging Learning, Opportunity, and Impact",
  description:
    "GMACGROUP is a Human Capital, Research, and Professional Development organization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <ScrollProgress />
      </body>
    </html>
  );
}
