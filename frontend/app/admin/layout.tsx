import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: "/admin" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
