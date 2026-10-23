import { Check, Building2, Scale, GraduationCap, Briefcase, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useWebsiteContent, defaultTrustContent, TrustContent } from "@/hooks/useWebsiteContent";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";
import maharashtraPoliceLogo from "@/assets/partners/maharashtra-police.webp";
import nagpurPoliceLogo from "@/assets/partners/nagpur-police.webp";

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
                  className="forensic-thin-card group p-6"
                >
                  {/* Thin Orbiting Laser Beam */}
                  <div
                    className="thin-border-beam"
                    style={{ animationDelay: `${index * 1.05}s` }}
                  />

                  {/* Thin Structural Outline */}
                  <div className="thin-card-outline" />

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-md bg-white border border-[#E5E5E3] flex items-center justify-center group-hover:border-[#D4AF37] transition-colors">
                        <IconComponent className="h-5 w-5 text-[#111111] group-hover:text-[#825816] transition-colors" />
                      </div>
                      <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-widest group-hover:text-[#825816] transition-colors">
                        SECTOR 0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-base text-[#111111] mb-1 group-hover:text-[#825816] transition-colors">
                      {client.label}
                    </h3>
                    <p className="text-xs text-[#555555] leading-relaxed">
                      {client.description}
                    </p>
                  </div>
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
                { logo: "/maharashtra-police-transparent.webp", name: "Maharashtra Police" },
                { logo: "/nagpur-police-transparent.webp", name: "Nagpur City Police" },
              ].map((partner, index) => (
                <div
                  key={partner.name}
                  className="accreditation-nobg-card group relative min-w-[270px] p-4 flex items-center gap-4 bg-transparent cursor-pointer overflow-hidden rounded-xl"
                >
                  {/* Orbiting Laser Comet Beam */}
                  <div
                    className="accreditation-beam-mask"
                    style={{ animationDelay: `${index * 1.5}s` }}
                  />

                  {/* Structural Border Outline */}
                  <div className="accreditation-card-outline" />

                  {/* 100% Transparent, Much Bigger Logo (No Bounding Box) */}
                  <div className="logo-box-transparent w-16 h-16 sm:w-20 sm:h-16 flex items-center justify-center shrink-0">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-grow relative z-10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[9px] font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        ACTIVE
                      </span>
                    </div>
                    <h4 className="font-heading font-semibold text-sm sm:text-[15px] text-[#111111] group-hover:text-[#825816] transition-colors leading-tight">
                      {partner.name}
                    </h4>
                    <p className="font-mono text-[10px] text-[#555555] uppercase tracking-wider mt-0.5">
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
