import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { HeroParallaxBackground } from "@/components/visuals/HeroParallaxBackground";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] min-h-[720px] md:min-h-[90vh] border-b border-border">
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

      <div className="relative z-20 container mx-auto px-6 pt-6 pb-14 sm:px-8 md:pt-12 md:pb-20 lg:px-12 lg:pt-16 lg:pb-24 xl:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 border-l-2 border-primary pl-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              VFRA
            </p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Vigilant Forensic Research and Analytics Pvt. Ltd.
            </p>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] font-bold text-foreground leading-[1.08] tracking-[-0.04em] mb-5"
          >
            Digital Forensics, Cybercrime Investigation & Intelligence Solutions
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            VFRA delivers digital forensics, cybercrime investigation, intelligence analysis and secure evidence workflows for enterprises, legal teams, institutions and investigative operations.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3"
          >
            <Link to="/submit-case" className="w-full sm:w-auto">
              <Button size="lg" className="btn-gold gap-2 px-6 w-full sm:w-auto">
                Register a Case
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link to="/services" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="btn-outline-gold px-6 w-full sm:w-auto"
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
