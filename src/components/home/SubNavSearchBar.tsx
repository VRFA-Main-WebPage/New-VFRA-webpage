import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

// Top key & widely used forensic services
const KEY_SERVICE_NUMBERS = [1, 2, 4, 5, 10, 17, 18, 21];

export function SubNavSearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const barRef = useRef<HTMLDivElement>(null);

  // Close expanded card on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Widely used / key services displayed on initial click
  const widelyUsedServices = useMemo(() => {
    return VFRA_SERVICES.filter((s) => KEY_SERVICE_NUMBERS.includes(s.number));
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
      // 5. Any meaningful token (>3 chars) matches title
      else if (tokens.some((t) => t.length > 3 && titleLower.includes(t))) {
        score += 15;
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

  const displayedList = query.trim().length > 0 ? matchedServices : widelyUsedServices;

  return (
    <div
      ref={barRef}
      className="relative z-30 bg-[#FAF9F6] border-b border-[#E5E5E3] py-2.5 sm:py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
    >
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {/* Services We Provide Action in Front */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#2A2A2A] text-xs font-mono uppercase tracking-[0.08em] transition-all shadow-xs shrink-0 order-1 sm:order-none sm:mt-0.5"
          >
            <span>Services We Provide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Expandable Search Tile: Expands Downward on Click with Silky Smooth Pacing */}
          <div
            className={cn(
              "relative flex-1 max-w-xl w-full bg-white rounded-xl border border-[#D8D6CE] shadow-xs overflow-hidden transition-all duration-500 ease-out",
              isFocused
                ? "border-[#111111] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.14)] ring-2 ring-black/5"
                : "hover:border-[#111111]/40"
            )}
          >
            {/* Top Search Input Row */}
            <form onSubmit={handleSubmit} className="flex items-center px-1">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

            {/* Seamless Downward Expansion inside the Main Tile (Silky 0.65s Fluid Pacing) */}
            <AnimatePresence initial={false}>
              {isFocused && (
                <motion.div
                  key="search-expand-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.45, delay: 0.08, ease: "easeOut" },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.24, ease: "easeIn" },
                    },
                  }}
                  className="border-t border-[#E5E5E3] bg-[#FBFBFA] overflow-hidden"
                >
                  {query.trim().length === 0 ? (
                    <>
                      <div className="px-4 py-2.5 bg-[#F4F3EE] border-b border-[#EBEAE5] flex items-center justify-between text-xs font-mono text-[#555555]">
                        <span className="flex items-center gap-1.5 font-semibold text-[#111111]">
                          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          Key &amp; Widely Used Services
                        </span>
                        <span className="text-[11px] text-[#888888] hidden sm:inline">
                          Select or type to filter
                        </span>
                      </div>

                      <div className="max-h-[340px] overflow-y-auto p-2.5 sm:p-3 space-y-2">
                        {displayedList.map((service) => {
                          const Icon = service.icon;

                          return (
                            <div
                              key={service.number}
                              onClick={() => handleServiceClick(service)}
                              className="group p-2.5 sm:p-3 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E5E5E3] hover:border-[#111111] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-left"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-[#F5F4F0] border border-[#E5E5E3] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] transition-all shadow-2xs">
                                  <Icon className="h-4 w-4 text-[#111111] group-hover:text-white transition-colors" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-semibold text-[#111111] group-hover:text-[#825816] transition-colors truncate">
                                    {service.title}
                                  </h4>
                                </div>
                              </div>

                              <ChevronRight className="h-4 w-4 text-[#999999] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded Tile Footer */}
                      <div className="p-2.5 bg-[#F4F3EE] border-t border-[#EBEAE5] flex items-center justify-between gap-3">
                        <span className="text-xs text-[#666666] hidden sm:inline">
                          ISO/IEC &amp; Section 65B Compliant Forensic Catalogue
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSubmit()}
                          className="h-7 px-3 text-xs bg-[#111111] hover:bg-black text-white rounded-md flex items-center gap-1.5 ml-auto shadow-2xs"
                        >
                          <span>Explore All Services</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  ) : matchedServices.length > 0 ? (
                    <>
                      <div className="px-4 py-2.5 bg-[#F4F3EE] border-b border-[#EBEAE5] flex items-center justify-between text-xs font-mono text-[#555555]">
                        <span>
                          Found {matchedServices.length}{" "}
                          {matchedServices.length === 1 ? "service" : "services"} for &ldquo;{query}&rdquo;
                        </span>
                        <span className="hidden sm:inline text-[11px] text-[#888888]">
                          Click to explore protocol
                        </span>
                      </div>

                      <div className="max-h-[340px] overflow-y-auto p-2.5 sm:p-3 space-y-2">
                        {matchedServices.slice(0, 6).map((service) => {
                          const Icon = service.icon;

                          return (
                            <div
                              key={service.number}
                              onClick={() => handleServiceClick(service)}
                              className="group p-2.5 sm:p-3 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E5E5E3] hover:border-[#111111] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 text-left"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-[#F5F4F0] border border-[#E5E5E3] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] transition-all mt-0.5 shadow-2xs">
                                  <Icon className="h-4 w-4 text-[#111111] group-hover:text-white transition-colors" />
                                </div>

                                <div className="space-y-0.5 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-xs sm:text-sm font-semibold text-[#111111] group-hover:text-[#825816] transition-colors truncate">
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

                              <ChevronRight className="h-4 w-4 text-[#999999] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2.5 bg-[#F4F3EE] border-t border-[#EBEAE5] flex items-center justify-between gap-3">
                        <span className="text-xs text-[#666666] hidden sm:inline">
                          Official ISO/IEC &amp; Section 65B Compliant Laboratory
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSubmit()}
                          className="h-7 px-3 text-xs bg-[#111111] hover:bg-black text-white rounded-md flex items-center gap-1.5 ml-auto shadow-2xs"
                        >
                          <span>View All Results in Directory</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-5 text-center space-y-2">
                      <div className="h-7 w-7 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Search className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs font-semibold text-[#111111]">
                        No service matched &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-[11px] text-[#666666] max-w-xs mx-auto">
                        Try searching for keywords like Mobile, Chat, Crypto, CDR, CCTV, or Section 65B.
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
      </div>
    </div>
  );
}
