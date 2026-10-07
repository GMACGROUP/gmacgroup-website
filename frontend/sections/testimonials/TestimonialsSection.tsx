import Link from "next/link";
import { ArrowRight } from "@/sections/hero/Hero";

const people = [
  { name: "Richard", role: "Business Development Intern", country: "Ghana", unit: "Business Development & Partnerships", unitNumber: "01", accent: "#14639A" },
  { name: "Saani", role: "Research Lead", country: "Ghana", unit: "Research", unitNumber: "02", accent: "#E51924" },
  { name: "Oluwafemi", role: "Research Consultant", country: "Nigeria", unit: "Research", unitNumber: "02", accent: "#E51924" },
  { name: "Domson", role: "Research Consultant", country: "United States", unit: "Research", unitNumber: "02", accent: "#E51924" },
  { name: "Evans", role: "Research Consultant", country: "Ghana", unit: "Research", unitNumber: "02", accent: "#E51924" },
  { name: "Benjamin", role: "Research Consultant", country: "Ghana", unit: "Research", unitNumber: "02", accent: "#E51924" },
  { name: "Maureen Mushwimba", role: "Head of Marketing and Communications", country: "Zambia", unit: "Marketing & Communications", unitNumber: "03", accent: "#D7B56D" },
  { name: "Victoria", role: "Marketing and Communications Intern", country: "Ghana", unit: "Marketing & Communications", unitNumber: "03", accent: "#D7B56D" },
  { name: "Favour", role: "Marketing and Communications Intern", country: "Nigeria", unit: "Marketing & Communications", unitNumber: "03", accent: "#D7B56D" },
  { name: "Yolanda", role: "Design Lead", country: "Zimbabwe", unit: "Graphic Design & Web", unitNumber: "04", accent: "#8B5CF6" },
  { name: "Silas", role: "Designer", country: "Rwanda", unit: "Graphic Design & Web", unitNumber: "04", accent: "#8B5CF6" },
  { name: "Christian", role: "Designer", country: "Ghana", unit: "Graphic Design & Web", unitNumber: "04", accent: "#8B5CF6" },
  { name: "Wendy", role: "Designer", country: "Ghana", unit: "Graphic Design & Web", unitNumber: "04", accent: "#8B5CF6" },
  { name: "Maranatha", role: "Design Intern", country: "Ghana", unit: "Graphic Design & Web", unitNumber: "04", accent: "#8B5CF6" },
  { name: "Ramadhani", role: "Programme Manager", country: "Tanzania", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
  { name: "Samantha", role: "Programme Manager", country: "Nigeria", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
  { name: "Edwin", role: "Programme Manager", country: "Cameroon", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
  { name: "Delasi", role: "Programmes Intern", country: "Ghana", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
  { name: "Faustino", role: "Programmes Intern", country: "Burkina Faso", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
  { name: "Richmond", role: "Programmes Intern", country: "Ghana", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
  { name: "Thole", role: "Programmes Intern", country: "Botswana", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
  { name: "Emmanuel", role: "Programmes Intern", country: "Ghana", unit: "Operations & Programmes", unitNumber: "05", accent: "#0EA5A4" },
];

const units = Array.from(new Set(people.map((p) => p.unit))).map((unit) => ({
  unit,
  number: people.find((p) => p.unit === unit)!.unitNumber,
  members: people.filter((p) => p.unit === unit),
}));

const countries = new Set(people.map((p) => p.country)).size;

export function TestimonialsSection() {
  return (
    <section className="site-section bg-white">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Our people</p>
            <h2 className="section-title mt-5">
              {people.length} colleagues, {countries} countries.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-12">
            <p className="section-subtitle">
              A distributed team building evidence, developing people and opening doors across Africa and beyond.
            </p>
            <Link href="/about" className="link-arrow mt-6">
              About GMAC Group
              <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="mt-14 border-t border-ink">
          {units.map((u) => (
            <div key={u.unit} className="grid gap-6 border-b border-line py-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <span className="text-sm font-medium text-accent">{u.number}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{u.unit}</h3>
                <p className="mt-1 text-sm text-ink-400">
                  {u.members.length} {u.members.length === 1 ? "person" : "people"}
                </p>
              </div>
              <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
                {u.members.map((m) => (
                  <li key={m.name + m.role} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-[13px] font-semibold text-ink-600"
                    >
                      {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">{m.name}</p>
                      <p className="text-sm leading-snug text-ink-500">
                        {m.role}, {m.country}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
