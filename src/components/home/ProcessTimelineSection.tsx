import { motion } from "framer-motion";
import { FORENSIC_PROCESS_STEPS } from "@/data/vfraServices";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

export function ProcessTimelineSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 lg:py-32 bg-surface border-b border-border">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <p className="section-eyebrow">Our Methodology</p>
            <h2 className="section-heading mb-4">Six-Step Forensic Process</h2>
            <p className="section-subtext mx-auto">
              A disciplined workflow from consultation through court support — designed for evidentiary integrity
              and professional accountability.
            </p>
          </motion.div>

          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block relative">
            <div className="absolute top-8 left-0 right-0 h-px bg-border" />
            <motion.div
              className="absolute top-8 left-0 h-px bg-primary origin-left"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%" }}
            />
            <div className="grid grid-cols-6 gap-4">
              {FORENSIC_PROCESS_STEPS.map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  className="relative pt-14 text-center"
                >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center font-heading text-sm font-bold text-primary z-10">
                    {item.step}
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-foreground mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="lg:hidden space-y-0">
            {FORENSIC_PROCESS_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center font-heading text-sm font-bold text-primary shrink-0">
                    {item.step}
                  </div>
                  {i < FORENSIC_PROCESS_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-border my-2 min-h-[40px]" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-heading font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
