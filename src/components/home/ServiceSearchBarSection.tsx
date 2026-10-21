import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  X,
  FileCheck2,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VFRA_SERVICES, type VFRAService } from "@/data/vfraServices";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const POPULAR_QUERIES = [
  "Mobile Forensics",
  "WhatsApp & Chat",
  "Crypto & Blockchain",
  "Section 65B Certificate",
  "CCTV & Video",
  "CDR & Call Analysis",
  "Audio & Voice",
  "Hard Disk / SSD",
];

export function ServiceSearchBarSection() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching services in real-time
  const matchedServices = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return VFRA_SERVICES.filter((service) => {
      return (
        service.title.toLowerCase().includes(trimmed) ||
        service.description.toLowerCase().includes(trimmed) ||
        service.capabilities.some((cap) => cap.toLowerCase().includes(trimmed)) ||
        `srv-${String(service.number).padStart(2, "0")}`.includes(trimmed)
      );
    });
  }, [query]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = query.trim();
    if (target) {
      navigate(`/services?q=${encodeURIComponent(target)}`);
    } else {
      navigate("/services");
    }
  };

  const handlePillClick = (pillText: string) => {
    setQuery(pillText);
    setIsFocused(true);
  };

  const handleServiceClick = (service: VFRAService) => {
    navigate(`/services?q=${encodeURIComponent(service.title)}`);
  };

  return (
    <section className="relative bg-[#FAF9F6] border-y border-[#E5E5E3] py-12 md:py-16 overflow-visible">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E3_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E3_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-3 mb-8"
        >
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D8D6CE] shadow-xs text-xs font-mono uppercase tracking-[0.12em] text-[#111111]">
            <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span>Forensic Service Directory // 26 Capabilities</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#111111]">
            Search Forensic Services &amp; Evidentiary Protocols
          </h2>

          <p className="text-sm sm:text-base text-[#555555] max-w-2xl mx-auto leading-relaxed">
            Quickly locate laboratory services, mobile acquisition workflows,
            cybercrime forensics, or Section 65B judicial certification.
          </p>
        </motion.div>

        {/* Search Bar Container */}
        <div
          ref={searchContainerRef}
          className="max-w-3xl mx-auto relative z-20"
        >
          <form
            onSubmit={handleSearchSubmit}
            className={cn(
              "relative flex items-center bg-white rounded-2xl border transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]",
              isFocused
                ? "border-[#111111] ring-4 ring-black/5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]"
                : "border-[#D8D6CE] hover:border-[#111111]/40"
            )}
          >
            {/* Search Icon */}
            <div className="pl-4 sm:pl-5 pr-2 text-[#555555] pointer-events-none">
              <Search className="h-5 w-5" />
            </div>

            {/* Input Field */}
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search by keyword, e.g. WhatsApp, deleted photos, crypto fraud, CCTV, CDR..."
              className="h-14 sm:h-16 w-full border-0 bg-transparent px-2 text-base text-[#111111] placeholder:text-[#888888] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-sans"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsFocused(true);
                }}
                className="p-2 mr-1 text-[#888888] hover:text-[#111111] rounded-full hover:bg-[#F2F1ED] transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Submit Action Button */}
            <div className="pr-2 sm:pr-2.5">
              <Button
                type="submit"
                className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-medium transition-transform active:scale-[0.98] shadow-sm flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="h-4 w-4 hidden sm:inline" />
              </Button>
            </div>
          </form>

          {/* Real-time Search Results Dropdown Panel */}
          <AnimatePresence>
            {isFocused && query.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 right-0 mt-2 bg-white border border-[#D8D6CE] rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] overflow-hidden z-50 divide-y divide-[#E5E5E3]"
              >
                {matchedServices.length > 0 ? (
                  <>
                    <div className="px-4 py-2.5 bg-[#FAF9F6] flex items-center justify-between text-xs font-mono text-[#555555]">
                      <span>
                        Found {matchedServices.length}{" "}
                        {matchedServices.length === 1 ? "service" : "services"}{" "}
                        matching &ldquo;{query}&rdquo;
                      </span>
                      <span className="hidden sm:inline text-[11px] text-[#888888]">
                        Click any service to view full specifications
                      </span>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F0EFEA]">
                      {matchedServices.slice(0, 5).map((service) => {
                        const Icon = service.icon;
                        const code = `SRV-${String(service.number).padStart(2, "0")}`;

                        return (
                          <div
                            key={service.number}
                            onClick={() => handleServiceClick(service)}
                            className="p-4 hover:bg-[#FAF9F6] transition-colors cursor-pointer group flex items-start justify-between gap-4"
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              <div className="h-9 w-9 rounded-lg bg-[#F2F1ED] border border-[#E5E5E3] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-[10px] font-semibold text-[#888888] bg-[#F2F1ED] px-1.5 py-0.5 rounded">
                                    {code}
                                  </span>
                                  <h4 className="text-sm font-semibold text-[#111111] group-hover:text-amber-600 transition-colors truncate">
                                    {service.title}
                                  </h4>
                                  <span
                                    className={cn(
                                      "px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded border",
                                      service.audience === "LEA" &&
                                        "bg-[#111111] text-white border-[#111111]",
                                      service.audience === "Lawyers" &&
                                        "bg-[#FAF9F6] text-[#111111] border-[#D4D4D0]",
                                      service.audience === "Both" &&
                                        "bg-[#FAF9F6] text-[#555555] border-[#E5E5E3]"
                                    )}
                                  >
                                    {service.audience === "Both"
                                      ? "LEA & Legal"
                                      : service.audience}
                                  </span>
                                </div>
                                <p className="text-xs text-[#666666] line-clamp-1">
                                  {service.description}
                                </p>
                              </div>
                            </div>

                            <ChevronRight className="h-4 w-4 text-[#888888] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                          </div>
                        );
                      })}
                    </div>

                    {/* View all in directory footer */}
                    <div className="p-3 bg-[#FAF9F6] flex items-center justify-between gap-3">
                      <span className="text-xs text-[#555555]">
                        Need custom casework support?
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSearchSubmit()}
                        className="h-8 px-3 text-xs bg-[#111111] hover:bg-black text-white rounded-lg flex items-center gap-1.5"
                      >
                        <span>View All in Services Directory</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="h-10 w-10 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Search className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">
                        No services matching &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
                        Try searching for keywords like mobile, CDR, WhatsApp,
                        audio, crypto, or Section 65B.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/contact")}
                      className="text-xs"
                    >
                      Inquire with Forensic Team
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick-Filter Suggestion Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#888888] font-mono text-[11px] uppercase tracking-wider mr-1">
              Popular:
            </span>
            {POPULAR_QUERIES.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handlePillClick(pill)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#111111] text-[#555555] hover:text-white border border-[#D8D6CE] hover:border-[#111111] transition-all duration-200 text-xs font-medium shadow-2xs hover:shadow-xs active:scale-[0.97]"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
