import { Hero } from "@/sections/hero/Hero";
import { ValuePropSection } from "@/sections/value-prop/ValuePropSection";
import { EcosystemSection } from "@/sections/ecosystem/EcosystemSection";
import { ApproachSection } from "@/sections/approach/ApproachSection";
import { ProgrammesSection } from "@/sections/programmes/ProgrammesSection";
import { TestimonialsSection } from "@/sections/testimonials/TestimonialsSection";
import { CtaBanner } from "@/sections/cta/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValuePropSection />
      <EcosystemSection />
      <ApproachSection />
      <ProgrammesSection />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
