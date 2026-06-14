import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { HeroParallaxBackground } from "@/components/visuals/HeroParallaxBackground";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden flex flex-col justify-center bg-[#0A0A0A] min-h-[80svh] md:min-h-[90vh] border-b border-border pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div
        className="absolute top-0 right-0 bottom-0 z-0 h-full w-full md:w-[82%] opacity-90 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <HeroParallaxBackground />
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/72 to-[#0A0A0A]/10"
        aria-hidden
      />

      <div className="relative z-20 container mx-auto px-6 pt-12 pb-8 sm:px-8 md:pt-12 md:pb-20 lg:px-12 lg:pt-16 lg:pb-24 xl:px-16 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 flex flex-col items-center text-center md:items-start md:text-left md:border-l-2 md:border-primary md:pl-4"
          >
            <div className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-sm border-l-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-transparent mb-2 md:mb-1">
              <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] tracking-[0.2em] uppercase">VFRA</span>
            </div>
            <p className="mt-1 max-w-md text-[13px] md:text-sm text-muted-foreground font-medium">
              Vigilant Forensic Research and Analytics Pvt. Ltd.
            </p>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-[32px] sm:text-[36px] leading-[1.15] text-center px-1 md:px-0 md:text-5xl lg:text-[3.3rem] md:leading-[1.08] md:text-left font-bold text-foreground tracking-[-0.02em] md:tracking-[-0.04em] mb-4 md:mb-5"
          >
            Digital Forensics, Cybercrime Investigation & Intelligence Solutions
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 mb-8 md:mb-5 text-[15px] sm:text-[16px] text-center px-2 md:px-0 mx-auto md:text-lg md:text-left md:max-w-lg md:mx-0 text-[#70707d] md:text-muted-foreground leading-relaxed"
          >
            VFRA delivers digital forensics, cybercrime investigation, intelligence analysis and secure evidence workflows for enterprises, legal teams, institutions and investigative operations.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col gap-[12px] w-full md:flex-row md:w-auto md:gap-3 px-2 md:px-0"
          >
            <Link to="/submit-case" className="w-full md:w-auto">
              <Button size="lg" className="btn-gold gap-2 w-full md:w-auto px-6 h-12">
                Register a Case
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link to="/services" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="btn-outline-gold w-full md:w-auto px-6 h-12"
              >
                Explore Services
              </Button>
            </Link>

          </motion.div>
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none"
        aria-hidden
      />
    </section>
  );
}
