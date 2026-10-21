import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Shield,
  Network,
  Database,
  Lock,
  Scale,
  Activity,
  Phone,
  Banknote,
  Search,
  MessageSquare,
  ArrowRight,
  Server,
  FileCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function Products() {
  return (
    <>
      <SEO
        title="Forensic Investigation Platforms | InvestiGate & VFRA-TTI | VFRA"
        description="Proprietary forensic software architectures engineered for Indian law enforcement, cybercrime investigators, and security operations: InvestiGate and Telegram Threat Intelligence (VFRA-TTI)."
      />

      <div className="bg-white min-h-screen">
        {/* Hero Header */}
        <section className="relative py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />
          <div className="container relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.span variants={fadeUp} className="section-eyebrow">
                PROPRIETARY SOFTWARE ARCHITECTURES // NATIONAL DEFENSE
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="font-heading text-4xl md:text-5xl lg:text-[54px] font-semibold text-[#111111] tracking-[-0.035em] leading-[1.08] mb-6"
              >
                Engineered for Lawful Cyber Intelligence.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg text-[#555555] leading-relaxed"
              >
                Purpose-built forensic software suites engineered for Indian law enforcement agencies, cyber cells, and institutional investigative workflows under statutory legal compliance.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 2-Column Platform Cards */}
        <section className="py-16 md:py-24 lg:py-28 bg-white border-b border-[#E5E5E3]">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Platform 01: InvestiGate */}
              <div className="premium-card flex flex-col justify-between p-6 md:p-8 lg:p-10 bg-[#F7F7F5]/60 hover:bg-white transition-colors">
                <div>
                  {/* Top Spec Row */}
                  <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5E5E3]">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#111111] text-white rounded-sm">
                        SYS-01
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555]">
                        Cybercrime Investigation Suite
                      </span>
                    </div>
                    <Shield className="h-4 w-4 text-[#111111]" />
                  </div>

                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111111] tracking-[-0.03em] mb-2">
                    InvestiGate
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#555555] mb-4">
                    One Platform. Complete Investigation Workflow.
                  </p>
                  <p className="text-sm text-[#555555] leading-relaxed mb-8">
                    InvestiGate by VFRA is a unified cybercrime investigation platform engineered for Indian law enforcement, cyber cells, and investigation officers. It consolidates telecom analysis, IPDR intelligence, fund-flow tracing, OSINT workflows, and statutory notice generation into one secure environment.
                  </p>

                  {/* Capability Matrix */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[
                      {
                        icon: Phone,
                        title: "Telecom Intelligence",
                        items: ["CDR & IMEI Analysis", "Call Pattern Mapping", "Timeline Reconstruction"],
                      },
                      {
                        icon: Network,
                        title: "IPDR Intelligence",
                        items: ["NAT Log Correlation", "Session Attribution", "High-Volume Log Parsing"],
                      },
                      {
                        icon: Banknote,
                        title: "Financial Tracing",
                        items: ["Multi-Hop Fund Flow", "Beneficiary Identification", "Transaction Graph Mapping"],
                      },
                      {
                        icon: Scale,
                        title: "Statutory Workflow",
                        items: ["BNSS Sec 94 & 106 Notices", "Automated DOCX Output", "Court-Ready Exports"],
                      },
                    ].map((mod) => {
                      const ModIcon = mod.icon;
                      return (
                        <div
                          key={mod.title}
                          className="p-4 rounded-md bg-white border border-[#E5E5E3]"
                        >
                          <div className="flex items-center gap-2 mb-2.5">
                            <ModIcon className="h-3.5 w-3.5 text-[#111111]" />
                            <span className="font-heading text-xs font-semibold text-[#111111]">
                              {mod.title}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {mod.items.map((item) => (
                              <li
                                key={item}
                                className="text-xs text-[#555555] flex items-center gap-2"
                              >
                                <span className="h-1 w-1 rounded-full bg-[#111111]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Architecture & CTA Footer */}
                <div className="pt-6 border-t border-[#E5E5E3] space-y-5">
                  <div className="p-4 rounded-md bg-white border border-[#E5E5E3]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#111111]" />
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#111111]">
                        Zero-Retention In-Session Architecture
                      </span>
                    </div>
                    <p className="text-xs text-[#555555] leading-relaxed mb-3">
                      Processes sensitive investigative datasets in-session so evidentiary outputs remain strictly under Investigator control without third-party exposure.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Super Admin", "Police Station Admin", "Investigation Officer (IO)"].map((role) => (
                        <span
                          key={role}
                          className="font-mono text-[10px] px-2 py-0.5 bg-[#F7F7F5] border border-[#E5E5E3] text-[#111111]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link to="/contact" className="block">
                    <Button className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] text-xs font-mono uppercase tracking-[0.1em] gap-2">
                      Request Platform Briefing
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Platform 02: VFRA-TTI */}
              <div className="premium-card flex flex-col justify-between p-6 md:p-8 lg:p-10 bg-[#F7F7F5]/60 hover:bg-white transition-colors">
                <div>
                  {/* Top Spec Row */}
                  <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5E5E3]">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#111111] text-white rounded-sm">
                        SYS-02
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555]">
                        Telegram Threat Intelligence
                      </span>
                    </div>
                    <Activity className="h-4 w-4 text-[#111111]" />
                  </div>

                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111111] tracking-[-0.03em] mb-2">
                    VFRA-TTI
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#555555] mb-4">
                    Real-Time Intelligence. Court-Ready Evidence.
                  </p>
                  <p className="text-sm text-[#555555] leading-relaxed mb-8">
                    VFRA-TTI is a specialized Telegram Threat Intelligence platform built for lawful intelligence operations and authorized cybercrime investigations. It enables structured actor correlation, channel intelligence, and evidentiary packaging under legal mandate.
                  </p>

                  {/* Capability Matrix */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[
                      {
                        icon: MessageSquare,
                        title: "Message Intelligence",
                        items: ["Channel & Group Indexing", "Metadata Preservation", "Deleted Artifact Capture"],
                      },
                      {
                        icon: Network,
                        title: "Network Attribution",
                        items: ["Threat Actor Graph", "Admin Correlation", "Cross-Channel Mapping"],
                      },
                      {
                        icon: Database,
                        title: "Media Forensics",
                        items: ["Automated Hash Logging", "Voice Note Transcription", "Evidentiary Packaging"],
                      },
                      {
                        icon: Search,
                        title: "Analytical Coverage",
                        items: ["Financial Fraud Networks", "Organized Cybercrime", "Narcotics & Contraband"],
                      },
                    ].map((mod) => {
                      const ModIcon = mod.icon;
                      return (
                        <div
                          key={mod.title}
                          className="p-4 rounded-md bg-white border border-[#E5E5E3]"
                        >
                          <div className="flex items-center gap-2 mb-2.5">
                            <ModIcon className="h-3.5 w-3.5 text-[#111111]" />
                            <span className="font-heading text-xs font-semibold text-[#111111]">
                              {mod.title}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {mod.items.map((item) => (
                              <li
                                key={item}
                                className="text-xs text-[#555555] flex items-center gap-2"
                              >
                                <span className="h-1 w-1 rounded-full bg-[#111111]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compliance & CTA Footer */}
                <div className="pt-6 border-t border-[#E5E5E3] space-y-5">
                  <div className="p-4 rounded-md bg-white border border-[#E5E5E3]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield className="h-3.5 w-3.5 text-[#111111]" />
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#111111]">
                        Authorized Government &amp; Institutional Use Only
                      </span>
                    </div>
                    <p className="text-xs text-[#555555] leading-relaxed mb-3">
                      Deployment is strictly restricted to authorized agencies, state cyber departments, and lawful investigative mandates.
                    </p>
                    <div className="flex items-center flex-wrap gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#111111]">
                      <span className="px-2 py-0.5 bg-[#F7F7F5] border border-[#E5E5E3]">01 Target</span>
                      <span>→</span>
                      <span className="px-2 py-0.5 bg-[#F7F7F5] border border-[#E5E5E3]">02 Capture</span>
                      <span>→</span>
                      <span className="px-2 py-0.5 bg-[#F7F7F5] border border-[#E5E5E3]">03 Analyze</span>
                      <span>→</span>
                      <span className="px-2 py-0.5 bg-[#111111] text-white">04 Court Package</span>
                    </div>
                  </div>

                  <Link to="/contact" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-11 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white text-xs font-mono uppercase tracking-[0.1em] gap-2 transition-colors"
                    >
                      Request Authorized Access
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deployment Models Strip */}
        <section className="py-16 md:py-20 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-[#E5E5E3] rounded-lg">
                <Server className="h-5 w-5 text-[#111111] mb-3" />
                <h3 className="font-heading font-semibold text-base text-[#111111] mb-1.5">
                  Air-Gapped Deployment
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Available for on-premise, secure offline installations within isolated state police headquarters and central agency networks.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#E5E5E3] rounded-lg">
                <FileCheck className="h-5 w-5 text-[#111111] mb-3" />
                <h3 className="font-heading font-semibold text-base text-[#111111] mb-1.5">
                  BSA 2023 Evidentiary Standards
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Automatic cryptographic hashing (SHA-256) and audit logging for Section 63/65B compliance in judicial proceedings.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#E5E5E3] rounded-lg">
                <Lock className="h-5 w-5 text-[#111111] mb-3" />
                <h3 className="font-heading font-semibold text-base text-[#111111] mb-1.5">
                  Multi-Tier Role Access Control
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Granular investigator permissions with tamper-evident case ownership logs to protect institutional integrity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
