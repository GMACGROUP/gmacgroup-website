import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@/sections/hero/Hero";

const practiceAreas = [
  {
    title: "Applied research and policy consulting",
    description: "Decision ready evidence, produced inside the markets it describes.",
    image: "/images/service-policy-research.jpg",
  },
  {
    title: "Institutional capacity building",
    description: "Training systems your institution can own, operate and sustain.",
    image: "/images/service-capacity-building.jpg",
  },
  {
    title: "Human capital and workforce consulting",
    description: "Workforce decisions made with a real view of the talent market.",
    image: "/images/service-workforce-consulting.jpg",
  },
  {
    title: "Employability programmes",
    description: "Structured routes from university application to career progression.",
    image: "/images/service-employability.jpg",
  },
  {
    title: "Signature events and workshops",
    description: "Convenings that put the right stakeholders in the room.",
    image: "/images/service-signature-events.jpg",
  },
  {
    title: "Investment facilitation",
    description: "Connecting global capital to screened, investable African projects.",
    image: "/images/service-investment-capital.jpg",
  },
];

export function EcosystemSection() {
  return (
    <section className="site-section bg-mist">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">What we do</p>
            <h2 className="section-title mt-5">Six practice areas. One standard.</h2>
            <p className="section-subtitle mt-5">
              The same specialists build people and build the evidence institutions need to deploy them well. That is
              why our advice holds up.
            </p>
          </div>
          <Link href="/services" className="link-arrow shrink-0">
            All services
            <ArrowRight />
          </Link>
        </div>

        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((item, i) => (
            <Link key={item.title} href="/services" className="group flex flex-col bg-white">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <span className="text-sm font-medium text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-semibold leading-snug text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-500">{item.description}</p>
                <span className="link-arrow mt-7 group-hover:text-accent">
                  Learn more
                  <ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
