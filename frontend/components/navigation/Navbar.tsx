"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/common/Logo";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/dashboard")) return null;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/programmes", label: "Programmes" },
    { href: "/research", label: "Research" },
    { href: "/opportunities", label: "Opportunities" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const displayName =
    user && typeof user === "object" && user.full_name
      ? user.full_name
      : user && typeof user === "object" && user.email
      ? user.email.split("@")[0]
      : "Member";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full bg-white transition-all duration-300 ease-in-out ${
        isScrolled
          ? "border-b border-slate-200 shadow-[0_1px_12px_rgba(0,0,0,0.08)] py-2"
          : "border-b border-slate-100 shadow-none py-4"
      }`}
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between gap-4">

          {/* Far Left: Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo size="sm" showTagline={!isScrolled} />
          </div>

          {/* Center: All Navigation Tabs */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <ul className="flex items-center gap-0.5 bg-slate-100/80 border border-slate-200/70 rounded-full p-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1.5 px-3 xl:px-4 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold transition-all duration-200 ${
                        active
                          ? "bg-white text-brand-navy font-bold shadow-sm border border-slate-200/60"
                          : "text-slate-600 hover:text-brand-navy hover:bg-white/70"
                      }`}
                    >
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                      )}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Far Right: Auth / Member CTAs */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {!loading && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center text-[10px] uppercase font-bold">
                    {displayName.slice(0, 2)}
                  </span>
                  <span className="truncate max-w-[110px]">{displayName}</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-navy hover:bg-brand-navyDark rounded-full shadow-sm transition-all duration-200 hover:scale-105"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-brand-red hover:bg-red-50 rounded-full transition-colors"
                  title="Sign Out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-brand-navy hover:bg-slate-100 rounded-full transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 xl:px-5 py-2 text-xs xl:text-sm font-bold text-white bg-brand-red hover:bg-brand-redDark shadow-md hover:shadow-lg rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Join Network
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center ml-auto">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-brand-navy hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 max-h-[calc(100dvh-5rem)] overflow-y-auto pt-3 border-t border-slate-100 space-y-1 pb-3">
            <ul className="space-y-0.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex min-h-11 items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-brand-ice text-brand-navy font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
                    }`}
                  >
                    {isActive(link.href) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                    )}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {!loading && user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-600">
                    Signed in as <strong className="text-slate-900">{displayName}</strong>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block text-center px-4 py-2.5 text-sm font-bold text-white bg-brand-navy rounded-xl"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center px-4 py-2 text-xs font-semibold text-brand-red hover:bg-red-50 rounded-xl border border-red-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-semibold text-brand-navy border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-brand-red rounded-xl shadow-sm hover:bg-brand-redDark"
                  >
                    Join Network
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
