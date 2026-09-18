import { Hero } from "@/sections/hero/Hero";
import { ValuePropSection } from "@/sections/value-prop/ValuePropSection";
import { ProgrammesSection } from "@/sections/programmes/ProgrammesSection";
import { EcosystemSection } from "@/sections/ecosystem/EcosystemSection";
import { TestimonialsSection } from "@/sections/testimonials/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValuePropSection />
      <ProgrammesSection />
      <EcosystemSection />
      <TestimonialsSection />
    </>
  );
}
