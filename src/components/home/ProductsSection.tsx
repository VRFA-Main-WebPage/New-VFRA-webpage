import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Shield, 
  Network, 
  Database, 
  Lock, 
  Scale,
  Activity,
  Phone,
  Banknote,
  Search,
  Eye,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

export function ProductsSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 lg:py-32 bg-background border-b border-border relative overflow-hidden" id="platforms">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <span className="text-sm font-semibold text-[#D4AF37] tracking-wider uppercase">Vigilant Forensic Research and Analytics Pvt. Ltd.</span>
            </div>
            <h2 className="section-heading mb-6 text-foreground">INVESTIGATION PLATFORMS</h2>
            <p className="text-lg text-muted-foreground mx-auto">
              Technology platforms built for lawful digital investigations, cybercrime intelligence, evidence operations and institutional investigative workflows.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Product 01: InvestiGate */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative flex flex-col h-full rounded-2xl bg-black/40 border border-white/5 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] transition-all duration-300"
            >
              {/* Hover gradient background effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
              
              <div className="p-6 lg:p-8 flex-1 flex flex-col relative z-10 gap-5">
                
                {/* Header Section */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-5">
                    <Shield className="w-4 h-4 text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform duration-300" />
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">Cybercrime Investigation Platform</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 transition-transform duration-300 group-hover:translate-x-1">
                    InvestiGate
                  </h3>
                  
                  <p className="text-[#D4AF37] font-semibold tracking-wide text-sm mb-4 uppercase">One Platform. Complete Investigation Workflow.</p>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    InvestiGate by VFRA is a secure cybercrime investigation platform designed for Indian law enforcement, cyber cells and investigation officers. It combines telecom analysis, IPDR intelligence, fund-flow investigation, OSINT workflows and legal notice generation into a unified investigation environment.
                  </p>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />

                {/* Capability Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Telecom Intelligence</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> CDR Analysis</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> IMEI CDR Analysis</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Call Pattern Mapping</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Timeline Reconstruction</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <Network className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">IPDR Intelligence</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> NAT Log Analysis</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Session Mapping</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> IP Attribution</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Large Dataset Processing</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <Banknote className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Financial Investigation</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Fund Flow Analysis</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Beneficiary Tracking</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Transaction Mapping</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Fraud Workflows</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <Scale className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Legal Workflow</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> BNSS Sec 94 Notices</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> BNSS Sec 106 Notices</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> DOCX Generation</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Report-Ready Exports</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      <h4 className="text-[13px] font-bold text-foreground">Privacy-First Architecture</h4>
                    </div>
                    <p className="text-[12px] text-muted-foreground mb-4 leading-relaxed">
                      InvestiGate processes investigation datasets in-session and is designed to minimize permanent storage of sensitive investigative data. Investigation outputs remain under investigator control through secure exports and workflow management.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] px-2 py-1 rounded-md bg-black/50 text-muted-foreground font-medium border border-white/5">Super Admin</span>
                      <span className="text-[10px] px-2 py-1 rounded-md bg-black/50 text-muted-foreground font-medium border border-white/5">Police Station Admin</span>
                      <span className="text-[10px] px-2 py-1 rounded-md bg-black/50 text-muted-foreground font-medium border border-white/5">Investigation Officer (IO)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/contact" className="w-full sm:w-auto">
                      <Button className="bg-[#D4AF37] text-black hover:bg-[#F3E5AB] w-full font-bold h-10 px-6 text-xs">
                        Request Platform Demo
                      </Button>
                    </Link>
                    
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product 02: VFRA-TTI */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative flex flex-col h-full rounded-2xl bg-black/40 border border-white/5 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
              
              <div className="p-6 lg:p-8 flex-1 flex flex-col relative z-10 gap-5">
                
                {/* Header Section */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-5">
                    <Activity className="w-4 h-4 text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform duration-300" />
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">Telegram Threat Intelligence</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 transition-transform duration-300 group-hover:translate-x-1">
                    VFRA-TTI
                  </h3>
                  
                  <p className="text-[#D4AF37] font-semibold tracking-wide text-sm mb-4 uppercase">Real-Time Intelligence. Court-Ready Evidence.</p>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    VFRA-TTI is a purpose-built Telegram Threat Intelligence platform designed for lawful intelligence operations, cybercrime investigations and authorized investigative workflows. It supports real-time intelligence gathering, network mapping and evidence packaging under applicable legal authority.
                  </p>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />

                {/* Capability Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Message Intelligence</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Message Monitoring</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Metadata Collection</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Deleted Msg Capture</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Channel Intelligence</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <Network className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Network Intelligence</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Threat Actor Mapping</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Group Analysis</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Admin Identification</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Network Visualization</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <Database className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Media Intelligence</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Media Collection</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> File Intelligence</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Voice Msg Processing</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Evidence Packaging</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 text-foreground font-semibold">
                      <Search className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Intelligence Analysis</span>
                    </div>
                    <ul className="text-[12px] text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Threat Profiling</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Entity Correlation</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Pattern Detection</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]/50" /> Invest. Reporting</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-2">
                   <div className="flex items-center gap-2 mb-3 text-foreground font-semibold">
                      <Eye className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[13px]">Threat Intelligence Coverage</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-muted-foreground">Cybercrime & Financial Fraud</span>
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-muted-foreground">Organized Crime</span>
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-muted-foreground">Narcotics Networks</span>
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-muted-foreground">Terrorism & Extremism</span>
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-muted-foreground">Trafficking Investigations</span>
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-muted-foreground">POCSO / CSAM Investigations</span>
                   </div>
                </div>

                <div className="mt-auto pt-2">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-5 relative overflow-hidden group/compliance">
                    <div className="flex items-center gap-2 mb-2.5 relative z-10">
                      <Shield className="w-4 h-4 text-[#D4AF37]" />
                      <h4 className="text-[13px] font-bold text-foreground">Authorized Investigation Use Only</h4>
                    </div>
                    <p className="text-[12px] text-muted-foreground mb-4 leading-relaxed relative z-10">
                      VFRA-TTI is designed for lawful, authorized, institutional and government investigative workflows. Access and deployment are subject to legal authorization and applicable compliance requirements.
                    </p>
                    <div className="flex items-center flex-wrap gap-1.5 text-[9px] text-muted-foreground font-mono uppercase tracking-widest border-t border-white/5 pt-3 relative z-10">
                      <span>Target</span> <ArrowRight className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>Capture</span> <ArrowRight className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>Analyze</span> <ArrowRight className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>Package</span> <ArrowRight className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] font-bold">Court</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/contact" className="w-full sm:w-auto">
                      <Button className="bg-[#D4AF37] text-black hover:bg-[#F3E5AB] w-full font-bold h-10 px-6 text-xs">
                        Request Authorized Access
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
