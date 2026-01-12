import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TrustSection } from "@/components/home/TrustSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CaseSection } from "@/components/home/CaseSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <CaseSection />
      <TrustSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default Index;
