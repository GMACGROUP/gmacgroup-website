import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/common/PageHeader";
import { TargetIcon, GlobeIcon, ShieldCheckIcon, TrendingUpIcon, UsersIcon, AwardIcon, SparklesIcon, BookOpenIcon } from "@/components/common/Icons";

const pillars = [
  {
    icon: TargetIcon,
    color: "bg-red-50 text-brand-red border-red-200",
    accent: "bg-brand-red",
    title: "Our Mission",
    body: "To design and deliver world-class human capital pathways, rigorous empirical research, and strategic institutional advisory that empower individuals and organizations to reach their highest potential.",
  },
  {
    icon: GlobeIcon,
    color: "bg-blue-50 text-brand-navy border-blue-200",
    accent: "bg-brand-navy",
    title: "Our Vision",
    body: "To become the premier bridge between learning, opportunity, and transformative institutional impact across the African continent and the global workforce.",
  },
];

const approaches = [
  {
    num: "01",
    title: "Empirical Grounding",
    body: "Every cohort curriculum and strategic mandate starts with baseline econometric and labor market diagnostics.",
    icon: ShieldCheckIcon,
    isDark: false,
  },
  {
    num: "02",
    title: "Direct Industry Alignment",
    body: "We co-create talent tracks with leading corporations, guaranteeing immediate relevance and tangible workforce integration.",
    icon: BookOpenIcon,
    isDark: true,
  },
  {
    num: "03",
    title: "Enduring Global Network",
    body: "Fellows and institutional partners access an active international community of researchers, leaders, and mentors.",
    icon: SparklesIcon,
    isDark: false,
  },
];

const focusAreas = [
  {
    icon: ShieldCheckIcon,
    title: "Evidence-Based Frameworks",
    body: "Grounding every cohort and advisory mandate in robust diagnostics.",
  },
  {
    icon: TrendingUpIcon,
    title: "Employer-Aligned Pathways",
    body: "Direct enterprise partnerships guaranteeing in-demand workplace skills.",
  },
  {
    icon: UsersIcon,
    title: "Global Scholarly Network",
    body: "Connecting fellows and researchers into an active community of practice.",
  },
  {
    icon: AwardIcon,
    title: "Transformative Impact",
    body: "Empowering talent to drive institutional change across policy & industry.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="About Our Organization"
        title="About GMAC GROUP"
        subtitle="A Human Capital, Applied Research, and Professional Development organization dedicated to connecting talent to opportunity."
      />

      {/* ── Main Content ─────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-6xl space-y-12">

        {/* Hero Story & Editorial Image Section */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 overflow-hidden">
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-[11px] font-bold tracking-wider uppercase">
              INSTITUTIONAL HERITAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-snug">
              Build the people and build the evidence at the same time
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Gmac Group began with a gap visible from both sides of the same room: graduates were leaving university with credentials but without a route into work, while institutions were making decisions without reliable evidence. We started by training, coaching, and convening, then built a research practice led by doctoral researchers to produce evidence about African markets from within the continent itself.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-brand-navy border border-blue-200 shadow-xs">
                Human Capital
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-brand-red border border-red-200 shadow-xs">
                Applied Research
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                Institutional Advisory
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
            <Image
              src="/images/about-team.jpg"
              alt="GMAC GROUP Leadership & Strategy Team in Accra"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs font-bold text-white">GMAC Strategic Advisory Council</p>
              <p className="text-[11px] text-slate-300">Collaborating on pan-African workforce & institutional transformation</p>
            </div>
          </div>
        </div>

        {/* Core Team */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-4 rounded-3xl bg-[#072448] p-7 sm:p-9 text-white shadow-card overflow-hidden relative">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-brand-cyan/20" />
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-brand-cyan/20" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-12">
              <div>
                <span className="inline-flex rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-cyan">
                  Core Team
                </span>
                <p className="mt-6 text-6xl font-extrabold tracking-tight text-white/90 font-serif">RSA</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-cyan">Founder</p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-white">Raphael S. Ajana</h2>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-card">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red">
              A word from the founder
            </span>
            <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-700">
              Raphael is an economist trained at the University of Ghana, with research and advisory experience across labour markets, development policy, and capital mobilisation for African markets. He leads Gmac Group&apos;s executive advisory work and chairs its flagship convenings.
            </p>
            <blockquote className="mt-7 border-l-4 border-brand-warm pl-5 font-serif text-xl sm:text-2xl font-bold leading-snug text-brand-navy">
              Build the people and build the evidence at the same time, from inside the continent they concern.
            </blockquote>
          </div>
        </div>

        {/* Dynamic 3-Pillar Section */}
        <div>
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-600 text-[11px] font-bold tracking-wider uppercase mb-2">
              OUR METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Built on three enduring principles
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              We work with evidence before advice, specialists rather than generalists, and scope that is written down before work begins.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {approaches.map((item) => {
              const Icon = item.icon;
              if (item.isDark) {
                return (
                  <div
                    key={item.num}
                    className="group relative bg-[#072448] text-white rounded-2xl p-6 sm:p-7 shadow-card hover:shadow-elevate hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden border border-brand-navy"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-brand-cyan" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-extrabold text-white/30 font-sans tracking-tight">
                          {item.num}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-6 mb-2.5">
                        {item.title}
                      </h3>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={item.num}
                  className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-brand-navy/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-cyan-600" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-sans tracking-tight">
                        {item.num}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 mt-6 mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((p) => {
            const IconComp = p.icon;
            return (
              <div
                key={p.title}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all p-6 sm:p-8 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${p.accent}`} />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${p.color} shadow-xs group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-2.5">{p.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>

        {/* Operational Focus Areas */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8">
          <div className="max-w-xl mb-6">
            <span className="section-label bg-red-50 border border-red-200/80 text-brand-red mb-2">Operational Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
              Delivering Sustainable Solutions
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.title} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-navy/30 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-brand-navy flex items-center justify-center mb-3 group-hover:bg-brand-navy group-hover:text-white transition-colors shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 font-serif">{area.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{area.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
