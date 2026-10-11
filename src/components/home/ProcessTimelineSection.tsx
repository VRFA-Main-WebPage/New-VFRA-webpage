import { motion } from "framer-motion";
import { FORENSIC_PROCESS_STEPS } from "@/data/vfraServices";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

export function ProcessTimelineSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-[#F7F7F5] border-b border-[#E5E5E3]">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-12 border-b border-[#E5E5E3]"
          >
            <div>
              <span className="section-eyebrow">05 // STANDARD OPERATING PROTOCOL</span>
              <h2 className="section-heading">Six-Step Forensic Workflow.</h2>
            </div>
            <p className="text-sm text-[#555555] max-w-md leading-relaxed">
              A disciplined protocol from intake consultation through judicial testimony—engineered for evidentiary integrity and auditability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 border border-[#E5E5E3] bg-white rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E3]">
            {FORENSIC_PROCESS_STEPS.map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="p-6 flex flex-col justify-between hover:bg-[#F7F7F5]/60 transition-colors duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#111111] text-white rounded-sm">
                      0{item.step}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                      PHASE
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-[#111111] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E5E5E3] flex items-center justify-between font-mono text-[10px] text-[#71717A]">
                  <span>VERIFIED</span>
                  <span>STEP 0{item.step}/06</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
