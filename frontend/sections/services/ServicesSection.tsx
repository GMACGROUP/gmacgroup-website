import Link from "next/link";
import Image from "next/image";
import { AcademicCapIcon, MicroscopeIcon, BriefcaseIcon } from "@/components/common/Icons";

export function ServicesSection() {
  const services = [
    {
      id: "service-research",
      slug: "applied-research-and-policy-consulting",
      title: "Applied Research and Policy Consulting",
      summary: "Decision-ready evidence produced inside the markets it describes.",
      description: "Baseline studies, evaluations, labour market assessments, sector diagnostics, policy briefs, and feasibility work for institutions with high-stakes decisions to defend.",
      icon: MicroscopeIcon,
      badge: "Research",
      badgeColor: "bg-blue-50 text-brand-navy border-blue-200",
      accent: "bg-brand-navy",
      image: "/images/research-center.jpg",
    },
    {
      id: "service-capacity",
      slug: "institutional-capacity-building",
      title: "Institutional Capacity Building",
      summary: "Training systems and methods that institutions can own and sustain.",
      description: "Research methods training, programme design, monitoring and evaluation systems, facilitator development, and phased delivery with review points and handover.",
      icon: AcademicCapIcon,
      badge: "Capacity",
      badgeColor: "bg-red-50 text-brand-red border-red-200",
      accent: "bg-brand-red",
      image: "/images/services-lab.jpg",
    },
    {
      id: "service-workforce",
      slug: "human-capital-and-workforce-consulting",
      title: "Human Capital and Workforce Consulting",
      summary: "Workforce decisions made with a real view of the talent market.",
      description: "Graduate intake design, internship pipelines, talent assessments, employability audits, and market-entry talent strategy for employers operating in African markets.",
      icon: BriefcaseIcon,
      badge: "Workforce",
      badgeColor: "bg-sky-50 text-brand-navy border-sky-200",
      accent: "bg-brand-cyan",
      image: "/images/services-advisory.jpg",
    },
    {
      id: "service-employability",
      slug: "employability-programmes",
      title: "Employability Programmes",
      summary: "Structured routes from application to offer, and from offer to progression.",
      description: "Cohort-based career coaching, profiling, interview preparation, internship placement support, and professional positioning for graduates and young professionals.",
      icon: AcademicCapIcon,
      badge: "Employability",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "bg-emerald-500",
      image: "/images/services-lab.jpg",
    },
    {
      id: "service-events",
      slug: "signature-events-and-workshops",
      title: "Signature Events and Workshops",
      summary: "Convenings that put the right room together and keep it engaged.",
      description: "Flagship annual events, recurring series, specialist workshops, and sponsorship properties designed for institutions and individuals across Africa.",
      icon: BriefcaseIcon,
      badge: "Events",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      accent: "bg-purple-500",
      image: "/images/services-advisory.jpg",
    },
    {
      id: "service-investment",
      slug: "investment-facilitation-and-capital-mobilisation",
      title: "Investment Facilitation and Capital Mobilisation",
      summary: "African capital, African projects, African returns.",
      description: "Deal sourcing and screening, investment readiness support, due diligence, investor matching, and capital mobilisation across select African markets.",
      icon: MicroscopeIcon,
      badge: "Investment",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "bg-amber-500",
      image: "/images/research-center.jpg",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label text-brand-red block mb-2">
            What We Do
          </span>
          <h2 className="section-title">
            Our Core Strategic Services
          </h2>
          <p className="section-subtitle mx-auto mt-3">
            Delivering measurable value across education, scientific research, and talent strategy.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Photo Banner */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${service.badgeColor} font-bold shadow-sm`}>
                      {service.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white">
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">Strategic Practice</span>
                  </div>
                </div>

                {/* Top accent */}
                <div className={`h-1 w-full ${service.accent}`} />

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-navy transition-colors font-serif leading-snug">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    {service.summary}
                  </p>
                  <p className="mt-2 text-slate-500 text-xs leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Action Link */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/services#${service.slug}`}
                      className="inline-flex items-center text-sm font-bold text-brand-navy group-hover:text-brand-red transition-colors"
                    >
                      Explore Service
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
