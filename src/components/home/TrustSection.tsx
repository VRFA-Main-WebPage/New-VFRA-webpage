import { Check, Building2, Scale, GraduationCap, Briefcase, LucideIcon } from "lucide-react";
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
    <section className="py-16 md:py-24 lg:py-28 bg-white border-b border-[#E5E5E3]">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          <motion.div variants={fadeUp} className="lg:col-span-6">
            <span className="section-eyebrow">08 // INSTITUTIONAL TRUST</span>
            <h2 className="section-heading mb-5">
              {content.heading}
            </h2>
            <p className="text-base text-[#555555] leading-relaxed mb-8">
              {content.description}
            </p>

            <div className="space-y-3 border-t border-[#E5E5E3] pt-6">
              {content.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-sm bg-[#F7F7F5] border border-[#E5E5E3] flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-[#111111]" />
                  </div>
                  <span className="text-sm text-[#111111] font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {content.clientTypes.map((client, index) => {
              const IconComponent = iconMap[client.icon] || Scale;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="premium-card p-6 bg-[#F7F7F5]/60 hover:bg-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-md bg-white border border-[#E5E5E3] flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-[#111111]" />
                    </div>
                    <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-widest">
                      SECTOR 0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-base text-[#111111] mb-1">
                    {client.label}
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {client.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Agencies Engaged */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 pt-12 border-t border-[#E5E5E3]"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] font-semibold">
                LAW ENFORCEMENT &amp; INSTITUTIONAL COLLABORATION
              </p>
              <p className="text-xs text-[#555555] mt-1">
                Supporting authorized cybercrime units and investigative departments across Maharashtra.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {[
                { logo: maharashtraPoliceLogo, name: "Maharashtra Police" },
                { logo: nagpurPoliceLogo, name: "Nagpur City Police" },
              ].map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center gap-4 px-5 py-3 bg-[#F7F7F5] border border-[#E5E5E3] rounded-lg"
                >
                  <div className="h-12 w-12 bg-white border border-[#E5E5E3] rounded p-1.5 flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-xs text-[#111111]">
                      {partner.name}
                    </p>
                    <p className="font-mono text-[10px] text-[#555555] uppercase tracking-wider">
                      Law Enforcement
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
