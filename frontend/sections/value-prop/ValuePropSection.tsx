import Link from "next/link";
import { ArrowRight } from "@/sections/hero/Hero";

const audiences = [
  {
    who: "Development agencies and funders",
    body: "Baseline studies, evaluations and labour market evidence you can defend.",
    points: ["Baseline diagnostics", "Impact evaluation", "Labour market evidence"],
    href: "/services",
    cta: "Commission research",
  },
  {
    who: "Employers",
    body: "Graduate intake, talent assessment and workforce strategy built on a real view of the market.",
    points: ["Graduate intake", "Skills diagnostics", "Workforce strategy"],
    href: "/services",
    cta: "Build your workforce",
  },
  {
    who: "Investors",
    body: "Screened deal flow, sector studies and investment ready projects across ten focus markets.",
    points: ["Deal origination", "Sector deep dives", "Market analysis"],
    href: "/services",
    cta: "Find investable projects",
  },
  {
    who: "Professionals and graduates",
    body: "Employability programmes, research methods training and positioning for your next step.",
    points: ["Career readiness", "Applied research", "Executive cohorts"],
    href: "/programmes",
    cta: "Grow your career",
  },
];

export function ValuePropSection() {
  return (
    <section className="site-section bg-white">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Who we serve</p>
            <h2 className="section-title mt-5">Tell us the decision you are trying to make.</h2>
          </div>
          <p className="section-subtitle lg:col-span-6 lg:col-start-7 lg:pt-12">
            Institutions and investors come first, professionals second. Each engagement starts with the question you
            need answered, not a product we want to sell.
          </p>
        </div>

        <div className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, i) => (
            <Link
              key={a.who}
              href={a.href}
              className={`group flex flex-col border-b border-line py-8 transition-colors hover:bg-mist sm:px-6 lg:border-b-0 ${
                i > 0 ? "lg:border-l" : ""
              } ${i % 2 === 1 ? "sm:border-l" : ""} sm:first:pl-6 lg:first:pl-0`}
            >
              <span className="text-sm font-medium text-ink-400">0{i + 1}</span>
              <h3 className="mt-6 text-xl font-semibold leading-snug text-ink">{a.who}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-500">{a.body}</p>
              <ul className="mt-6 space-y-2 text-sm text-ink-600">
                {a.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <span className="h-1 w-1 bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="link-arrow mt-8 group-hover:text-accent">
                {a.cta}
                <ArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
