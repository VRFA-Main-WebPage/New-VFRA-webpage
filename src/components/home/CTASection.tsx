import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWebsiteContent, defaultCTAContent, CTAContent } from "@/hooks/useWebsiteContent";
import { fadeUp, useInView } from "@/lib/motion";

export function CTASection() {
  const { content } = useWebsiteContent<CTAContent>("cta", defaultCTAContent);
  const { ref, inView } = useInView();

  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-[#111111] text-white overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="max-w-4xl mx-auto"
        >
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400 mb-3 block">
                {content.badge}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.03em] text-white leading-[1.12] mb-4">
                {content.heading}
              </h2>
              <p className="text-neutral-300 text-base leading-relaxed mb-8 max-w-xl">
                {content.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-7 bg-white text-[#111111] hover:bg-neutral-200 font-medium gap-2"
                  >
                    {content.primaryButtonText}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/submit-case">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-12 px-7 border-neutral-700 bg-transparent text-white hover:bg-neutral-800 hover:text-white font-mono text-xs uppercase tracking-[0.1em]"
                  >
                    Register Case Online
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <a
                href={`tel:${content.emergencyPhone.replace(/\s/g, "")}`}
                className="block p-5 rounded-lg border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                    DIRECT INCIDENT DESK
                  </span>
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <p className="font-mono text-lg font-semibold text-white">
                  {content.emergencyPhone}
                </p>
              </a>

              <a
                href={`mailto:${content.emergencyEmail}`}
                className="block p-5 rounded-lg border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                    OFFICIAL LABORATORY DISPATCH
                  </span>
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <p className="font-mono text-sm font-medium text-white truncate">
                  {content.emergencyEmail}
                </p>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
