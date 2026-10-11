import { Link } from "react-router-dom";
import {
  ArrowRight,
  Smartphone,
  Bitcoin,
  Mic,
  FileCheck,
  GraduationCap,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

const FEATURED_SERVICES = [
  {
    number: "01",
    code: "SRV-01",
    title: "Mobile Device Extraction & Unlocking",
    category: "Digital Forensics",
    description:
      "Logical and physical mobile acquisition, deleted artifact recovery, and forensic examination for Android and iOS devices.",
    icon: Smartphone,
    link: "/services",
  },
  {
    number: "02",
    code: "SRV-17",
    title: "Blockchain & Cryptocurrency Fraud Analysis",
    category: "Financial Investigation",
    description:
      "On-chain transaction tracing, wallet attribution, fund-flow reconstruction, and virtual digital asset investigation.",
    icon: Bitcoin,
    link: "/services",
  },
  {
    number: "03",
    code: "SRV-19",
    title: "Voice Recording Forensics & Transcription",
    category: "Media Forensics",
    description:
      "Audio authenticity examination, spectral enhancement, speaker analysis support, and court-ready transcription.",
    icon: Mic,
    link: "/services",
  },
  {
    number: "04",
    code: "SRV-21",
    title: "Section 65B / BSA 2023 Certification",
    category: "Legal Support",
    description:
      "Legally compliant electronic evidence certification, hash verification logs, and technical documentation for court proceedings.",
    icon: FileCheck,
    link: "/services",
  },
  {
    number: "05",
    code: "SRV-24",
    title: "Law Enforcement Training Programmes",
    category: "Capacity Building",
    description:
      "Specialized practical workshops covering cybercrime investigation, CDR/IPDR analysis, OSINT, and evidence handling.",
    icon: GraduationCap,
    link: "/services",
  },
  {
    number: "06",
    code: "SRV-26",
    title: "Corporate Digital Forensics & Incident Response",
    category: "Enterprise Services",
    description:
      "Rapid breach containment, insider threat investigation, forensic imaging, and root-cause analysis for enterprises.",
    icon: Building2,
    link: "/services",
  },
];

export function ServicesSection() {
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
          {/* Header */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-12 border-b border-[#E5E5E3]"
          >
            <div>
              <span className="section-eyebrow">03 // FORENSIC CATALOGUE</span>
              <h2 className="section-heading">
                Comprehensive Investigation Support.
              </h2>
            </div>
            <Link to="/services">
              <Button
                variant="outline"
                className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-[0.1em] h-11 px-6 gap-2"
              >
                View All 26 Services
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>

          {/* 3-Column Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.number}
                  variants={fadeUp}
                  className="group premium-card p-6 md:p-7 flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E5E5E3]">
                      <span className="font-mono text-[11px] font-semibold text-[#111111] px-2 py-0.5 bg-[#F7F7F5] border border-[#E5E5E3]">
                        {service.code}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#555555]">
                        {service.category}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-md bg-[#F7F7F5] border border-[#E5E5E3] flex items-center justify-center mb-4 group-hover:bg-[#111111] group-hover:text-white transition-colors duration-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-heading font-semibold text-lg text-[#111111] mb-2.5 tracking-[-0.02em]">
                      {service.title}
                    </h3>

                    <p className="text-sm text-[#555555] leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E3] flex items-center justify-between gap-3">
                    <Link
                      to="/submit-case"
                      className="font-mono text-[11px] uppercase tracking-[0.1em] font-semibold text-[#111111] hover:underline"
                    >
                      Register Case
                    </Link>
                    <Link
                      to={service.link}
                      className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#555555] group-hover:text-[#111111] transition-colors"
                    >
                      Specifications
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
