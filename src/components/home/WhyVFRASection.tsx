import { CheckCircle2, Scale, Building2, Shield, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

const reasons = [
  {
    icon: Shield,
    title: "Evidentiary Integrity",
    description:
      "Chain-of-custody protocols and hash verification are applied throughout acquisition and analysis.",
  },
  {
    icon: FileText,
    title: "Court-Ready Documentation",
    description:
      "Reports are structured for legal review, with clear methodology and reproducible findings.",
  },
  {
    icon: Scale,
    title: "Legal & LEA Alignment",
    description:
      "Workflows designed for advocates, institutions, and authorized investigation teams.",
  },
  {
    icon: Building2,
    title: "Institutional Readiness",
    description:
      "Training, incident response, and capacity-building programmes for organizations.",
  },
];

export function WhyVFRASection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 lg:py-32 bg-background border-b border-border">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start"
        >
          <motion.div variants={fadeUp}>
            <p className="section-eyebrow">Why VFRA</p>
            <h2 className="section-heading mb-5">
              Trusted Digital Forensics & Investigation Support
            </h2>
            <p className="section-subtext mb-8">
              VFRA combines forensic laboratory capability with intelligence workflows and secure case
              operations — supporting clients who require professional, accountable investigation assistance.
            </p>
            <ul className="space-y-3">
              {[
                "No exaggerated claims or guaranteed outcomes",
                "Lawful-use and authorization-first engagement",
                "Support, analysis, and documentation — not surveillance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  variants={fadeUp}
                  className="premium-card p-5"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
