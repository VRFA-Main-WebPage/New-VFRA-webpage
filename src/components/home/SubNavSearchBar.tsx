import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  X,
  ChevronRight,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VFRA_SERVICES, type VFRAService } from "@/data/vfraServices";
import { cn } from "@/lib/utils";

// 14 Core Forensic Service Divisions mapped into 2 horizontal rows of 7 tiles across desktop
const CORE_14_SERVICE_NUMBERS = [
  // Row 1 (7 Primary Forensic Divisions)
  1,  // Mobile Device Extraction & Unlocking
  2,  // Computer & Laptop Forensics
  4,  // Chat & Messaging Recovery
  5,  // CCTV & Video Forensics
  10, // Phone Number & Subscriber Intelligence (CDR)
  17, // Blockchain & Cryptocurrency Fraud Analysis
  21, // Section 65B / BSA 2023 Certification
  // Row 2 (7 Specialized Intelligence & Technical Divisions)
  19, // Voice Recording Forensics & Audio Transcription
  18, // Deepfake & AI-Generated Media Detection
  6,  // Open Source Intelligence (OSINT)
  8,  // Telegram Intelligence (VFRA-TTI)
  15, // Cloud & Application Data Forensics
  11, // Vehicle & Registration Intelligence
  22, // Drone Forensics & Flight Log Reconstruction
];

export function SubNavSearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const barRef = useRef<HTMLDivElement>(null);

  // Close expanded panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 14 Core Services ordered for the 2 horizontal rows of 7 tiles
  const core14Services = useMemo(() => {
    return CORE_14_SERVICE_NUMBERS
      .map((num) => VFRA_SERVICES.find((s) => s.number === num))
      .filter((s): s is VFRAService => Boolean(s));
  }, []);

  // Filter & rank matching services with smart relevance scoring
  const matchedServices = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return [];

    const tokens = raw
      .replace(/[&/\\+]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 0);

    const scored: { service: VFRAService; score: number }[] = [];

    for (const service of VFRA_SERVICES) {
      const titleLower = service.title.toLowerCase();
      const descLower = service.description.toLowerCase();
      const capsLower = service.capabilities.join(" ").toLowerCase();
      const fullText = `${titleLower} ${descLower} ${capsLower}`;

      let score = 0;

      if (titleLower.includes(raw)) score += 50;
      if (descLower.includes(raw)) score += 20;

      for (const token of tokens) {
        if (titleLower.includes(token)) score += 15;
        if (descLower.includes(token)) score += 8;
        if (capsLower.includes(token)) score += 5;
      }

      if (score > 0) {
        scored.push({ service, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map((item) => item.service);
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = query.trim();
    if (target) {
      navigate(`/services?q=${encodeURIComponent(target)}`);
    } else {
      navigate("/services");
    }
    setIsFocused(false);
  };

  const handleServiceClick = (service: VFRAService) => {
    navigate(`/services?q=${encodeURIComponent(service.title)}`);
    setIsFocused(false);
  };

  const displayedList = query.trim().length > 0 ? matchedServices : core14Services;

  return (
    <div
      ref={barRef}
      className="relative z-30 bg-[#FAF9F6] border-b border-[#E5E5E3] py-2.5 sm:py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all"
    >
      <div className="container max-w-7xl mx-auto px-4">
        {/* Top Action Row: Services We Provide Button + Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {/* Services We Provide Action in Front */}
          <button
            type="button"
            onClick={() => setIsFocused((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#2A2A2A] text-xs font-mono uppercase tracking-[0.08em] transition-all shadow-xs shrink-0 order-1 sm:order-none"
          >
            <span>Services We Provide</span>
            <ArrowRight
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                isFocused && "rotate-90"
              )}
            />
          </button>

          {/* Search Bar Input Tile */}
          <div
            className={cn(
              "relative flex-1 max-w-xl w-full bg-white rounded-xl border border-[#D8D6CE] shadow-xs overflow-hidden transition-all duration-300",
              isFocused
                ? "border-[#111111] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] ring-2 ring-black/5"
                : "hover:border-[#111111]/40"
            )}
          >
            <form onSubmit={handleSubmit} className="flex items-center px-1">
              <Input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsFocused(true);
                }}
                onFocus={() => setIsFocused(true)}
                placeholder="What service do you need?"
                className="h-10 sm:h-11 border-0 bg-transparent pl-3 pr-1 text-sm text-[#111111] placeholder:text-[#777777] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-sans"
              />

              {/* Clear Button */}
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setIsFocused(true);
                  }}
                  className="p-1 mr-1 text-[#888888] hover:text-[#111111] rounded-full hover:bg-black/5 transition-colors shrink-0"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Circular Search Action Button */}
              <div className="pr-1.5 shrink-0">
                <button
                  type="submit"
                  className="h-8 w-8 rounded-full bg-[#111111] hover:bg-black text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black/20"
                  aria-label="Search"
                  title="Search forensic services"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Full-Width Horizontal Services Panel (2 Horizontal Rows of 7 Tiles across the Container) */}
        <AnimatePresence initial={false}>
          {isFocused && (
            <motion.div
              key="full-width-service-tiles-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.38, delay: 0.08, ease: "easeOut" },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2, ease: "easeIn" },
                },
              }}
              className="overflow-hidden mt-3 sm:mt-4"
            >
              <div className="rounded-2xl border border-[#D8D6CE] bg-[#FBFBFA] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] overflow-hidden">
                {/* Panel Header */}
                <div className="px-4 py-2.5 bg-[#F4F3EE] border-b border-[#EBEAE5] flex items-center justify-between text-xs font-mono text-[#555555]">
                  <span className="flex items-center gap-1.5 font-semibold text-[#111111]">
                    <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    {query.trim().length === 0
                      ? "14 Core Forensic Service Divisions"
                      : `Found ${matchedServices.length} ${
                          matchedServices.length === 1 ? "Division" : "Divisions"
                        } for "${query}"`}
                  </span>
                  <span className="text-[11px] text-[#888888] hidden sm:inline">
                    {query.trim().length === 0
                      ? "Select any forensic division to inspect protocol"
                      : "Click to view full forensic protocol specifications"}
                  </span>
                </div>

                {/* 2 Horizontal Rows of 7 Tiles Across Screen */}
                <div className="p-3 sm:p-4">
                  {displayedList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
                      {displayedList.slice(0, 14).map((service) => {
                        const Icon = service.icon;

                        return (
                          <div
                            key={service.number}
                            onClick={() => handleServiceClick(service)}
                            className="group p-2.5 sm:p-3 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E5E5E3] hover:border-[#111111] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[100px] sm:min-h-[110px]"
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#F5F4F0] border border-[#E5E5E3] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] transition-all shadow-2xs">
                              <Icon className="h-4 w-4 text-[#111111] group-hover:text-white transition-colors" />
                            </div>

                            <div className="w-full mt-1.5 flex-1 flex items-center justify-center">
                              <h4 className="text-[11px] sm:text-xs font-semibold text-[#111111] group-hover:text-[#825816] transition-colors leading-snug line-clamp-2">
                                {service.title}
                              </h4>
                            </div>

                            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-[#888888] group-hover:text-[#111111] transition-colors font-mono uppercase tracking-wider">
                              <span>Protocol</span>
                              <ChevronRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="h-8 w-8 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Search className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-semibold text-[#111111]">
                        No forensic service matched &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-[11px] text-[#666666] max-w-sm mx-auto">
                        Try searching for keywords like Mobile, Chat, Crypto, CDR, CCTV, or Section 65B.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/contact")}
                        className="text-xs h-7 mt-1.5"
                      >
                        Contact Forensic Laboratory
                      </Button>
                    </div>
                  )}
                </div>

                {/* Expanded Panel Footer */}
                <div className="p-2.5 sm:p-3 bg-[#F4F3EE] border-t border-[#EBEAE5] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <span className="text-xs text-[#666666] text-center sm:text-left">
                    ISO/IEC 27037 &amp; Bharatiya Sakshya Adhiniyam (Section 65B) Compliant Evidence Laboratory
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleSubmit()}
                    className="h-7 px-3.5 text-xs bg-[#111111] hover:bg-black text-white rounded-md flex items-center gap-1.5 shadow-2xs shrink-0"
                  >
                    <span>Explore All 27 Forensic Services</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
