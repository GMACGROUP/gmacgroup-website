import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/common/PageHeader";
import { MapPinIcon, MailIcon, ClockIcon, SparklesIcon, ShieldCheckIcon } from "@/components/common/Icons";

const contactDetails = [
  {
    icon: MapPinIcon,
    color: "bg-blue-50 text-brand-navy border-blue-200",
    label: "Headquarters & Research Center",
    value: "Accra, Ghana • Pan-African & Global Advisory",
  },
  {
    icon: MailIcon,
    color: "bg-red-50 text-brand-red border-red-200",
    label: "Official Advisory Email",
    value: "info@gmacgroup.org",
  },
  {
    icon: ClockIcon,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Office & Advisory Hours",
    value: "Monday – Friday: 8:30 AM – 5:30 PM GMT",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        badge="Let's Collaborate"
        title="Contact GMAC GROUP"
        subtitle="Reach out for institutional partnerships, bespoke human capital advisory, research collaboration, or fellowship inquiries."
      />

      {/* Main Content Area */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8 items-start">

          {/* ── Left Column: Contact Info ─────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Section label */}
            <div>
              <span className="section-label text-brand-red block mb-1">Direct Contact</span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
                We&apos;re Here to Help
              </h2>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                Our strategic advisory team responds to all inquiries within 24–48 business hours.
              </p>
            </div>

            {/* Advisory Hub Photo */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <Image
                src="/images/services-advisory.jpg"
                alt="GMAC Advisory Office in Accra"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-xs font-bold text-brand-cyan">GMAC Executive Advisory Center</p>
                <p className="text-[11px] text-slate-300">Accra Financial & Innovation District</p>
              </div>
            </div>

            {/* Contact Detail Cards */}
            <div className="space-y-3">
              {contactDetails.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-card"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.label}</h4>
                      <p className="text-slate-600 text-xs mt-0.5 leading-relaxed font-medium">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fellowship Note */}
            <div className="relative bg-brand-navy rounded-2xl p-5 text-white overflow-hidden border border-brand-navyLight/20 shadow-md">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <SparklesIcon className="w-4 h-4 text-brand-cyan" />
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-brand-cyan mb-1">
                    Fellowship & Internship Inquiries
                  </h5>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Applying to open fellowship cohorts or research internships? Please specify the role title in your message subject.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Form ────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card-featured p-5 sm:p-8 lg:p-10">
              <div className="mb-6">
                <span className="section-label text-brand-red block mb-1">Send a Message</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                  Start a Conversation
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Fill in the form below and our team will get back to you promptly.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
