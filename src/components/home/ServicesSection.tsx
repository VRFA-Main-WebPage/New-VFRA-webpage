import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { WING_SERVICES, type WingServiceItem } from "@/data/wingFeatherPaths";

export function ServicesSection() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "cyber";

  const wingsContainerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // SVG Dimension Constants (1920x580 coordinate system for desktop widescreen)
  const SVG_W = 1920;
  const SVG_H = 580;
  const NW = 1330;
  const NH = 998;
  const S = 0.52;
  const W = NW * S;
  const H = NH * S;
  const OX = SVG_W / 2 - W / 2; // 614.2
  const OY = 30;
  const GAP = 40; // Clean standoff margin directly at feather tips

  // Coordinate scaling function from native image (1330x998) to SVG canvas
  const sc = useMemo(
    () => (d: string) =>
      d.replace(
        /(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g,
        (_, x, y) =>
          (OX + parseFloat(x) * S).toFixed(1) +
          "," +
          (OY + parseFloat(y) * S).toFixed(1)
      ),
    [OX, OY, S]
  );

  // Pre-calculate scaled paths and endpoints for all 14 services (spread from top pinnacle to lowest feather)
  const scaledItems = useMemo(() => {
    return WING_SERVICES.map((srv, index) => {
      const scaledD = sc(srv.path);
      const parts = scaledD.split(" ");
      const lastCmd = parts[parts.length - 1];
      const [endXStr, endYStr] = lastCmd.slice(1).split(",");
      const endX = parseFloat(endXStr);
      const endY = parseFloat(endYStr);
      const isLeft = srv.side < 0;
      const textX = endX + (isLeft ? -GAP : GAP);
      const textY = endY + 6;

      return {
        ...srv,
        index,
        scaledD,
        endX,
        endY,
        isLeft,
        textX,
        textY,
      };
    });
  }, [sc]);

  // Continuous Laser Pulse Animation Controller
  // Graceful, stately, continuous loop — ZERO static thick line, perpetually active after revealing services
  const playPulse = () => {
    if (typeof window === "undefined") return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const container = wingsContainerRef.current;
    if (!container) return;

    const svgs = container.querySelectorAll<SVGSVGElement>("svg.wings-anim-svg");
    if (svgs.length === 0) return;

    const svgData = Array.from(svgs).map((svg) => {
      const paths = svg.querySelectorAll<SVGPathElement>(".wing-laser-path");
      const dots = svg.querySelectorAll<SVGCircleElement>(".wing-feather-dot");
      const labels = svg.querySelectorAll<SVGGElement>(".wing-service-label");

      const pathLengths: number[] = [];
      paths.forEach((p, i) => {
        const len = p.getTotalLength();
        pathLengths[i] = len;
        const seg = Math.min(150, len * 0.28);
        p.style.strokeDasharray = `${seg} ${len + seg + 200}`;
        p.style.strokeDashoffset = `${seg}`;
        p.style.opacity = "0";
      });

      return { paths, dots, labels, pathLengths };
    });

    const t0 = performance.now();
    const T_FLIGHT = 1.6; // Majestic, slow, graceful laser flight
    const T_CYCLE = 4.2;  // 4.2s smooth continuous looping rhythm
    const E = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));

    let revealed = false;

    const frame = (now: number) => {
      const totalElapsed = (now - t0) / 1000;
      const cycleT = totalElapsed % T_CYCLE;

      svgData.forEach(({ paths, dots, labels, pathLengths }) => {
        scaledItems.forEach((item, i) => {
          const delay = item.pairIndex * 0.16; // Cascading delay down the wing
          const u = cycleT - delay;
          const p = paths[i];
          const dot = dots[i];
          const g = labels[i];

          const len = pathLengths[i] || 500;
          const seg = Math.min(150, len * 0.28);

          if (u < 0) {
            // Not started yet in current cycle
            if (p) {
              p.style.opacity = "0";
              p.style.strokeDashoffset = `${seg}`;
            }
          } else if (u < T_FLIGHT) {
            // Laser beam actively traveling along feather spine
            const pos = E(u / T_FLIGHT) * (len + seg);
            const off = seg - pos;
            if (p) {
              p.style.opacity = "1";
              p.style.strokeDashoffset = `${off}`;
            }
            // Dot & label illuminate when laser reaches tip
            if (u >= T_FLIGHT * 0.65 && dot) {
              const q = Math.min(1, (u - T_FLIGHT * 0.65) / (T_FLIGHT * 0.35));
              dot.style.opacity = `${Math.max(parseFloat(dot.style.opacity || "0"), q)}`;
            }
            if (u >= T_FLIGHT * 0.75 && g) {
              const q = Math.min(1, (u - T_FLIGHT * 0.75) / (T_FLIGHT * 0.25));
              g.style.opacity = `${Math.max(parseFloat(g.style.opacity || "0"), q)}`;
            }
          } else {
            // Beam flight completed for this feather — hide laser beam cleanly so zero residual line is left
            if (p) {
              p.style.opacity = "0";
              p.style.strokeDashoffset = `${seg}`;
            }
            if (dot) dot.style.opacity = "1";
            if (g) g.style.opacity = "1";
          }
        });

        // Once the first wave has revealed all items, keep them permanently visible
        if (totalElapsed > 2.5 && !revealed) {
          revealed = true;
          dots.forEach((dot) => { dot.style.opacity = "1"; });
          labels.forEach((g) => { g.style.opacity = "1"; });
        }
      });

      // Keep animation continuously moving as requested
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  // Trigger pulse on scroll into viewport
  useEffect(() => {
    const el = wingsContainerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      playPulse();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          playPulse();
        } else {
          // Cancel RAF when out of view to preserve device performance
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "80px 0px 80px 0px",
      }
    );

    observer.observe(el);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && wingsContainerRef.current) {
        const rect = wingsContainerRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          playPulse();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [scaledItems]);

  const handleServiceClick = (srv: WingServiceItem) => {
    navigate(`/services?q=${encodeURIComponent(srv.query)}`);
  };

  return (
    <section className="relative pt-8 md:pt-12 pb-8 md:pb-12 bg-[#F7F7F5] dark:bg-[#090B10] border-b border-[#E5E5E3] dark:border-white/10 overflow-hidden transition-colors duration-300">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-5 mb-5 md:mb-6 border-b border-[#E5E5E3] dark:border-white/10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111111] dark:text-white tracking-[-0.03em] leading-tight">
              Comprehensive Investigation Support.
            </h2>
            <p className="text-[#555555] dark:text-[#94A3B8] text-sm md:text-base mt-2 max-w-2xl">
              Digital forensics, cellular OSINT, cryptocurrency tracing, and statutory evidence certification, spreading outwards from one vigilant central wingspan.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={playPulse}
              className="gap-2 border-[#825816]/30 dark:border-[#D4AF37]/30 text-[#825816] dark:text-[#D4AF37] hover:bg-[#825816]/10 dark:hover:bg-[#D4AF37]/10 font-mono text-xs uppercase tracking-wider"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Replay Pulse
            </Button>
            <Link to="/services">
              <Button className="bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#2A2A2A] dark:hover:bg-slate-200 text-xs font-mono uppercase tracking-[0.1em] gap-2">
                All Services
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Wings Container: Fully Mobile Responsive & Desktop Widescreen */}
        <div ref={wingsContainerRef} className="relative w-full">
          {/* DESKTOP VIEW (1024px+): Widescreen 1920x580 Canvas with Full Clinical Titles */}
          <div className="hidden lg:flex justify-center w-full overflow-hidden">
            <div className="w-full max-w-[1920px]">
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="wings-anim-svg w-full h-auto block select-none"
                role="img"
                aria-label="Symmetrical eagle wings illuminating fourteen forensic divisions"
              >
                <defs>
                  <filter id="wingLaserGlowDesktop" x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur stdDeviation="2.0" />
                  </filter>
                </defs>

                {/* Symmetrical Wings Base Image */}
                <image
                  href={isDark ? "/wings-pair-dark.png" : "/wings-pair-light.png"}
                  x={OX}
                  y={OY}
                  width={W}
                  height={H}
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* Laser Feather Trailing Beams (Zero Static Line - Opacity 0 when idle) */}
                <g id="wingLaserFxDesktop">
                  {scaledItems.map((item, i) => {
                    const isHovered = activeIdx === i;
                    return (
                      <g key={`fx-desktop-${i}`}>
                        <path
                          d={item.scaledD}
                          fill="none"
                          stroke={isHovered ? "#0284c7" : "#d97706"}
                          strokeWidth={isHovered ? 3.0 : 2.2}
                          strokeLinecap="round"
                          filter="url(#wingLaserGlowDesktop)"
                          className="wing-laser-path transition-opacity duration-150 pointer-events-none"
                          style={{
                            opacity: isHovered ? 1 : 0,
                            strokeDasharray: isHovered ? "none" : undefined,
                            strokeDashoffset: isHovered ? "0" : undefined,
                          }}
                        />

                        {/* Feather Tip Glowing Pip / Evidentiary Node */}
                        <circle
                          cx={item.endX}
                          cy={item.endY}
                          r={isHovered ? 6.5 : 4.5}
                          fill={isHovered ? "#0284c7" : "#d97706"}
                          className="wing-feather-dot cursor-pointer transition-all duration-200"
                          style={{ opacity: 0 }}
                          onMouseEnter={() => setActiveIdx(i)}
                          onMouseLeave={() => setActiveIdx(null)}
                          onClick={() => handleServiceClick(item)}
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Interactive Service Titles (22px Font-Black, High Legibility, 40px Standoff) */}
                <g id="wingServiceLabelsDesktop">
                  {scaledItems.map((item, i) => {
                    const isHovered = activeIdx === i;
                    return (
                      <g
                        key={`label-desktop-${i}`}
                        className="wing-service-label cursor-pointer group transition-all duration-200"
                        style={{ opacity: 0 }}
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseLeave={() => setActiveIdx(null)}
                        onClick={() => handleServiceClick(item)}
                      >
                        <text
                          x={item.textX}
                          y={item.textY}
                          textAnchor={item.isLeft ? "end" : "start"}
                          className="text-[22px] font-black tracking-[-0.018em] transition-colors duration-200 select-none"
                          fill={
                            isHovered
                              ? isDark
                                ? "#38BDF8"
                                : "#0284C7"
                              : isDark
                              ? "#FFFFFF"
                              : "#0A0E1A"
                          }
                        >
                          {item.title}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* MOBILE & TABLET VIEW (< 1024px): Services Visible at the Edge of Wings + 100% Mobile Responsive */}
          <div className="block lg:hidden w-full">
            {/* Symmetrical Wings with Services Visibly Positioned Directly at the Wing Feather Edges */}
            <div className="w-full max-w-[640px] mx-auto px-0.5">
              <svg
                viewBox="180 15 1560 565"
                className="wings-anim-svg w-full h-auto block select-none drop-shadow-sm"
                role="img"
                aria-label="Symmetrical wings illuminating forensic divisions at wing edges"
              >
                <defs>
                  <filter id="wingLaserGlowMobile" x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur stdDeviation="2.2" />
                  </filter>
                </defs>

                {/* Central Symmetrical Mirrored Pair of Wings */}
                <image
                  href={isDark ? "/wings-pair-dark.png" : "/wings-pair-light.png"}
                  x={OX}
                  y={OY}
                  width={W}
                  height={H}
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* Laser Feather Trailing Glow Paths on Mobile Wings */}
                <g id="wingLaserFxMobile">
                  {scaledItems.map((item, i) => {
                    const isHovered = activeIdx === i;
                    return (
                      <g key={`fx-mobile-${i}`}>
                        <path
                          d={item.scaledD}
                          fill="none"
                          stroke={isHovered ? "#0284c7" : "#d97706"}
                          strokeWidth={isHovered ? 3.5 : 2.6}
                          strokeLinecap="round"
                          filter="url(#wingLaserGlowMobile)"
                          className="wing-laser-path transition-opacity duration-150 pointer-events-none"
                          style={{
                            opacity: isHovered ? 1 : 0,
                            strokeDasharray: isHovered ? "none" : undefined,
                            strokeDashoffset: isHovered ? "0" : undefined,
                          }}
                        />
                        <circle
                          cx={item.endX}
                          cy={item.endY}
                          r={isHovered ? 8 : 6}
                          fill={isHovered ? "#0284c7" : "#d97706"}
                          className="wing-feather-dot cursor-pointer transition-all duration-200"
                          style={{ opacity: 0 }}
                          onClick={() => handleServiceClick(item)}
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Services Visible Directly at the Edge of the Wings on Mobile */}
                <g id="wingServiceLabelsMobile">
                  {scaledItems.map((item, i) => {
                    const isHovered = activeIdx === i;
                    return (
                      <g
                        key={`label-mobile-${i}`}
                        className="wing-service-label cursor-pointer group"
                        style={{ opacity: 0 }}
                        onClick={() => handleServiceClick(item)}
                      >
                        <text
                          x={item.isLeft ? item.endX - 22 : item.endX + 22}
                          y={item.endY + 8}
                          textAnchor={item.isLeft ? "end" : "start"}
                          className="text-[27px] font-black tracking-tight select-none"
                          fill={
                            isHovered
                              ? isDark
                                ? "#38BDF8"
                                : "#0284C7"
                              : isDark
                              ? "#FFFFFF"
                              : "#0F172A"
                          }
                        >
                          {item.shortTitle}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* 14 Core Divisions Quick Tap Grid Directly Below Wings for Touch Accessibility */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E5E5E3] dark:border-white/10">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#825816] dark:text-[#D4AF37] font-semibold">
                  14 Forensic Divisions
                </span>
                <span className="text-xs text-[#777777] dark:text-[#94A3B8]">
                  Tap division to view
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {scaledItems.map((item, i) => (
                  <button
                    key={`m-card-${i}`}
                    onClick={() => handleServiceClick(item)}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-lg border border-[#E5E5E3] dark:border-white/10 bg-white dark:bg-[#121620] hover:border-[#825816]/40 dark:hover:border-[#D4AF37]/40 hover:bg-slate-50 dark:hover:bg-[#181D2A] transition-all text-left shadow-sm group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-[#825816]/10 dark:bg-[#D4AF37]/15 text-[#825816] dark:text-[#D4AF37] shrink-0">
                        {item.code}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#111111] dark:text-white group-hover:text-[#825816] dark:group-hover:text-[#D4AF37] transition-colors truncate">
                        {item.title}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#888888] group-hover:text-[#825816] dark:group-hover:text-[#D4AF37] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
