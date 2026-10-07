import Link from "next/link";

export type LegalSection = { id: string; title: string; body: (string | string[])[] };

/** Long-form legal page with a sticky contents list. Strings are paragraphs; arrays are bullet lists. */
export function LegalPage({ title, intro, updated, sections }: { title: string; intro: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap pb-12 pt-14 sm:pt-20 lg:pb-16 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">{title}</span>
          </nav>
          <h1 className="display-lg mt-8">{title}</h1>
          <p className="lede mt-6 max-w-[62ch]">{intro}</p>
          <p className="mt-6 text-sm text-ink-400">Last updated {updated}</p>
        </div>
      </header>
      <div className="wrap grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:py-20">
        <nav aria-label="Contents" className="lg:col-span-3">
          <ol className="space-y-2 border-t border-ink pt-5 text-sm lg:sticky lg:top-28">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-3 text-ink-500 hover:text-ink">
                  <span className="tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-prose lg:col-span-8 lg:col-start-5">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-rule pb-10 pt-8 first:border-t-0 first:pt-0">
              <h2 className="font-display text-2xl">
                <span className="mr-3 text-accent">{i + 1}.</span>
                {s.title}
              </h2>
              {s.body.map((b, k) =>
                Array.isArray(b) ? (
                  <ul key={k} className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-ink-700 marker:text-ink-300">
                    {b.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                ) : (
                  <p key={k} className="mt-4 text-[16px] leading-relaxed text-ink-700">{b}</p>
                )
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
