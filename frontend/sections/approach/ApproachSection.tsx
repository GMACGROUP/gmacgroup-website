import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@/sections/hero/Hero";

const principles = [
  {
    title: "Evidence first",
    body: "Every recommendation is grounded in data collected in the market it concerns.",
  },
  {
    title: "Built to last",
    body: "We design systems and programmes that institutions can run without us.",
  },
  {
    title: "Talent and capital together",
    body: "We see where skills and investment meet, and help both sides move.",
  },
];

export function ApproachSection() {
  return (
    <section className="bg-ink text-white">
      <div className="wrap grid gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-5">
          <p className="eyebrow !text-accent-soft">Our approach</p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.12] text-white sm:text-4xl lg:text-[2.75rem]">
            Advice that holds up, because we do the research ourselves.
          </h2>
          <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/images/research-center.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover opacity-90"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
          <ol className="border-t border-white/20">
            {principles.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/20 py-8">
                <span className="text-sm font-medium text-accent-soft">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/research" className="link-arrow mt-10 !text-white hover:!text-accent-soft">
            See our research
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
