import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWebsiteContent, defaultCTAContent, CTAContent } from "@/hooks/useWebsiteContent";
import { fadeUp, useInView } from "@/lib/motion";

export function CTASection() {
  const { content } = useWebsiteContent<CTAContent>("cta", defaultCTAContent);
  const { ref, inView } = useInView();
  const headingParts = content.heading.split(content.highlightWord);

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-hero overflow-hidden border-t border-border">
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="section-eyebrow">{content.badge}</p>
          <h2 className="section-heading mb-5">
            {headingParts[0]}
            <span className="text-primary">{content.highlightWord}</span>
            {headingParts[1]}
          </h2>
          <p className="section-subtext mx-auto mb-10">{content.description}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link to="/contact">
              <Button size="lg" className="btn-gold gap-2 px-8">
                {content.primaryButtonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href={`tel:${content.phoneNumber.replace(/\s/g, "")}`}>
              <Button size="lg" variant="outline" className="btn-outline-gold gap-2 px-8">
                <Phone className="h-4 w-4" />
                {content.phoneNumber}
              </Button>
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <a
              href={`tel:${content.emergencyPhone.replace(/\s/g, "")}`}
              className="premium-card p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Urgent line</p>
                <p className="font-semibold text-foreground text-[15px]">{content.emergencyPhone}</p>
              </div>
            </a>
            <a
              href={`mailto:${content.emergencyEmail}`}
              className="premium-card p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Email</p>
                <p className="font-semibold text-foreground text-[14px] md:text-[15px]">{content.emergencyEmail}</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
