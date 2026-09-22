"use client";

import { useState } from "react";
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

  return (
    <footer className="bg-brand-navyDeep text-slate-300 border-t border-slate-800">
      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Logo variant="dark" size="md" showTagline={true} />
            <p className="text-sm text-slate-400 leading-relaxed mt-4">
              Gmac Group builds people and the evidence institutions need to deploy them well. We connect talent to opportunity through research, skills, advisory, and investment facilitation across Africa.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/10 text-brand-cyan border border-white/10">
                Accra, Ghana
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/10 text-slate-300 border border-white/10">
                Global Reach
              </span>
            </div>
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Follow GMACGROUP
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.linkedin.com/company/gmac-group/?viewAsMember=true"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GMACGROUP on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xs font-extrabold text-brand-cyan transition-all hover:-translate-y-0.5 hover:border-brand-cyan hover:bg-brand-cyan hover:text-brand-navyDeep"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/gmacgroup"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GMACGROUP on X"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-brand-navyDeep"
                >
                  <XSocialIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/gmacgroup"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GMACGROUP on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-sm font-extrabold text-brand-red transition-all hover:-translate-y-0.5 hover:border-brand-red hover:bg-brand-red hover:text-white"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/gmacgroup"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GMACGROUP on Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-sm font-extrabold text-brand-cyan transition-all hover:-translate-y-0.5 hover:border-brand-cyan hover:bg-brand-cyan hover:text-brand-navyDeep"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5 font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Strategic Services
                </Link>
              </li>
              <li>
                <Link href="/programmes" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Development Programmes
                </Link>
              </li>
              <li>
                <Link href="/opportunities" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Career & Fellowship Openings
                </Link>
              </li>
              <li>
                <Link href="/research" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Research & Publications
                </Link>
              </li>
              <li>
                <Link href="/insights" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Insights & Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Contact & Advisory Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Strategic Pillars */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5 font-serif">
              Our Core Pillars
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services#education-employability" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Education & Employability
                </Link>
              </li>
              <li>
                <Link href="/services#research-and-training" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Research & Capacity Building
                </Link>
              </li>
              <li>
                <Link href="/services#consulting-and-advisory" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Human Capital Advisory
                </Link>
              </li>
              <li>
                <Link href="/programmes" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Career Readiness Labs
                </Link>
              </li>
              <li>
                <Link href="/research" prefetch={true} className="hover:text-brand-cyan transition-colors">
                  Evidence-to-Policy Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5 font-serif">
              Stay Connected
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe to GMAC Insights for periodic briefings on workforce trends and fellowship cohorts.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! You are subscribed to GMAC Insights.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Subscribe to Briefing →"}
                </button>
                {error && (
                  <p className="text-[11px] text-red-400 mt-1">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GMAC GROUP. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" prefetch={true} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" prefetch={true} className="hover:text-slate-300 transition-colors">
              Terms of Engagement
            </Link>
            <Link href="/contact" prefetch={true} className="hover:text-slate-300 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
