import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, FileCheck2, Lock, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, APPLE_EASE } from "@/lib/motion";
import { useWebsiteContent, defaultHeroContent, HeroContent } from "@/hooks/useWebsiteContent";
import labSetupImg from "@/assets/services/Labsetup.webp";
import Waves from "@/components/animations/Waves";

export function HeroSection() {
  const { content } = useWebsiteContent<HeroContent>("hero", defaultHeroContent);

  return (
    <section className="relative overflow-hidden bg-[#F7F7F5] border-b border-[#E5E5E3]">
      {/* Subtle Faded Flowing Waves Background (Scoped exclusively to Hero) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
        <Waves
          lineColor="rgba(0, 0, 0, 0.035)"
          accentColor="rgba(212, 175, 55, 0.16)"
          backgroundColor="transparent"
          waveSpeedX={0.012}
          waveSpeedY={0.008}
          waveAmpX={28}
          waveAmpY={14}
          spacing={13}
          lineWidth={0.7}
          amplitude={18}
          speed={0.7}
          mouseInteraction={true}
          mouseRadius={175}
          mouseStrength={0.8}
          clickRipple={true}
          lightMode={false}
          opacity={0.45}
        />
      </div>

      <div className="container relative z-10 pt-6 md:pt-8 lg:pt-10 pb-14 md:pb-20 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Primary Apple-scale Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-heading text-[34px] sm:text-[44px] md:text-[54px] lg:text-[60px] font-semibold text-[#111111] tracking-[-0.035em] leading-[1.06] mb-6"
            >
              Digital Forensics,{" "}
              <span className="text-[#555555] font-normal">
                Cybercrime Investigation
              </span>{" "}
              &amp; Evidentiary Clarity.
            </motion.h1>

            {/* Editorial Subtext */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl mb-9 font-normal"
            >
              {content.description ||
                "Vigilant Forensic Research and Analytics Pvt. Ltd. delivers structured digital evidence examination, cybercrime intelligence, and BSA 2023 / Section 65B compliant technical reporting for law enforcement, legal professionals, and enterprises."}
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-12"
            >
              <Link to="/submit-case" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 bg-[#111111] text-white hover:bg-[#2A2A2A] rounded-md text-sm font-medium gap-2 transition-all duration-300"
                >
                  Register a Case
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to="/services" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-7 border-[#D4D4D0] bg-white text-[#111111] hover:bg-[#F0EFEA] hover:border-[#111111] rounded-md text-sm font-medium transition-all duration-300"
                >
                  Explore Services
                </Button>
              </Link>

              <Link to="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto h-12 px-5 text-[#555555] hover:text-[#111111] hover:bg-white/60 rounded-md font-mono text-xs uppercase tracking-[0.1em]"
                >
                  Upcoming Events →
                </Button>
              </Link>
            </motion.div>

            {/* Beminimalist Ingredient-Style Specification Strip */}
            <motion.div
              variants={fadeUp}
              className="w-full grid grid-cols-2 sm:grid-cols-4 border border-[#E5E5E3] bg-white rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E3]"
            >
              {(content.stats && content.stats.length > 0
                ? content.stats
                : defaultHeroContent.stats
              ).map((stat, idx) => (
                <div key={idx} className="p-4 flex flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#71717A] mb-1">
                    0{idx + 1} / SPEC
                  </span>
                  <span className="font-heading text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#555555] mt-0.5">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Clinical Forensic Dossier Card (Beminimalist + Apple Bento) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: APPLE_EASE }}
            className="lg:col-span-5"
          >
            <div className="bg-white border border-[#E5E5E3] rounded-lg overflow-hidden shadow-[0_20px_50px_-20px_rgba(17,17,17,0.08)]">
              {/* Top Dossier Header */}
              <div className="px-5 py-3.5 border-b border-[#E5E5E3] bg-[#F7F7F5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-[#111111]" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] font-semibold text-[#111111]">
                    LAB SPECIFICATION
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5E5E3] text-[#555555]">
                  ACTIVE
                </span>
              </div>

              {/* Laboratory Visual Frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0EFEA] border-b border-[#E5E5E3]">
                <img
                  src={labSetupImg}
                  alt="VFRA Digital Forensics Laboratory"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                />
              </div>

              {/* Structured Ingredient-Label Specifications */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 pb-3 border-b border-[#E5E5E3]">
                    <ShieldCheck className="h-4 w-4 text-[#111111] shrink-0 mt-0.5" />
                    <div>
                      <p
                        className="text-xs font-semibold text-[#111111] uppercase tracking-wider font-serif"
                        style={{ fontFamily: "'Times New Roman', Times, serif" }}
                      >
                        Chain of Custody Integrity
                      </p>
                      <p className="text-xs text-[#555555] mt-0.5 leading-relaxed">
                        Every storage medium and mobile extraction is logged with cryptographic hash verification from intake to final release.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-[#E5E5E3]">
                    <FileCheck2 className="h-4 w-4 text-[#111111] shrink-0 mt-0.5" />
                    <div>
                      <p
                        className="text-xs font-semibold text-[#111111] uppercase tracking-wider font-serif"
                        style={{ fontFamily: "'Times New Roman', Times, serif" }}
                      >
                        Section 65B / BSA 2023 Admissibility
                      </p>
                      <p className="text-xs text-[#555555] mt-0.5 leading-relaxed">
                        Structured technical reports and electronic evidence certificates formatted for judicial scrutiny across Indian courts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Lock className="h-4 w-4 text-[#111111] shrink-0 mt-0.5" />
                    <div>
                      <p
                        className="text-xs font-semibold text-[#111111] uppercase tracking-wider font-serif"
                        style={{ fontFamily: "'Times New Roman', Times, serif" }}
                      >
                        Authorized Engagement Protocol
                      </p>
                      <p className="text-xs text-[#555555] mt-0.5 leading-relaxed">
                        Dedicated investigative support for Law Enforcement Agencies (LEA), legal counsel, and corporate incident response.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E5E5E3] text-[11px] font-mono text-[#555555]">
                  <span>CIN: U69100PN2025PTC250064</span>
                  <Link
                    to="/gallery"
                    className="text-[#111111] font-semibold hover:underline"
                  >
                    VIEW LAB GALLERY →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
