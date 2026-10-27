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
  const safePathname = pathname ?? "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 12);
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOperationsPage = safePathname.startsWith("/admin");
  const isDashboardPage = safePathname.startsWith("/dashboard");
  // Only show Login/Register when we are CERTAIN there is no logged-in user.
  // While loading is true, render nothing in the auth slot to prevent the
  // Login/Register buttons from flashing for already-authenticated users.
  const showPublicAuthActions = !loading && !user && !isOperationsPage && !isDashboardPage;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/expertise", label: "Expertise" },
    { href: "/research", label: "Research" },
    { href: "/programmes", label: "Programmes" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
    { href: "/careers", label: "Careers" },
  ];

  const isActive = (href: string) => (href === "/" ? safePathname === "/" : safePathname.startsWith(href));

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
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-paper/95 backdrop-blur-md shadow-[0_4px_20px_-6px_rgba(11,26,44,0.1)] border-b border-rule"
          : "bg-paper/90 backdrop-blur-sm border-b border-rule/50"
      }`}
    >
      <div className="wrap">
        <nav className="flex h-[72px] items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-shrink-0 items-center">
            <Logo size="md" className="h-11 w-auto sm:h-12" />
          </div>

          <ul className="hidden h-full flex-1 items-stretch justify-center gap-1 lg:flex xl:gap-3">
            {navLinks.filter((l) => l.href !== "/").map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="flex">
                  <Link
                    href={link.href}
                    prefetch={true}
                    className={`relative flex items-center px-3 text-[14.5px] transition-colors ${
                      active ? "text-ink" : "text-ink-500 hover:text-ink"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3 bottom-0 h-[2px] bg-accent transition-transform duration-300 origin-left ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden flex-shrink-0 items-center gap-5 lg:flex">
            {user ? (
              <>
                <Link href="/dashboard" prefetch={true} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-semibold uppercase text-white">
                    {displayName.slice(0, 2)}
                  </span>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </Link>
                <button type="button" onClick={handleLogout} className="text-sm font-medium text-ink-500 hover:text-ink">
                  Sign out
                </button>
              </>
            ) : showPublicAuthActions ? (
              <>
                <Link href="/login" prefetch={true} className="text-sm text-ink-500 hover:text-ink">
                  Sign in
                </Link>
                <Link href="/contact" prefetch={true} className="btn-primary !px-5 !py-2.5 !text-sm">
                  Start a conversation
                </Link>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-ink transition-colors hover:bg-stone lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">{mobileMenuOpen ? "Close" : "Menu"}</span>
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-rule bg-paper lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-[calc(100dvh-72px)] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="max-h-[calc(100dvh-72px)] overflow-y-auto">
          <ul className="wrap py-2">
            {[...navLinks, ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : [])].map((link) => (
              <li key={link.href} className="border-b border-rule last:border-0">
                <Link
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex min-h-[56px] items-center justify-between text-[15px] font-medium transition-colors ${
                    isActive(link.href) ? "text-accent" : "text-ink hover:text-accent"
                  }`}
                >
                  {link.label}
                  <svg className="h-4 w-4 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <div className="wrap flex flex-col gap-3 pb-8 pt-3">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn-secondary w-full"
              >
                Sign out ({displayName})
              </button>
            ) : showPublicAuthActions ? (
              <>
                <Link href="/contact" prefetch={true} onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center">
                  Start a conversation
                </Link>
                <Link href="/login" prefetch={true} onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full text-center">
                  Sign in
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Integrated reading progress bar on scroll */}
      <div
        className="h-[2px] bg-accent transition-[width] duration-150 ease-out"
        style={{
          width: `${scrollProgress * 100}%`,
          opacity: isScrolled ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </header>
  );
}
