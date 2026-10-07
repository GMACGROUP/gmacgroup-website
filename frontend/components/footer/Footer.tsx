"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { Logo } from "@/components/common/Logo";
import {
  CheckCircleIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XSocialIcon,
} from "@/components/common/Icons";

export function Footer() {
  const pathname = usePathname();
  const safePathname = pathname ?? "/";
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subscribed) return;

    const timeout = window.setTimeout(() => setSubscribed(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [subscribed]);

  if (
    safePathname.startsWith("/dashboard") ||
    safePathname === "/login" ||
    safePathname === "/register"
  ) return null;

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/contact/newsletter", { email });
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Expertise",
      links: [
        { href: "/expertise/applied-research-and-policy-consulting", label: "Applied research and policy" },
        { href: "/expertise/institutional-capacity-building", label: "Institutional capacity building" },
        { href: "/expertise/human-capital-and-workforce-consulting", label: "Human capital and workforce" },
        { href: "/expertise/employability-programmes", label: "Employability programmes" },
        { href: "/expertise/signature-events-and-workshops", label: "Signature events" },
        { href: "/expertise/investment-facilitation", label: "Investment facilitation" },
      ],
    },
    {
      title: "Gmac Group",
      links: [
        { href: "/about", label: "About" },
        { href: "/team", label: "Team" },
        { href: "/research", label: "Research" },
        { href: "/events", label: "Events" },
        { href: "/programmes", label: "Programmes" },
        { href: "/opportunities", label: "Careers" },
        { href: "/contact", label: "Contact" },
      ],
    },
  ];

  const socials = [
    { href: "https://www.linkedin.com/company/gmac-group/?viewAsMember=true", label: "LinkedIn", Icon: LinkedInIcon },
    { href: "https://twitter.com/gmacgroup", label: "X", Icon: XSocialIcon },
    { href: "https://www.instagram.com/gmac_group?stkn=NWdhdTYzdXFneW1n", label: "Instagram", Icon: InstagramIcon },
    { href: "https://www.facebook.com/profile.php?id=61589840175874", label: "Facebook", Icon: FacebookIcon },
  ];

  return (
    <footer className="bg-ink-900 text-white/70">
      <div className="wrap grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="inline-block bg-white p-3">
            <Logo size="md" />
          </div>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
            A research and advisory firm that builds human capital, produces decision ready evidence, and connects
            investors to investable projects across Africa. Remote by design, working from ten countries.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`GMAC Group on ${label}`}
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className={col.title === "Gmac Group" ? "lg:col-span-2" : "lg:col-span-3"}>
            <h4 className="font-sans text-[12px] font-medium uppercase tracking-label text-white">{col.title}</h4>
            <ul className="mt-5 space-y-3 text-[15px]">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} prefetch={true} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-3">
          <h4 className="font-sans text-[12px] font-medium uppercase tracking-label text-white">Gmac Insights</h4>
          <p className="mt-5 text-[15px] leading-relaxed">
            Periodic briefings on workforce trends, research and fellowship cohorts.
          </p>
          {subscribed ? (
            <div className="mt-5 flex items-center gap-2 border border-emerald-500/40 p-3 text-sm text-emerald-200">
              <CheckCircleIcon className="h-4 w-4 shrink-0" />
              <span>Thank you. You are subscribed.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-5 flex border border-white/20 focus-within:border-white">
              <label htmlFor="footer-email" className="sr-only">Work email</label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your work email"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-accent-light disabled:opacity-50"
              >
                {submitting ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-4 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gmac Advisory and Consulting Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white">Privacy</Link>
            <Link href="/about" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
