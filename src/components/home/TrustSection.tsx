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
    <section className="py-10 md:py-14 bg-white border-b border-[#E5E5E3]">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start"
        >
          <motion.div variants={fadeUp} className="lg:col-span-6">
            <h2 className="section-heading mb-4">
              {content.heading}
            </h2>
            <p className="text-base text-[#555555] leading-relaxed mb-6">
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
          className="mt-12 pt-8 border-t border-[#E5E5E3]"
        >
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] font-semibold">
              LAW ENFORCEMENT &amp; INSTITUTIONAL COLLABORATION
            </p>
            <p className="text-xs text-[#555555] mt-1.5 max-w-lg leading-relaxed">
              Supporting authorized cybercrime units and investigative departments across Maharashtra.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
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
                <div className="min-w-0 flex-grow relative z-10 text-left">
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
        </motion.div>

        {/* Incubation & Institutional Support Showcase (Below Police Logos) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-12 pt-8 border-t border-[#E5E5E3] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5E3]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] font-semibold">
                INCUBATION &amp; INSTITUTIONAL SUPPORT
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              Government of India · NITI Aayog · IIM Nagpur
            </span>
          </div>

          {/* Logo Placement: AIM on the Left side, AIC-INFED on the Right side (Side-by-side on all screens including mobile) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6">
            {/* Left Side: AIM Logo (Atal Innovation Mission / NITI Aayog) */}
            <motion.div
              variants={fadeUp}
              className="accreditation-nobg-card group p-3 sm:p-5 md:p-6 bg-[#FAF9F6] border border-[#E5E5E3] rounded-xl relative overflow-hidden flex flex-col items-center justify-between text-center gap-2.5 sm:gap-4 hover:border-[#111111] transition-all"
            >
              <div className="accreditation-beam-mask" />
              <div className="accreditation-card-outline" />

              {/* Left Side AIM Logo */}
              <div className="w-full h-14 sm:h-18 md:h-20 shrink-0 flex items-center justify-center p-1">
                <img
                  src="/aim-logo.webp"
                  alt="Atal Innovation Mission (AIM), NITI Aayog Logo"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Information */}
              <div className="min-w-0 w-full relative z-10 text-center space-y-1">
                <span className="font-mono text-[8px] sm:text-[9.5px] uppercase tracking-[0.1em] text-[#825816] font-bold bg-[#FBF5E8] border border-[#ECD9A8] px-1.5 sm:px-2 py-0.5 rounded inline-block">
                  FLAGSHIP INITIATIVE
                </span>
                <h3 className="font-heading font-semibold text-xs sm:text-sm md:text-base text-[#111111] leading-tight group-hover:text-[#825816] transition-colors">
                  Atal Innovation Mission (AIM)
                </h3>
                <p className="font-mono text-[9px] sm:text-[11px] text-[#555555]">
                  NITI Aayog, Government of India
                </p>
              </div>
            </motion.div>

            {/* Right Side: AIC-INFED Logo (AIC-IIM Nagpur Foundation for Entrepreneurship Development) */}
            <motion.div
              variants={fadeUp}
              className="accreditation-nobg-card group p-3 sm:p-5 md:p-6 bg-[#FAF9F6] border border-[#E5E5E3] rounded-xl relative overflow-hidden flex flex-col items-center justify-between text-center gap-2.5 sm:gap-4 hover:border-[#111111] transition-all"
            >
              <div className="accreditation-beam-mask" style={{ animationDelay: "1.2s" }} />
              <div className="accreditation-card-outline" />

              {/* Right Side AIC-INFED Logo */}
              <div className="w-full h-14 sm:h-18 md:h-20 shrink-0 flex items-center justify-center p-1">
                <img
                  src="/aic-infed-logo.webp"
                  alt="AIC-IIM Nagpur Foundation for Entrepreneurship Development Logo"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Information */}
              <div className="min-w-0 w-full relative z-10 text-center space-y-1">
                <span className="font-mono text-[8px] sm:text-[9.5px] uppercase tracking-[0.1em] text-[#825816] font-bold bg-[#FBF5E8] border border-[#ECD9A8] px-1.5 sm:px-2 py-0.5 rounded inline-block">
                  INCUBATION PARTNER
                </span>
                <h3 className="font-heading font-semibold text-xs sm:text-sm md:text-base text-[#111111] leading-tight group-hover:text-[#825816] transition-colors">
                  AIC-IIM Nagpur Foundation for Entrepreneurship Development
                </h3>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
