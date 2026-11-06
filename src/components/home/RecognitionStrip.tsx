import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Building2, Award, FileCheck2 } from "lucide-react";

export function RecognitionStrip() {
  return (
    <section className="bg-white border-b border-[#E5E5E3] py-8 md:py-10 transition-colors">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {/* Corporate Registrations & Recognitions */}
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
          </motion.div>
        </div>
      </section>
    );
  }
