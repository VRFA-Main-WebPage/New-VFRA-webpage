import { SEO } from "@/components/SEO";
import { HeroSection } from "@/components/home/HeroSection";
import { RecognitionStrip } from "@/components/home/RecognitionStrip";
import { ProductsSection } from "@/components/home/ProductsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyVFRASection } from "@/components/home/WhyVFRASection";
import { ProcessTimelineSection } from "@/components/home/ProcessTimelineSection";
import { CertificateCTASection } from "@/components/home/CertificateCTASection";
import { EventsPreviewSection } from "@/components/home/EventsPreviewSection";
import { TrustSection } from "@/components/home/TrustSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <SEO title="VFRA | Digital Forensics, Cybercrime Investigation & Intelligence Solutions" description="VFRA provides digital forensics, cybercrime investigation support, forensic reporting, intelligence workflows..." />
      <>
      <HeroSection />
      <RecognitionStrip />
      <ProductsSection />
      <ServicesSection />
      <WhyVFRASection />
      <ProcessTimelineSection />
      <CertificateCTASection />
      <EventsPreviewSection />
      <TrustSection />
      <CTASection />
    </>
  </>
  );
};

export default Index;
