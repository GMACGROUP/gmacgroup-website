import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Libre_Franklin } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { AIChatWidget } from "@/components/common/AIChatWidget";
import { NavigationProgressBar } from "@/components/common/NavigationProgressBar";
import { AuthProvider } from "@/hooks/useAuth";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
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
    <html lang="en" className={`${libreFranklin.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <ScrollProgress />
          <AIChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
