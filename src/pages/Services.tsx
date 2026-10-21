import { SEO } from "@/components/SEO";
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, AlertTriangle, Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        "px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] border",
        audience === "LEA" && "bg-[#111111] text-white border-[#111111]",
        audience === "Lawyers" && "bg-[#F7F7F5] text-[#111111] border-[#D4D4D0]",
        audience === "Both" && "bg-[#F7F7F5] text-[#555555] border-[#E5E5E3]"
      )}
    >
      {audience === "Both" ? "LEA & Legal" : audience}
    </span>
  );
}

const Services = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || searchParams.get("search") || "");

  const filtered = useMemo(() => {
    let result = VFRA_SERVICES;

    if (activeCategory !== "all") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const raw = searchQuery.trim().toLowerCase();
      const tokens = raw.replace(/[&/\\+]/g, " ").split(/\s+/).filter(Boolean);

      result = result.filter((s) => {
        const full = `${s.title} ${s.description} ${s.capabilities.join(" ")} srv-${String(s.number).padStart(2, "0")}`.toLowerCase();
        if (full.includes(raw)) return true;
        if (tokens.length > 1 && tokens.every((t) => full.includes(t))) return true;
        if (tokens.some((t) => s.title.toLowerCase().includes(t))) return true;
        return false;
      });
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <>
      <SEO
        title="Forensic Services Catalogue | VFRA"
        description="Explore all 26 digital forensic services, OSINT workflows, and cybercrime investigation capabilities by VFRA."
      />
      <div className="bg-white min-h-screen">
        {/* HERO SECTION */}
        <section className="relative py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <span className="section-eyebrow">
                CLINICAL SERVICE INDEX // 26 SPECIALIZED CAPABILITIES
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[54px] font-semibold text-[#111111] tracking-[-0.035em] leading-[1.08] mb-6">
                Digital Forensics &amp; Cyber Investigation Catalogue.
              </h1>
              <p className="text-base md:text-lg text-[#555555] leading-relaxed mb-8">
                Court-admissible forensic reporting, device extraction, OSINT intelligence, financial fraud tracing, and incident response services for law enforcement, legal professionals, and enterprises.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/submit-case">
                  <Button className="bg-[#111111] text-white hover:bg-[#2A2A2A] h-11 px-6 text-xs font-mono uppercase tracking-[0.1em] gap-2">
                    Register a Case
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="border-[#D4D4D0] bg-white text-[#111111] hover:border-[#111111] h-11 px-6 text-xs font-mono uppercase tracking-[0.1em]"
                  >
                    Consult Forensic Desk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY SEARCH & CATEGORY BAR */}
        <section className="py-5 sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E3]">
          <div className="container flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
              <Input
                type="text"
                placeholder="Filter by capability or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-[#F7F7F5] border-[#E5E5E3] focus-visible:ring-[#111111] text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-3.5 py-2 rounded-md font-mono text-[11px] uppercase tracking-[0.1em] whitespace-nowrap border transition-colors",
                  activeCategory === "all"
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#555555] border-[#E5E5E3] hover:border-[#111111] hover:text-[#111111]"
                )}
              >
                All (26)
              </button>
              {(Object.keys(SERVICE_CATEGORIES) as ServiceCategory[]).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    "px-3.5 py-2 rounded-md font-mono text-[11px] uppercase tracking-[0.1em] whitespace-nowrap border transition-colors",
                    activeCategory === key
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-white text-[#555555] border-[#E5E5E3] hover:border-[#111111] hover:text-[#111111]"
                  )}
                >
                  {key}. {SERVICE_CATEGORIES[key].label.split("&")[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES SPECIFICATION GRID */}
        <section className="py-16 lg:py-24">
          <div className="container">
            {activeCategory !== "all" && (
              <div className="mb-10 pb-6 border-b border-[#E5E5E3] max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#555555]">
                  CATEGORY {activeCategory}
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111111] mt-1 mb-2">
                  {SERVICE_CATEGORIES[activeCategory].label}
                </h2>
                <p className="text-sm text-[#555555]">
                  {SERVICE_CATEGORIES[activeCategory].description}
                </p>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-[#F7F7F5] rounded-lg border border-[#E5E5E3]">
                <Search className="h-8 w-8 text-[#555555] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#111111] mb-1">No matching services</h3>
                <p className="text-sm text-[#555555]">
                  No forensic services matched "{searchQuery}".
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 font-mono text-xs uppercase"
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
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
                        id={`service-${service.number}`}
                        className="group premium-card p-6 flex flex-col justify-between bg-white"
                      >
                        <div>
                          {/* Top Index Header */}
                          <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E5E5E3]">
                            <span className="font-mono text-xs font-semibold text-[#111111]">
                              SRV-{String(service.number).padStart(2, "0")} · CAT-{service.category}
                            </span>
                            <AudienceBadge audience={service.audience} />
                          </div>

                          <div className="w-10 h-10 rounded-md bg-[#F7F7F5] border border-[#E5E5E3] flex items-center justify-center mb-4 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>

                          <h3 className="font-heading text-lg font-bold text-[#111111] mb-2 tracking-[-0.02em]">
                            {service.title}
                          </h3>
                          <p className="text-sm text-[#555555] leading-relaxed mb-6">
                            {service.description}
                          </p>

                          {/* Ingredient-Style Capability List */}
                          <div className="p-4 rounded-md bg-[#F7F7F5] border border-[#E5E5E3] mb-6">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111111] mb-2.5">
                              Technical Specifications
                            </p>
                            <div className="space-y-2">
                              {service.capabilities.map((cap) => (
                                <div key={cap} className="flex items-start gap-2">
                                  <Check className="h-3.5 w-3.5 text-[#111111] shrink-0 mt-0.5" />
                                  <span className="text-xs text-[#555555]">{cap}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {isTTI && (
                            <div className="flex gap-2.5 p-3.5 rounded-md border border-[#111111]/20 bg-[#F7F7F5] mb-6">
                              <AlertTriangle className="h-4 w-4 text-[#111111] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#111111]">
                                  Restricted Institutional Service
                                </p>
                                <p className="text-[11px] text-[#555555] leading-relaxed mt-0.5">
                                  Available exclusively for lawful, authorized government or institutional mandates.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 pt-4 border-t border-[#E5E5E3]">
                          {service.showRegisterCase && (
                            <Link to="/submit-case" className="flex-1">
                              <Button className="w-full h-10 bg-[#111111] text-white hover:bg-[#2A2A2A] text-xs font-mono uppercase tracking-wider">
                                Register Case
                              </Button>
                            </Link>
                          )}
                          <Link to="/contact" className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full h-10 border-[#D4D4D0] text-[#111111] hover:border-[#111111] text-xs font-mono uppercase tracking-wider"
                            >
                              Inquire
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
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-t border-[#E5E5E3]">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <span className="section-eyebrow">OPERATIONAL PROTOCOL</span>
              <h2 className="section-heading">
                Standardized Evidentiary Workflow.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 border border-[#E5E5E3] bg-white rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E3]">
              {FORENSIC_PROCESS_STEPS.map((step) => (
                <div key={step.step} className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#111111] text-white inline-block mb-4">
                      0{step.step}
                    </span>
                    <h4 className="font-heading font-semibold text-sm text-[#111111] mb-2">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#555555] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;
