import { CheckCircle, Building2, Scale, GraduationCap, Briefcase, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useWebsiteContent, defaultTrustContent, TrustContent } from "@/hooks/useWebsiteContent";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";
import maharashtraPoliceLogo from "@/assets/partners/maharashtra-police.jpg";
import nagpurPoliceLogo from "@/assets/partners/nagpur-police.jpg";

const iconMap: Record<string, LucideIcon> = {
  Scale,
  Building2,
  Briefcase,
  GraduationCap,
};

export function TrustSection() {
  const { content } = useWebsiteContent<TrustContent>("trust", defaultTrustContent);
  const { ref, inView } = useInView();

  return (
    <section className="py-10 md:py-24 lg:py-32 bg-surface border-b border-border">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp}>
            <p className="section-eyebrow">{content.badge}</p>
            <h2 className="section-heading mb-5">
              {content.heading.replace(content.highlightWord, "").trim()}{" "}
              <span className="text-primary">{content.highlightWord}</span>
            </h2>
            <p className="section-subtext mb-8">{content.description}</p>

            <div className="space-y-3">
              {content.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {content.clientTypes.map((client, index) => {
              const IconComponent = iconMap[client.icon] || Scale;
              return (
                <motion.div key={index} variants={fadeUp} className="premium-card p-5">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">{client.label}</h3>
                  <p className="text-sm text-muted-foreground">{client.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 pt-12 border-t border-border"
        >
          <p className="text-center text-xs text-muted-foreground mb-8 uppercase tracking-widest">
            Institutions & Agencies Engaged
          </p>
          <div className="grid grid-cols-2 lg:flex lg:flex-row items-center justify-center gap-4 lg:gap-16 max-w-2xl mx-auto">
            {[
              { logo: maharashtraPoliceLogo, name: "Maharashtra Police" },
              { logo: nagpurPoliceLogo, name: "Nagpur Police" },
            ].map((partner) => (
              <div key={partner.name} className="flex flex-col items-center gap-2 lg:gap-3 w-full">
                <div className="h-16 lg:h-20 w-full lg:w-48 bg-card border border-border rounded-lg flex items-center justify-center p-2 lg:p-3 shadow-sm">
                  <img src={partner.logo} alt={partner.name} className="h-10 lg:h-14 object-contain" />
                </div>
                <p className="text-[11px] lg:text-sm text-muted-foreground font-medium text-center leading-tight">{partner.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
