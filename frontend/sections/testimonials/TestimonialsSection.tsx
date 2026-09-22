"use client";

import { useEffect, useState } from "react";

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

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function TestimonialsSection() {
  const [activePerson, setActivePerson] = useState(0);

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActivePerson((current) => (current + 1) % people.length);
    }, 4200);
    return () => window.clearInterval(rotation);
  }, []);

  const person = people[activePerson];
  const move = (direction: number) => {
    setActivePerson((current) => (current + direction + people.length) % people.length);
  };

  return (
    <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <span className="section-label mb-3 border border-blue-200/80 bg-blue-50 text-brand-navy">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-navy" />
            Our people
          </span>
          <h2 className="mt-2 font-serif text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Twenty-two colleagues, ten countries.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            A distributed team building evidence, developing people, and opening doors across Africa and beyond.
          </p>
        </div>

        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-card">
          <div className="h-1.5 w-full" style={{ backgroundColor: person.accent }} />
          <div className="flex min-h-[320px] flex-col justify-between p-7 sm:min-h-[300px] sm:p-10">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: person.accent }}>
                  Unit {person.unitNumber}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{person.unit}</p>
              </div>
              <span className="font-serif text-6xl font-bold leading-none text-slate-200" aria-hidden="true">
                {person.unitNumber}
              </span>
            </div>

            <div className="mt-8 flex items-center gap-5">
              <div
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-white text-2xl font-bold text-white shadow-md"
                style={{ backgroundColor: person.accent }}
                aria-hidden="true"
              >
                {initials(person.name)}
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{person.name}</h3>
                <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">{person.role} · {person.country}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {String(activePerson + 1).padStart(2, "0")} / {String(people.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                  aria-label="Previous colleague"
                >
                  <span aria-hidden="true" className="text-xl leading-none">&larr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                  aria-label="Next colleague"
                >
                  <span aria-hidden="true" className="text-xl leading-none">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
