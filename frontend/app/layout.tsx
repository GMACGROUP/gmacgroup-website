import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "../styles/globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { AIChatWidget } from "@/components/common/AIChatWidget";
import { NavigationProgressBar } from "@/components/common/NavigationProgressBar";
import { AuthProvider } from "@/hooks/useAuth";
import { Reveal } from "@/components/editorial/Reveal";
import { Analytics } from "@vercel/analytics/react";
import { SITE } from "@/lib/content/site";

// Fonts are self hosted (SIL Open Font License, see app/fonts) so builds and
// page loads never depend on a third party font service.
const franklin = localFont({
  src: [
    { path: "./fonts/libre-franklin-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/libre-franklin-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-sans",
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
    default: "Gmac Group | Research, Human Capital & Investment Facilitation in Africa",
    template: "%s | Gmac Group",
  },
  description: SITE.positioning,
  keywords: [
    "Gmac Group",
    "GMAC Advisory and Consulting",
    "Africa research firm",
    "human capital consulting Africa",
    "investment facilitation Africa",
    "workforce consulting Ghana",
    "policy consulting Africa",
    "capacity building Africa",
    "employability programmes Africa",
    "development finance Africa",
    "labour market research Ghana",
    "Pan-African advisory",
    "gmac-group.com",
  ],
  authors: [{ name: "Gmac Group", url: SITE.url }],
  creator: "Gmac Group",
  publisher: "Gmac Group",
  category: "Business Services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Gmac Group",
    title: "Gmac Group | Research, Human Capital & Investment Facilitation in Africa",
    description: SITE.positioning,
    url: SITE.url,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gmac Group – Research, human capital and investment facilitation in Africa",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gmacgroup",
    creator: "@gmacgroup",
    title: "Gmac Group | Research, Human Capital & Investment Facilitation in Africa",
    description: SITE.positioning,
    images: ["/og-image.png"],
  },
  alternates: { canonical: SITE.url },
  verification: {
    google: "VW4QlFjNydIW8WGazckKsseIg4k5_Dz2qaldEqktaTg",
  },
  other: {
    "theme-color": "#0E1A2B",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  alternateName: ["GMAC Group", "Gmac Advisory and Consulting", "GMAC Advisory"],
  legalName: SITE.legalName,
  url: SITE.url,
  logo: {
    "@type": "ImageObject",
    url: `${SITE.url.replace(/\/$/, "")}/logo.svg`,
    width: 200,
    height: 60,
  },
  description: SITE.positioning,
  email: SITE.email,
  telephone: SITE.phones,
  areaServed: [
    "Africa", "Ghana", "Nigeria", "Rwanda", "Tanzania", "Zambia", "Malawi", "Botswana",
    "Côte d'Ivoire", "Togo", "Cameroon",
  ],
  knowsAbout: [
    "Human capital development",
    "Labour market research",
    "Investment facilitation",
    "Development policy consulting",
    "Capacity building",
    "Employability programmes",
    "African economic development",
  ],
  founder: {
    "@type": "Person",
    name: "Raphael Sochima Ajana",
    jobTitle: "Founder",
    url: `${SITE.url.replace(/\/$/, "")}/team/raphael-sochima-ajana`,
    sameAs: ["https://www.linkedin.com/company/gmac-group/"],
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "GH",
    addressRegion: "Greater Accra",
    addressLocality: "Accra",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+233 20 215 4828",
      contactType: "customer service",
      areaServed: "GH",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      telephone: "+234 814 498 8398",
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: "English",
    },
  ],
  sameAs: Object.values(SITE.social),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.positioning,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url.replace(/\/$/, "")}/research?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${franklin.variable} ${newsreader.variable} overflow-x-hidden`}>
      <body className="min-h-screen flex flex-col font-sans overflow-x-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <AuthProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <Navbar />
          <main className="flex-1 pt-[72px]">{children}</main>
          <Footer />
          <AIChatWidget />
          <Reveal />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
