import { motion } from "framer-motion";
import { HOME_TRUST_METRICS } from "@/data/vfraServices";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

export function TrustMetricsSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-8 md:py-12 lg:py-16 border-b border-border bg-surface mt-10">
      <div className="container px-4">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {HOME_TRUST_METRICS.map((metric) => (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              className="text-center p-6 rounded-xl border border-border bg-card/50"
            >
              <p className="font-heading text-[28px] md:text-4xl font-bold text-primary mb-2">
                {metric.value}
                {metric.suffix ?? ""}
              </p>
              <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
