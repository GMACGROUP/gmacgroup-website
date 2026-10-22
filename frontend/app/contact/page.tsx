import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { ENGAGEMENT_MODELS, SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Begin a conversation with Gmac Group about research, workforce, investment facilitation, programmes or sponsorship.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">Contact</span>
          </nav>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-8">
              Begin a conversation. <em className="font-light italic text-ink-500">The first step is the same for everyone.</em>
            </h1>
            <p className="lede self-end lg:col-span-4">
              Whether you are commissioning research, building a workforce, sponsoring a convening or looking for
              investable projects, we start with a short conversation to establish fit and scope.
            </p>
          </div>
        </div>
      </header>

      <section className="wrap grid grid-cols-1 gap-16 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="space-y-10 lg:sticky lg:top-28">
            <div className="border-t border-ink pt-5">
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-400">General enquiries</p>
              <a href={`mailto:${SITE.email}`} className="mt-2 block font-display text-2xl text-ink hover:text-accent">
                {SITE.email}
              </a>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Institutional enquiries, scoping conversations, sponsorship and partnerships.
              </p>
            </div>

            <div className="border-t border-rule pt-5">
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-400">Telephone</p>
              <ul className="mt-2 space-y-1">
                {SITE.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:${p.replace(/\s/g, "")}`} className="text-[17px] text-ink hover:text-accent">{p}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-rule pt-5">
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-400">How we work</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                Remote by design. Our team works from ten countries and assembles around each brief.
              </p>
            </div>

            <div className="border-t border-rule pt-5">
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-400">Follow</p>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
                <li><a href={SITE.social.linkedin} target="_blank" rel="noreferrer" className="text-ink hover:text-accent">LinkedIn</a></li>
                <li><a href={SITE.social.instagram} target="_blank" rel="noreferrer" className="text-ink hover:text-accent">Instagram</a></li>
                <li><a href={SITE.social.x} target="_blank" rel="noreferrer" className="text-ink hover:text-accent">X</a></li>
                <li><a href={SITE.social.facebook} target="_blank" rel="noreferrer" className="text-ink hover:text-accent">Facebook</a></li>
              </ul>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t border-rule bg-sand">
        <div className="wrap grid grid-cols-1 gap-10 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">For institutions</p>
            <h2 className="mt-5 font-display text-3xl">Five ways to work with us.</h2>
            <Link href="/how-we-engage" className="link-arrow mt-6">How we engage</Link>
          </div>
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {ENGAGEMENT_MODELS.map((m, i) => (
              <li key={m.title} className="border-t border-ink/15 py-5">
                <p className="text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 font-medium text-ink">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
