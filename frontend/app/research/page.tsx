import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { Portrait } from "@/components/editorial/Portrait";
import { PRACTICE_AREAS } from "@/lib/content/site";
import { getPublications, getTeam, type Publication } from "@/lib/api/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Research",
  description:
    "Applied research from inside African markets: baseline studies, evaluations, labour market assessments, sector diagnostics, policy briefs and feasibility work.",
  alternates: { canonical: "/research" },
};

const PUB_TYPE: Record<Publication["type"], string> = {
  report: "Report",
  policy_brief: "Policy brief",
  working_paper: "Working paper",
  article: "Article",
  dataset: "Dataset",
};

const METHOD = [
  { step: "Question", body: "We start from the decision you have to make and write the research question around it, with a protocol you sign off." },
  { step: "Instruments", body: "Survey instruments, interview guides and a sampling frame designed for the population and the market in question." },
  { step: "Fieldwork", body: "Data collection by people who work in the region, so access is quicker and respondents answer." },
  { step: "Analysis", body: "Quantitative and econometric analysis alongside qualitative synthesis, each checked against the other." },
  { step: "Handover", body: "A written report, a policy brief and a briefing for your team, with the methodology documented in full." },
];

export default async function ResearchPage() {
  const [publications, team] = await Promise.all([getPublications(), getTeam()]);
  const researchers = team
    .filter((m) => m.team === "Research")
    .sort((a, b) => Number(Boolean(b.is_lead)) - Number(Boolean(a.is_lead)) || (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const practice = PRACTICE_AREAS.find((p) => p.slug === "applied-research-and-policy-consulting")!;

  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">Research</span>
          </nav>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-8">
              Evidence produced <em className="font-light italic text-ink-500">inside the markets it describes.</em>
            </h1>
            <p className="lede self-end lg:col-span-4">
              Our research practice is led by doctoral researchers with quantitative and policy expertise, working from the
              countries they study.
            </p>
          </div>
        </div>
      </header>

      {/* What we produce */}
      <section aria-labelledby="produce-title" className="site-section">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow"><span className="eyebrow-num">01</span> What we produce</p>
            <h2 id="produce-title" className="display-md mt-6">{practice.promise}</h2>
            <Link href={`/expertise/${practice.slug}`} className="link-arrow mt-8">
              The research practice in full
              <Arrow />
            </Link>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-[17px] leading-relaxed text-ink-600">{practice.whatItIs}</p>
            <ul className="mt-10 grid grid-cols-1 border-t border-ink sm:grid-cols-2">
              {practice.deliverables.map((d) => (
                <li key={d} className="border-b border-rule py-4 pr-6 text-[15px] text-ink">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Method */}
      <section aria-labelledby="method-title" className="site-section border-y border-rule bg-stone">
        <div className="wrap">
          <p className="eyebrow"><span className="eyebrow-num">02</span> How a study runs</p>
          <h2 id="method-title" className="display-lg mt-6 max-w-[22ch]">Five stages, each one written down.</h2>
          <ol className="mt-12 grid grid-cols-1 border-t border-ink sm:grid-cols-2 lg:grid-cols-5">
            {METHOD.map((m, i) => (
              <li key={m.step} className={`border-b border-rule py-7 sm:pr-6 lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-6" : ""} ${i % 2 === 1 ? "sm:border-l sm:pl-6" : ""}`}>
                <p className="font-display text-4xl font-light tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-display text-xl">{m.step}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Publications */}
      <section aria-labelledby="pubs-title" className="site-section">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow"><span className="eyebrow-num">03</span> Publications</p>
            <h2 id="pubs-title" className="display-md mt-6">Reports, briefs and working papers.</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-500">
              Commissioned work belongs to the client and is published only with their agreement.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {publications.length === 0 ? (
              <div className="border-t border-ink pt-8">
                <p className="font-display text-2xl leading-snug">Public outputs will be listed here as they are released.</p>
                <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-ink-500">
                  If you are looking for evidence on a specific market or question, write to us. We can tell you what exists and
                  whether a short study would answer it.
                </p>
                <Link href="/contact?topic=institution&subject=Research%20enquiry" className="link-arrow mt-6">
                  Ask the research team
                  <Arrow />
                </Link>
              </div>
            ) : (
              <ol className="border-t border-ink">
                {publications.map((p) => (
                  <li key={p.id} className="border-b border-rule py-7">
                    <p className="text-[12px] font-medium uppercase tracking-label text-clay">
                      {PUB_TYPE[p.type] || "Publication"}
                      {p.published_at && (
                        <span className="ml-3 tabular-nums text-ink-400">
                          {new Date(p.published_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                        </span>
                      )}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-snug">
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                          {p.title}
                        </a>
                      ) : (
                        p.title
                      )}
                    </h3>
                    {p.authors.length > 0 && <p className="mt-2 text-sm text-ink-500">{p.authors.join(", ")}</p>}
                    {p.summary && <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-600">{p.summary}</p>}
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="link-arrow mt-4">
                        Read
                        <span className="sr-only"> {p.title}</span>
                        <Arrow />
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      {/* People */}
      {researchers.length > 0 && (
        <section aria-labelledby="people-title" className="site-section border-t border-rule">
          <div className="wrap">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow"><span className="eyebrow-num">04</span> The research team</p>
                <h2 id="people-title" className="display-md mt-6">Who does the work.</h2>
              </div>
              <Link href="/team" className="link-arrow">
                Full team
                <Arrow />
              </Link>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              {researchers.map((m) => (
                <li key={m.id} className="group">
                  <Portrait name={m.name} src={m.photo_url} className="aspect-[4/5] w-full" sizes="(max-width: 640px) 45vw, 16vw" />
                  <p className="mt-3 font-medium leading-snug text-ink">{m.name}</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-500">{m.position}</p>
                  <p className="mt-1 text-[13px] text-ink-400">{m.country}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-ink text-white">
        <div className="wrap grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">Commission a study.</h2>
            <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-white/70">
              Tell us the decision and the deadline. We reply with a written scope, a method and a price band.
            </p>
            <Link href="/contact?topic=institution" className="btn-primary mt-8">
              Start a conversation
              <Arrow />
            </Link>
          </div>
          <div className="border-t border-white/20 pt-6 lg:col-span-5 lg:col-start-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h2 className="font-display text-2xl text-white">Researchers</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Doctoral and early career researchers working on African labour markets, policy or investment can write to us about
              joining projects.
            </p>
            <Link href="/contact?topic=careers&subject=Research%20network" className="mt-5 inline-flex items-center gap-2 text-[15px] text-white underline-offset-4 hover:underline">
              Express interest
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
