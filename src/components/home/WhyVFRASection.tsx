import { Check, Scale, Building2, Shield, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

const reasons = [
  {
    code: "STD-01",
    icon: Shield,
    title: "Evidentiary Integrity",
    description:
      "Strict chain-of-custody logging and cryptographic hash verification applied throughout acquisition and examination.",
  },
  {
    code: "STD-02",
    icon: FileText,
    title: "Court-Ready Documentation",
    description:
      "Technical reports structured for judicial review with transparent methodology and reproducible findings.",
  },
  {
    code: "STD-03",
    icon: Scale,
    title: "Legal & LEA Alignment",
    description:
      "Investigative workflows tailored for advocates, law enforcement units, and authorized investigative teams.",
  },
  {
    code: "STD-04",
    icon: Building2,
    title: "Institutional Readiness",
    description:
      "Capacity-building workshops, incident response retainers, and forensic laboratory advisory for institutions.",
  },
];

export function WhyVFRASection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-white border-b border-[#E5E5E3]">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <span className="section-eyebrow">04 // CLINICAL TRANSPARENCY</span>
            <h2 className="section-heading mb-5">
              Uncompromising Forensic Discipline.
            </h2>
            <p className="text-base text-[#555555] leading-relaxed mb-8">
              Inspired by laboratory-grade transparency, VFRA operates on verifiable evidence standards—combining forensic workstation capability with accountable case management.
            </p>
            <div className="border-t border-[#E5E5E3] pt-6 space-y-3.5">
              {[
                "No exaggerated claims or unverified assumptions",
                "Lawful-use and authorization-first engagement protocol",
                "Scientific examination and documentation — never unauthorized surveillance",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-[#111111]">
                  <div className="w-5 h-5 rounded-sm bg-[#F7F7F5] border border-[#E5E5E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#111111]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
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
                      <div className="w-9 h-9 rounded-md bg-white border border-[#E5E5E3] flex items-center justify-center group-hover:border-[#D4AF37] transition-colors">
                        <Icon className="h-4 w-4 text-[#111111] group-hover:text-[#825816] transition-colors" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] group-hover:text-[#825816] transition-colors">
                        {reason.code}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-base text-[#111111] mb-2 group-hover:text-[#825816] transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-[#555555] leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
