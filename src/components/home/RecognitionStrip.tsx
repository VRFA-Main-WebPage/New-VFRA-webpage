import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Building2, Award, FileCheck2 } from "lucide-react";

export function RecognitionStrip() {
  return (
    <section className="bg-white border-b border-[#E5E5E3] py-8 md:py-12 transition-colors">
      <div className="container space-y-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={staggerContainer}
          className="space-y-10"
        >
          {/* 1. Incubation & Institutional Support Showcase */}
          <div className="space-y-4">
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5E3]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] font-semibold">
                  INCUBATION &amp; INSTITUTIONAL SUPPORT
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
                Government of India · NITI Aayog · IIM Nagpur
              </span>
            </motion.div>

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
          </div>

          {/* 2. Corporate Registrations & Recognitions */}
          <div className="space-y-4 pt-4">
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 pb-3 border-b border-[#E5E5E3]"
            >
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] font-semibold">
                  Corporate Registrations &amp; Recognitions
                </h2>
                <p className="text-xs text-[#555555] mt-0.5">
                  Company incorporation, startup recognition and enterprise registration details.
                </p>
              </div>
              <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider hidden sm:inline">
                Verified Entity Standards
              </span>
            </motion.div>

            {/* 3 Neutral Registrations Cards (Simple Text Labels & Neutral Icons — No Government Logos) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {/* Card 1: MCA registered */}
              <motion.div
                variants={fadeUp}
                className="group relative p-5 rounded-xl bg-[#FAF9F6] hover:bg-white border border-[#E5E5E3] hover:border-[#111111] shadow-2xs hover:shadow-xs transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-white border border-[#E5E5E3] group-hover:border-[#111111] group-hover:bg-[#111111] flex items-center justify-center transition-colors shadow-2xs">
                    <Building2 className="h-5 w-5 text-[#111111] group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5 rounded bg-white border border-[#E5E5E3] text-[#555555]">
                    INCORPORATED
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-base text-[#111111] leading-tight mb-1 group-hover:text-[#825816] transition-colors">
                  MCA registered
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Private Limited Company incorporated under the Companies Act, 2013.
                </p>
                <div className="mt-3 pt-3 border-t border-[#EAE9E4] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span>Ministry of Corporate Affairs</span>
                  <span className="text-[#111111] font-semibold">Govt. of India</span>
                </div>
              </motion.div>

              {/* Card 2: DPIIT-recognised startup */}
              <motion.div
                variants={fadeUp}
                className="group relative p-5 rounded-xl bg-[#FAF9F6] hover:bg-white border border-[#E5E5E3] hover:border-[#111111] shadow-2xs hover:shadow-xs transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-white border border-[#E5E5E3] group-hover:border-[#111111] group-hover:bg-[#111111] flex items-center justify-center transition-colors shadow-2xs">
                    <Award className="h-5 w-5 text-[#111111] group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5 rounded bg-white border border-[#E5E5E3] text-[#555555]">
                    STARTUP INDIA
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-base text-[#111111] leading-tight mb-1 group-hover:text-[#825816] transition-colors">
                  DPIIT-recognised startup
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Recognised startup under the Department for Promotion of Industry and Internal Trade.
                </p>
                <div className="mt-3 pt-3 border-t border-[#EAE9E4] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span>Department for Promotion of Industry</span>
                  <span className="text-[#111111] font-semibold">Govt. of India</span>
                </div>
              </motion.div>

              {/* Card 3: Udyam-registered enterprise */}
              <motion.div
                variants={fadeUp}
                className="group relative p-5 rounded-xl bg-[#FAF9F6] hover:bg-white border border-[#E5E5E3] hover:border-[#111111] shadow-2xs hover:shadow-xs transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-white border border-[#E5E5E3] group-hover:border-[#111111] group-hover:bg-[#111111] flex items-center justify-center transition-colors shadow-2xs">
                    <FileCheck2 className="h-5 w-5 text-[#111111] group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5 rounded bg-white border border-[#E5E5E3] text-[#555555]">
                    MSME ENTERPRISE
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-base text-[#111111] leading-tight mb-1 group-hover:text-[#825816] transition-colors">
                  Udyam-registered enterprise
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Valid enterprise registration under the Ministry of Micro, Small and Medium Enterprises.
                </p>
                <div className="mt-3 pt-3 border-t border-[#EAE9E4] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span>Ministry of MSME</span>
                  <span className="text-[#111111] font-semibold">Govt. of India</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
