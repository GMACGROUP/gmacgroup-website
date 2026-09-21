import type { Metadata } from "next";
import "../styles/globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ScrollProgress } from "@/components/common/ScrollProgress";

export const metadata: Metadata = {
  title: "GMACGROUP — Bridging Learning, Opportunity, and Impact",
  description:
    "GMACGROUP is a Human Capital, Research, and Professional Development organization.",
  // TODO: add OpenGraph/Twitter metadata, favicon, etc.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <ScrollProgress />
      </body>
    </html>
  );
}
