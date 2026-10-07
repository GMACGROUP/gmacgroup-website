import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { PARTNERS, SITE } from "@/lib/content/site";

export function ClosingInvitation() {
  return (
    <>
      <section aria-label="Partners" className="border-y border-rule">
        <div className="wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:gap-16">
          <p className="text-[12px] font-medium uppercase tracking-label text-ink-400">Working alongside</p>
          <ul className="flex flex-wrap gap-x-14 gap-y-4">
            {PARTNERS.map((p) => (
              <li key={p.name} title={p.role} className="font-display text-2xl text-ink-600">
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-section band-blue text-white">
        <div className="pattern-grid wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow !text-accent-soft">An invitation</p>
            <h2 className="display-xl reveal mt-8 max-w-[16ch] text-white">Tell us the decision you are trying to make.</h2>
          </div>
          <div className="flex flex-col justify-end gap-8 lg:col-span-4">
            <p className="lede !text-white/75">
              Or the capability you are trying to build. We will tell you plainly whether we are the right people, and what it
              would take.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/contact" className="btn-primary self-start">
                Start a conversation
                <Arrow />
              </Link>
              <a href={`mailto:${SITE.email}`} className="link-arrow !text-white">
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
