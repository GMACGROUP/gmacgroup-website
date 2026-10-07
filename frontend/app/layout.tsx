import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "../styles/globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { AIChatWidget } from "@/components/common/AIChatWidget";
import { NavigationProgressBar } from "@/components/common/NavigationProgressBar";
import { AuthProvider } from "@/hooks/useAuth";
import { Reveal } from "@/components/editorial/Reveal";
import { SITE } from "@/lib/content/site";

// Fonts are self hosted (SIL Open Font License, see app/fonts) so builds and
// page loads never depend on a third party font service.
const plex = localFont({
  src: [{ path: "./fonts/ibm-plex-sans-latin-wght-normal.woff2", weight: "100 700", style: "normal" }],
  variable: "--font-plex",
  display: "swap",
  fallback: ["-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-opsz-normal.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/newsreader-latin-opsz-italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Gmac Group | Research, human capital and investment facilitation in Africa",
    template: "%s | Gmac Group",
  },
  description: SITE.positioning,
  openGraph: {
    type: "website",
    siteName: "Gmac Group",
    title: "Gmac Group",
    description: SITE.positioning,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "Gmac Group", description: SITE.positioning },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plex.variable} ${newsreader.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <Navbar />
          <main className="flex-1 pt-[72px]">{children}</main>
          <Footer />
          <ScrollProgress />
          <AIChatWidget />
          <Reveal />
        </AuthProvider>
      </body>
    </html>
  );
}
