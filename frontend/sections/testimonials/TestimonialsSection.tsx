import Image from "next/image";
import { AwardIcon } from "@/components/common/Icons";

const testimonials = [
  {
    quote:
      "GMAC GROUP's Career Readiness Lab completely transformed how our graduates transition into the workforce. The practical framework, econometric grounding, and institutional mentorship are second to none.",
    author: "Dr. Kwesi Mensah",
    role: "Dean of Academic Affairs, West Africa Institute",
    badge: "Institutional Partner",
    badgeColor: "bg-blue-50 text-brand-navy border-blue-200",
    accentColor: "bg-brand-navy",
    image: "/images/testimonial-mensah.jpg",
  },
  {
    quote:
      "The Research and Impact Fellowship gave me direct hands-on experience on complex human-capital studies. It accelerated my entry into international policy consulting with measurable authority.",
    author: "Ama Serwaa",
    role: "Policy Analyst & Fellowship Alum",
    badge: "Fellowship Graduate",
    badgeColor: "bg-red-50 text-brand-red border-red-200",
    accentColor: "bg-brand-red",
    image: "/images/about-team.jpg",
  },
  {
    quote:
      "Their strategic talent advisory provided our executive leadership team with data-driven workforce planning models that reduced time-to-competence and elevated operational capability across our pan-African teams.",
    author: "Marcus Chen",
    role: "Chief People Officer, Apex Global Ventures",
    badge: "Advisory Client",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accentColor: "bg-emerald-500",
    image: "/images/services-advisory.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-24 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="section-label text-brand-red block mb-2">Voices of Impact</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Trusted by Leaders, Scholars & Institutions
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Real outcomes from our institutional partners, fellowship alumni, and advisory clients.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-navy/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Top accent */}
              <div className={`h-1.5 w-full ${t.accentColor}`} />

              <div className="flex flex-col flex-1 p-7">
                {/* Five Star Rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-serif italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author & Portrait */}
                <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0 shadow-sm">
                      <Image
                        src={t.image}
                        alt={t.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{t.author}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                  <span className={`badge ${t.badgeColor} text-[10px] whitespace-nowrap`}>
                    {t.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
