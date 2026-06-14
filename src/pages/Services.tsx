import { SEO } from "@/components/SEO";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Search, CheckCircle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  VFRA_SERVICES,
  SERVICE_CATEGORIES,
  FORENSIC_PROCESS_STEPS,
  type ServiceCategory,
} from "@/data/vfraServices";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

function AudienceBadge({ audience }: { audience: string }) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        audience === "LEA" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        audience === "Lawyers" && "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        audience === "Both" && "bg-success/10 text-success border border-success/20"
      )}
    >
      {audience === "Both" ? "LEA & Lawyers" : audience}
    </span>
  );
}

const Services = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = VFRA_SERVICES;

    if (activeCategory !== "all") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.capabilities.some((cap) => cap.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <>
      <SEO title="Services | VFRA" description="Explore our digital forensic services and cybercrime investigation capabilities." />
      <div className="bg-background min-h-screen">
        
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-hero border-b border-border overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5 mb-6 text-sm text-primary font-medium tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Professional Forensic Catalogue
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Digital Forensics & Cyber <br className="hidden md:block"/> Investigation Services
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto">
                Court-admissible forensic reporting, cybercrime investigation support, OSINT intelligence, digital evidence analysis and incident response services for law enforcement, legal professionals, institutions and enterprises.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/submit-case" className="w-full sm:w-auto">
                  <Button className="w-full btn-gold gap-2 h-12 px-8 text-base shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    Register a Case
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full btn-outline-gold h-12 px-8 text-base">
                    Contact VFRA
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SEARCH & FILTER BAR */}
        <section className="py-8 sticky top-14 lg:top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
          <div className="container flex flex-col gap-5">
            
            <div className="relative max-w-2xl mx-auto w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search services, capabilities, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-card/50 border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20 text-base"
              />
            </div>

            <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
              <Tabs
                value={activeCategory}
                onValueChange={(v) => setActiveCategory(v as ServiceCategory | "all")}
                className="w-max min-w-full lg:min-w-0 mx-auto"
              >
                <TabsList className="bg-transparent border-0 h-auto flex gap-2 p-0">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-full border border-border data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30 px-5 py-2 text-sm whitespace-nowrap transition-all"
                  >
                    All Services
                  </TabsTrigger>
                  {(Object.keys(SERVICE_CATEGORIES) as ServiceCategory[]).map((key) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="rounded-full border border-border data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30 px-5 py-2 text-sm whitespace-nowrap transition-all"
                    >
                      {key}. {SERVICE_CATEGORIES[key].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-16 lg:py-24">
          <div className="container">
            {activeCategory !== "all" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={activeCategory}
                className="mb-12 max-w-3xl"
              >
                <h2 className="font-heading text-3xl font-bold text-foreground mb-3 flex items-center gap-3">
                  <span className="text-primary">{activeCategory}.</span>
                  {SERVICE_CATEGORIES[activeCategory].label}
                </h2>
                <p className="text-lg text-muted-foreground">{SERVICE_CATEGORIES[activeCategory].description}</p>
              </motion.div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-card/30 rounded-2xl border border-border">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground mb-2">No services found</h3>
                <p className="text-muted-foreground">We couldn't find any services matching "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-primary">
                  Clear search
                </Button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((service) => {
                    const Icon = service.icon;
                    const isTTI = service.number === 8;
                    return (
                      <motion.article
                        layout
                        key={service.number}
                        variants={fadeUp}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="group relative premium-card p-6 flex flex-col bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-[0_4px_20px_rgba(212,175,55,0.1)] transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-3 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors group-hover:-translate-y-1 duration-300">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xs font-mono font-semibold text-muted-foreground bg-background/50 px-2 py-1 rounded">
                              SRV-{String(service.number).padStart(2, "0")}
                            </span>
                          </div>
                          <AudienceBadge audience={service.audience} />
                        </div>

                        <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                          {service.description}
                        </p>

                        <div className="mb-6 space-y-2.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">Key Capabilities</p>
                          {service.capabilities.map((cap) => (
                            <div key={cap} className="flex items-start gap-2.5">
                              <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5 opacity-80" />
                              <span className="text-sm text-muted-foreground">{cap}</span>
                            </div>
                          ))}
                        </div>

                        {isTTI && (
                          <div className="flex gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6">
                            <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-primary">Restricted Service</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Available only for lawful, authorized, institutional or government investigation use. No unauthorized access, monitoring or surveillance is supported.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border mt-auto">
                          {service.showRegisterCase ? (
                            <Link to="/submit-case" className="flex-1">
                              <Button className="w-full btn-gold group/btn gap-2">
                                Register Case
                                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          ) : null}
                          <Link to="/contact" className="flex-1">
                            <Button variant="outline" className="w-full btn-outline-gold group/btn gap-2">
                              Contact VFRA
                              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        {/* WORKFLOW TIMELINE */}
        <section className="py-20 bg-surface border-y border-border overflow-hidden">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-[28px] md:text-4xl font-bold text-foreground mb-4">
                How VFRA Supports Investigations
              </h2>
              <p className="text-muted-foreground text-lg">
                Our standardized operational workflow ensuring evidentiary integrity from acquisition to court testimony.
              </p>
            </div>

            {/* Desktop Horizontal Timeline */}
            <div className="hidden lg:block relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-y-1/2" />
              
              <div className="grid grid-cols-6 gap-6 relative z-10">
                {FORENSIC_PROCESS_STEPS.map((step, idx) => (
                  <motion.div 
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="mb-6 mt-auto">
                      <div className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Phase {step.step}</div>
                      <h4 className="font-heading font-semibold text-sm">{step.title}</h4>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 z-10 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed px-2">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="lg:hidden relative pl-6 sm:pl-8 max-w-lg mx-auto">
              <div className="absolute top-0 bottom-0 left-[15px] sm:left-[23px] w-px bg-border" />
              
              <div className="space-y-10">
                {FORENSIC_PROCESS_STEPS.map((step, idx) => (
                  <motion.div 
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-8"
                  >
                    <div className="absolute top-1 -left-[25px] sm:-left-[17px] w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    
                    <div className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Phase {step.step}</div>
                    <h4 className="font-heading font-bold text-lg mb-2 text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-10 md:py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="container relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
              Need guidance on the right service?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Contact our forensic team for a confidential consultation. We will scope engagement based on your legal authority, technical requirements, and court admissibility standards.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/submit-case" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto btn-gold h-14 px-10 text-base shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  Register a Case
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto btn-outline-gold h-14 px-10 text-base bg-background/50 backdrop-blur-sm">
                  Contact Forensic Team
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Services;
