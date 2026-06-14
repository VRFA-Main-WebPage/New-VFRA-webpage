import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, Bitcoin, Mic, FileCheck, GraduationCap, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FEATURED_SERVICES = [
  {
    number: "01",
    title: "Mobile Device Extraction & Unlocking",
    category: "Digital Forensics",
    description: "Advanced mobile acquisition, unlocking assistance, deleted data recovery and forensic examination for Android and iOS devices.",
    icon: Smartphone,
    link: "/services#service-1"
  },
  {
    number: "02",
    title: "Blockchain & Cryptocurrency Fraud Analysis",
    category: "Financial Investigation",
    description: "Transaction tracing, wallet intelligence, fund-flow reconstruction and cryptocurrency fraud investigation support.",
    icon: Bitcoin,
    link: "/services#service-17"
  },
  {
    number: "03",
    title: "Voice Recording Forensics & Transcription",
    category: "Media Forensics",
    description: "Audio authentication, speaker examination support, forensic enhancement and court-ready transcription services.",
    icon: Mic,
    link: "/services#service-19"
  },
  {
    number: "04",
    title: "Section 65B / BSA 2023 Certification",
    category: "Legal Support",
    description: "Preparation of legally compliant electronic evidence certification and supporting documentation for court proceedings.",
    icon: FileCheck,
    link: "/services#service-21"
  },
  {
    number: "05",
    title: "Law Enforcement Training Programmes",
    category: "Training & Capacity Building",
    description: "Specialized training programmes covering cybercrime investigation, digital forensics, OSINT, cyber intelligence and evidence handling.",
    icon: GraduationCap,
    link: "/services#service-24"
  },
  {
    number: "06",
    title: "Corporate Digital Forensics & Incident Response",
    category: "Enterprise Services",
    description: "Incident response, internal investigations, evidence preservation and digital forensic support for organizations.",
    icon: Building2,
    link: "/services#service-26"
  }
];

export function ServicesSection() {
  const { ref, inView } = useInView();

  return (
    <section className="hidden md:block py-10 md:py-24 lg:py-32 bg-background border-b border-border">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <p className="section-eyebrow">Forensic Services</p>
            <h2 className="section-heading mb-4 text-[28px] md:text-4xl lg:text-5xl">Comprehensive Investigation Support</h2>
            <p className="section-subtext mx-auto text-base md:text-lg">
              From digital evidence acquisition to court-ready reporting — specialized forensic, intelligence and legal support services for investigators, legal professionals and institutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <motion.article 
                  key={service.number} 
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group premium-card p-6 h-full flex flex-col bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-mono font-bold text-muted-foreground/50 group-hover:text-primary/50 transition-colors">
                      #{service.number}
                    </span>
                  </div>
                  
                  <span className="inline-block px-2 py-1 mb-3 rounded-sm border-l-2 border-primary bg-gradient-to-r from-primary/10 to-transparent text-[10px] font-bold uppercase tracking-wider text-primary w-max">
                    {service.category}
                  </span>

                  <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6 line-clamp-3">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-auto pt-5 border-t border-border">
                    <Link to="/submit-case" className="flex-1">
                      <Button className="w-full btn-gold h-10 text-sm font-semibold group/btn gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        Register Case
                      </Button>
                    </Link>
                    <Link to={service.link} className="flex-1">
                      <Button variant="outline" className="w-full btn-outline-gold h-10 text-sm group/btn gap-1.5">
                        Learn More
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-16">
            <Link to="/services">
              <Button size="lg" className="h-14 px-8 text-base bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground group transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] font-bold">
                View All 26 Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
