import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VFRA_SERVICES, type VFRAService } from "@/data/vfraServices";
import { cn } from "@/lib/utils";

// Exact core keyword services provided by VFRA
const VFRA_CORE_SERVICE_TAGS = [
  "Mobile Extraction",
  "WhatsApp & Chat",
  "CCTV Forensics",
  "CDR Analysis",
  "Crypto Fraud",
  "Section 65B",
  "Data Recovery",
  "Incident Response",
];

export function SubNavSearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const barRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      const code = `srv-${String(service.number).padStart(2, "0")}`;
      const titleLower = service.title.toLowerCase();
      const descLower = service.description.toLowerCase();
      const capsLower = service.capabilities.join(" ").toLowerCase();
      const fullText = `${titleLower} ${descLower} ${capsLower} ${code}`;

      let score = 0;

      // 1. Exact phrase match in title (highest priority)
      if (titleLower.includes(raw)) {
        score += 100;
      }
      // 2. All tokens present in title
      else if (tokens.length > 1 && tokens.every((t) => titleLower.includes(t))) {
        score += 80;
      }
      // 3. Exact phrase match in full text
      else if (fullText.includes(raw)) {
        score += 50;
      }
      // 4. All tokens present in full text
      else if (tokens.length > 1 && tokens.every((t) => fullText.includes(t))) {
        score += 35;
      }
      // 5. Code match (e.g. srv-10)
      else if (tokens.some((t) => t === code)) {
        score += 30;
      }
      // 6. Any meaningful token (>3 chars) matches title
      else if (tokens.some((t) => t.length > 3 && titleLower.includes(t))) {
        score += 15;
      }

      if (score > 0) {
        scored.push({ service, score });
      }
    }

    // Sort by relevance score descending
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
  };

  const handlePillClick = (tag: string) => {
    setQuery(tag);
    setIsFocused(true);
  };

  const handleServiceClick = (service: VFRAService) => {
    navigate(`/services?q=${encodeURIComponent(service.title)}`);
  };

  return (
    <div
      ref={barRef}
      className="relative z-30 bg-[#FAF9F6] border-b border-[#E5E5E3] pt-3 sm:pt-3.5 pb-3 sm:pb-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
    >
      <div className="container">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          {/* Search Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 relative flex items-center bg-white rounded-xl border border-[#D8D6CE] hover:border-[#111111]/40 focus-within:border-[#111111] focus-within:ring-2 focus-within:ring-black/5 transition-all shadow-xs"
          >
            {/* Input Field */}
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search forensic services..."
              className="h-11 sm:h-12 border-0 bg-transparent pl-4 pr-1 text-sm text-[#111111] placeholder:text-[#777777] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-sans"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsFocused(true);
                }}
                className="p-1.5 mr-1 text-[#888888] hover:text-[#111111] rounded-full hover:bg-black/5 transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Round Circular Search Button */}
            <div className="pr-1.5 shrink-0">
              <button
                type="submit"
                className="h-9 w-9 rounded-full bg-[#111111] hover:bg-black text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black/20"
                aria-label="Search"
                title="Search forensic services"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick Search Recommendation Pills: Only Core VFRA Services */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#888888] mr-1 hidden sm:inline flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
              Services:
            </span>
            {VFRA_CORE_SERVICE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handlePillClick(tag)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 border active:scale-[0.97]",
                  query.toLowerCase() === tag.toLowerCase()
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white hover:bg-[#111111] text-[#444444] hover:text-white border-[#DCDAD4] hover:border-[#111111] shadow-2xs"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search Results Dropdown (Floating below the bar) */}
        <AnimatePresence>
          {isFocused && query.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 mt-3 bg-white border border-[#D8D6CE] rounded-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.22)] overflow-hidden z-50 divide-y divide-[#E5E5E3]"
            >
              {matchedServices.length > 0 ? (
                <>
                  <div className="px-4 py-2 bg-[#FAF9F6] flex items-center justify-between text-xs font-mono text-[#555555]">
                    <span>
                      Found {matchedServices.length}{" "}
                      {matchedServices.length === 1 ? "service" : "services"} for &ldquo;{query}&rdquo;
                    </span>
                    <span className="hidden sm:inline text-[11px] text-[#888888]">
                      Click any service to view full protocol
                    </span>
                  </div>

                  <div className="max-h-[340px] overflow-y-auto divide-y divide-[#F0EFEA]">
                    {matchedServices.slice(0, 5).map((service) => {
                      const Icon = service.icon;
                      const code = `SRV-${String(service.number).padStart(2, "0")}`;

                      return (
                        <div
                          key={service.number}
                          onClick={() => handleServiceClick(service)}
                          className="p-3.5 hover:bg-[#FAF9F6] transition-colors cursor-pointer group flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-[#F2F1ED] border border-[#E5E5E3] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                              <Icon className="h-4 w-4" />
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[9px] font-semibold text-[#888888] bg-[#F2F1ED] px-1.5 py-0.5 rounded">
                                  {code}
                                </span>
                                <h4 className="text-xs sm:text-sm font-semibold text-[#111111] group-hover:text-amber-600 transition-colors truncate">
                                  {service.title}
                                </h4>
                                <span
                                  className={cn(
                                    "px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded border",
                                    service.audience === "LEA" && "bg-[#111111] text-white border-[#111111]",
                                    service.audience === "Lawyers" && "bg-[#FAF9F6] text-[#111111] border-[#D4D4D0]",
                                    service.audience === "Both" && "bg-[#FAF9F6] text-[#555555] border-[#E5E5E3]"
                                  )}
                                >
                                  {service.audience === "Both" ? "LEA & Legal" : service.audience}
                                </span>
                              </div>
                              <p className="text-xs text-[#666666] line-clamp-1">
                                {service.description}
                              </p>
                            </div>
                          </div>

                          <ChevronRight className="h-4 w-4 text-[#888888] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="p-2.5 bg-[#FAF9F6] flex items-center justify-between gap-3">
                    <span className="text-xs text-[#666666] hidden sm:inline">
                      Official ISO/IEC &amp; Section 65B Compliant Laboratory
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSubmit()}
                      className="h-7 px-3 text-xs bg-[#111111] hover:bg-black text-white rounded-md flex items-center gap-1.5 ml-auto"
                    >
                      <span>View All Results in Directory</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <div className="h-8 w-8 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Search className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-[#111111]">
                    No service matched &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-[11px] text-[#666666] max-w-xs mx-auto">
                    Try clicking any of the core service pills above (e.g. Mobile Extraction, CDR Analysis, CCTV, Section 65B).
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/contact")}
                    className="text-xs h-7 mt-1"
                  >
                    Contact Forensic Laboratory
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
