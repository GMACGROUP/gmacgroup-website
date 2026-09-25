import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/common/PageHeader";
import { TrendingUpIcon, BuildingIcon, SparklesIcon, AwardIcon } from "@/components/common/Icons";

const articles = [
  {
    id: "1",
    title: "Bridging the Graduate Transition Gap: Empirical Findings from Sub-Saharan Africa",
    date: "September 15, 2026",
    readTime: "6 min read",
    category: "Workforce Trends",
    summary:
      "Why traditional higher education models must evolve toward integrated experiential learning and adaptive workplace capability.",
    badgeColor: "bg-red-50 text-brand-red border-red-200",
    accent: "bg-brand-red",
    icon: TrendingUpIcon,
    image: "/images/service-employability.jpg",
  },
  {
    id: "2",
    title: "The Role of Applied Research in Shaping 21st Century Talent Policies",
    date: "August 28, 2026",
    readTime: "8 min read",
    category: "Policy Brief",
    summary:
      "A deep dive into how institutional policymakers leverage econometric and qualitative insights to design high-yield fellowship programs.",
    badgeColor: "bg-blue-50 text-brand-navy border-blue-200",
    accent: "bg-brand-navy",
    icon: BuildingIcon,
    image: "/images/service-policy-research.jpg",
  },
  {
    id: "3",
    title: "Institutional Agility: Strategic Talent Architecture for High-Growth Sectors",
    date: "August 10, 2026",
    readTime: "5 min read",
    category: "Advisory & Strategy",
    summary:
      "Frameworks for enterprise leaders to build resilient workforce pipelines amidst technological disruption and market shifts.",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    accent: "bg-purple-600",
    icon: SparklesIcon,
    image: "/images/service-workforce-consulting.jpg",
  },
];

export default function InsightsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="Thought Leadership"
        title="GMAC Insights & Analysis"
        subtitle="Perspectives on human capital development, empirical research, and institutional innovation."
      />

      {/* Featured Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 py-5 max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-700 font-medium">
            <span className="font-bold text-slate-900">{articles.length} Research Briefs</span> — Workforce analysis, econometric findings & policy perspectives
          </p>
          <span className="badge bg-emerald-50 text-emerald-800 border-emerald-200 font-bold">
            Updated September 2026
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {articles.map((article, idx) => {
            const IconComp = article.icon;
            return (
              <article
                key={article.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Article Cover Photo */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${article.badgeColor} shadow-sm font-bold`}>
                      {article.category}
                    </span>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 badge bg-amber-500 text-white border-amber-400 text-[10px] font-bold shadow-sm">
                        <AwardIcon className="w-3 h-3 text-white" />
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <IconComp className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>GMAC Working Paper</span>
                    </div>
                    <span className="text-slate-300 font-medium">{article.readTime}</span>
                  </div>
                </div>

                {/* Top accent strip */}
                <div className={`h-1 w-full ${article.accent}`} />

                <div className="flex flex-col flex-1 p-6">
                  <h2 className="text-lg font-extrabold text-slate-900 font-serif leading-snug group-hover:text-brand-navy transition-colors mb-2.5 flex-1">
                    {article.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">{article.date}</span>
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-brand-navy hover:text-brand-red transition-colors inline-flex items-center gap-1 group-hover:gap-1.5"
                    >
                      Read Analysis →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-3xl border border-slate-200 shadow-card p-8 sm:p-10">
          <span className="section-label text-brand-red block mb-2">Research Collaboration</span>
          <h3 className="text-2xl font-extrabold font-serif text-slate-900 mb-3">
            Contribute to GMAC Research
          </h3>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6">
            Are you a researcher, policy analyst, or institutional leader with insights to share? Join our contributor network.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              Submit a Research Brief →
            </Link>
            <Link href="/register" className="btn-secondary">
              Join Contributor Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
