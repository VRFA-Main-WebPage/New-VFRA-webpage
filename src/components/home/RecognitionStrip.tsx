import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const RECOGNITIONS = [
  {
    id: "dpiit",
    code: "REG-01",
    label: "DPIIT Recognized Startup",
    sublabel: "Department for Promotion of Industry and Internal Trade",
    image: "/dpiit-logo-transparent.webp",
    alt: "DPIIT Recognition logo",
  },
  {
    id: "mca",
    code: "REG-02",
    label: "MCA Incorporated",
    sublabel: "Ministry of Corporate Affairs, Government of India",
    image: "/mca-logo-transparent.webp",
    alt: "Ministry of Corporate Affairs logo",
  },
  {
    id: "msme",
    code: "REG-03",
    label: "MSME Registered",
    sublabel: "Ministry of Micro, Small & Medium Enterprises",
    image: "/msme-logo-transparent.webp",
    alt: "MSME Registration logo",
  },
];

export function RecognitionStrip() {
  return (
    <section className="bg-white border-b border-[#E5E5E3] py-10 md:py-14 transition-colors">
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
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              01 // INSTITUTIONAL ACCREDITATION &amp; REGISTRATION
            </span>
            <span className="font-mono text-[11px] text-[#555555]">
              GOVERNMENT OF INDIA RECOGNIZED ENTITY
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {RECOGNITIONS.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="accreditation-nobg-card group"
              >
                {/* Hollow Orbiting Laser Comet Beam */}
                <div
                  className="accreditation-beam-mask"
                  style={{ animationDelay: `${index * 1.2}s` }}
                />

                {/* Subtle Structural Border Outline */}
                <div className="accreditation-card-outline" />

                {/* 100% Transparent Logo (No Bounding Box) */}
                <div className="logo-box-transparent">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Card Text */}
                <div className="min-w-0 flex-grow relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] text-[#71717A] tracking-[0.15em] font-bold">
                      {item.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      VERIFIED
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-[15px] text-[#111111] leading-tight mb-0.5 group-hover:text-[#D4AF37] transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-[11.5px] text-[#555555] line-clamp-2 leading-relaxed">
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
