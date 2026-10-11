import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const RECOGNITIONS = [
  {
    id: "dpiit",
    code: "REG-01",
    label: "DPIIT Recognized Startup",
    sublabel: "Department for Promotion of Industry and Internal Trade",
    image: "/dpiit-logo.jpeg",
    alt: "DPIIT Recognition logo",
  },
  {
    id: "mca",
    code: "REG-02",
    label: "MCA Incorporated",
    sublabel: "Ministry of Corporate Affairs, Government of India",
    image: "/mca-logo.jpg",
    alt: "Ministry of Corporate Affairs logo",
  },
  {
    id: "msme",
    code: "REG-03",
    label: "MSME Registered",
    sublabel: "Ministry of Micro, Small & Medium Enterprises",
    image: "/msme-logo.jpeg",
    alt: "MSME Registration logo",
  },
];

export function RecognitionStrip() {
  return (
    <section className="bg-white border-b border-[#E5E5E3] py-10 md:py-14">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
          className="space-y-6"
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E5E3]"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] font-semibold">
              01 // INSTITUTIONAL ACCREDITATION &amp; REGISTRATION
            </span>
            <span className="font-mono text-[11px] text-[#555555]">
              GOVERNMENT OF INDIA RECOGNIZED ENTITY
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {RECOGNITIONS.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="group flex items-center gap-4 bg-[#F7F7F5] border border-[#E5E5E3] rounded-lg p-4 hover:bg-white hover:border-[#111111] transition-all duration-300"
              >
                <div className="w-20 h-16 bg-white border border-[#E5E5E3] rounded-md p-2 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-widest block">
                    {item.code}
                  </span>
                  <h3 className="font-heading font-semibold text-sm text-[#111111] truncate">
                    {item.label}
                  </h3>
                  <p className="text-xs text-[#555555] line-clamp-1 mt-0.5">
                    {item.sublabel}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
