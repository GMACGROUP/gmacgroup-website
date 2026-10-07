import Link from "next/link";
import { ArrowRight } from "@/sections/hero/Hero";

export function CtaBanner() {
  return (
    <section className="border-t border-line bg-mist">
      <div className="wrap flex flex-col gap-10 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl">
            Have a question about talent, evidence or investment in Africa?
          </h2>
          <p className="mt-4 text-lg text-ink-500">Tell us what you are working on and the right specialist will get back to you.</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn-primary">
            Contact our team
            <ArrowRight />
          </Link>
          <Link href="/programmes" className="btn-secondary">
            View programmes
          </Link>
        </div>
      </div>
    </section>
  );
}
