import { SEO } from "@/components/SEO";
import { HeroSection } from "@/components/home/HeroSection";
import { RecognitionStrip } from "@/components/home/RecognitionStrip";
import { ProductsSection } from "@/components/home/ProductsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyVFRASection } from "@/components/home/WhyVFRASection";
import { ProcessTimelineSection } from "@/components/home/ProcessTimelineSection";
import { EventsPreviewSection } from "@/components/home/EventsPreviewSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { TrustSection } from "@/components/home/TrustSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <SEO
        title="VFRA | Vigilant Forensic Research & Analytics Nagpur"
        description="Vigilant Forensic Research and Analytics Pvt. Ltd. (Nagpur) provides digital forensics, cybercrime investigation support, forensic reporting, and intelligence workflows."
      />
      <HeroSection />
      <RecognitionStrip />
      <ProductsSection />
      <ServicesSection />
      <WhyVFRASection />
      <ProcessTimelineSection />
      {/* Note: CertificateCTASection (Track Case & Verify Certificate portal) is preserved in src/components/home/CertificateCTASection.tsx for quick re-enabling */}
      <EventsPreviewSection />
      <GalleryPreviewSection />
      <TrustSection />
      <CTASection />
    </>
  );
};

export default Index;
