import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const RECOGNITIONS = [
  { 
    id: "dpiit",
    label: "DPIIT Recognized", 
    image: "/dpiit-logo.jpeg",
    alt: "DPIIT Recognition logo"
  },
  { 
    id: "mca",
    label: "MCA Registered", 
    image: "/mca-logo.jpg",
    alt: "Ministry of Corporate Affairs logo"
  },
  { 
    id: "msme",
    label: "MSME Registered", 
    image: "/msme-logo.jpeg",
    alt: "MSME Registration logo"
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function RecognitionStrip() {
  return (
    <div className="bg-[#050505] border-y border-[rgba(212,175,55,0.18)] py-8 md:py-10 relative z-10">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col items-center justify-center gap-4 md:gap-8"
        >
          {/* Section Label */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mb-1" />
            <h2 className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground text-center">
              Recognized / Registered
            </h2>
          </motion.div>

          {/* Cards Container */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 w-full max-w-4xl px-4 md:px-0">
            {RECOGNITIONS.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariant}
                className={`group flex flex-col justify-start items-center bg-[#0A0A0A] border border-[rgba(212,175,55,0.28)] rounded-xl md:rounded-2xl p-3 md:p-5 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 w-full h-full ${
                  index === 2 ? "col-span-2 md:col-span-1 max-w-[50%] mx-auto md:max-w-none" : ""
                }`}
              >
                {/* Image Container */}
                <div className="w-full h-14 md:h-24 bg-white rounded-lg md:rounded-xl p-2 md:p-3 flex items-center justify-center mb-2 md:mb-4 overflow-hidden shadow-inner">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                
                {/* Caption */}
                <p className="text-foreground/90 font-semibold text-[10px] sm:text-[11px] md:text-sm tracking-tight md:tracking-wide text-center uppercase leading-tight md:leading-normal w-full px-0.5 mt-auto">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
