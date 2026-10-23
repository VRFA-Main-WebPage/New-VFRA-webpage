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

  // SVG Dimension Constants
  const SVG_W = 1920;
  const SVG_H = 560;
  const NW = 1330;
  const NH = 998;
  const S = 0.52;
  const W = NW * S;
  const H = NH * S;
  const OX = SVG_W / 2 - W / 2;
  const OY = 30;
  const GAP = 55;

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

  // Pre-calculate scaled paths and endpoints
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
        startDelay: srv.pairIndex * 0.11,
      };
    });
  }, [sc]);

  // Laser Pulse Animation Controller (Majestic Smooth Glide on View)
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
        const seg = Math.min(160, len * 0.28);
        p.style.strokeDasharray = `${seg} ${len + seg}`;
        p.style.strokeDashoffset = "-20";
      });

      dots.forEach((dot) => {
        dot.style.opacity = "0";
      });

      labels.forEach((g) => {
        g.style.opacity = "0";
      });

      return { paths, dots, labels, pathLengths };
    });

    const t0 = performance.now();
    const T = 1.15; // Smooth, graceful, majestic 1.15s laser flight
    const E = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));

    const frame = (now: number) => {
      const t = (now - t0) / 1000;

      svgData.forEach(({ paths, dots, labels, pathLengths }) => {
        scaledItems.forEach((item, i) => {
          const u = t - item.startDelay;
          const pGlow = paths[i * 2];
          const pCore = paths[i * 2 + 1];
          const dot = dots[i];
          const g = labels[i];

          if (u < 0) {
            if (pGlow && pCore) {
              pGlow.style.strokeDashoffset = "-20";
              pCore.style.strokeDashoffset = "-20";
            }
            return;
          }

          const len = pathLengths[i * 2] || 600;
          const seg = Math.min(160, len * 0.28);
          const k = u;
          const pos = E(k / T) * (len + seg);
          const off = seg - pos;

          if (pGlow && pCore) {
            if (k < T) {
              pGlow.style.strokeDashoffset = `${off}`;
              pCore.style.strokeDashoffset = `${off}`;
            } else {
              pGlow.style.strokeDashoffset = "-20";
              pCore.style.strokeDashoffset = "-20";
            }
          }

          // Dot & label opacity illuminates smoothly as laser reaches the tip
          if (u >= T * 0.7) {
            const q = Math.min(1, (u - T * 0.7) / 0.35);
            if (dot) {
              dot.style.opacity = `${Math.min(1, q * 2)}`;
            }
            if (g) {
              g.style.opacity = `${Math.min(1, q * 2)}`;
            }
          }
        });

        const last = 6 * 0.11 + T + 0.5;
        if (t > last) {
          dots.forEach((dot) => {
            dot.style.opacity = "1";
          });
          labels.forEach((g) => {
            g.style.opacity = "1";
          });
        }
      });

      const last = 6 * 0.11 + T + 0.5;
      if (t <= last) {
        rafRef.current = requestAnimationFrame(frame);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  // Trigger pulse on each view (scroll viewport entry)
  useEffect(() => {
    const el = wingsContainerRef.current;
    if (!el) return;

    const resetElements = () => {
      const paths = el.querySelectorAll<SVGPathElement>(".wing-laser-path");
      const dots = el.querySelectorAll<SVGCircleElement>(".wing-feather-dot");
      const labels = el.querySelectorAll<SVGGElement>(".wing-service-label");
      paths.forEach((p) => {
        p.style.strokeDashoffset = "-20";
      });
      dots.forEach((dot) => {
        dot.style.opacity = "0";
      });
      labels.forEach((g) => {
        g.style.opacity = "0";
      });
    };

    resetElements();

    if (typeof IntersectionObserver === "undefined") {
      playPulse();
      return;
    }

    let hasEverIntersected = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Trigger the animation on each view rapidly
          playPulse();
          hasEverIntersected = true;
        } else {
          // Scrolled out of view: cancel RAF and reset so next view triggers cleanly
          if (hasEverIntersected) {
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
            resetElements();
          }
        }
      },
      {
        threshold: 0.02,
        rootMargin: "60px 0px 60px 0px",
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
    <section className="relative pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F7F7F5] dark:bg-[#090B10] border-b border-[#E5E5E3] dark:border-white/10 overflow-hidden transition-colors duration-300">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 md:mb-10 border-b border-[#E5E5E3] dark:border-white/10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#825816] dark:text-[#D4AF37] font-semibold block mb-2">
              03 // CLINICAL SERVICE INDEX • 14 CORE DIVISIONS
            </span>
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

        {/* Wings Container for Both Desktop & Mobile with Synchronized Viewport Trigger */}
        <div ref={wingsContainerRef} className="relative w-full">
          {/* DESKTOP VIEW (1024px+): Widescreen 1920px Canvas with Feather Tip Labels */}
          <div className="hidden lg:flex justify-center w-full overflow-hidden">
            <div className="w-full max-w-[1920px]">
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="wings-anim-svg w-full h-auto block select-none"
                role="img"
                aria-label="Symmetrical wings illuminating fourteen forensic services at the flight feather tips"
              >
                <defs>
                  <filter id="wingLaserGlowDesktop" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.0" />
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

                {/* Dynamic Laser Feather Trailing Glow Paths & Nodes */}
                <g id="wingLaserFxDesktop">
                  {scaledItems.map((item, i) => {
                    const isHovered = activeIdx === i;
                    return (
                      <g key={`fx-desktop-${i}`}>
                        {/* Thicker Ambient Glow Beam */}
                        <path
                          d={item.scaledD}
                          fill="none"
                          stroke={isHovered ? "var(--wing-cyan, #0284c7)" : "var(--wing-beam, #d97706)"}
                          strokeWidth={isHovered ? 7.5 : 6.5}
                          strokeLinecap="round"
                          filter="url(#wingLaserGlowDesktop)"
                          opacity={isHovered ? 0.85 : 0.65}
                          className="wing-laser-path transition-all duration-200 pointer-events-none"
                          style={
                            isHovered
                              ? { strokeDasharray: "none", strokeDashoffset: "0" }
                              : undefined
                          }
                        />

                        {/* Sharp High-Intensity Core Laser Spine */}
                        <path
                          d={item.scaledD}
                          fill="none"
                          stroke={isHovered ? "var(--wing-cyan, #0284c7)" : "var(--wing-beam, #d97706)"}
                          strokeWidth={isHovered ? 2.6 : 2.2}
                          strokeLinecap="round"
                          opacity={isHovered ? 1.0 : 0.95}
                          className="wing-laser-path transition-all duration-200 pointer-events-none"
                          style={
                            isHovered
                              ? { strokeDasharray: "none", strokeDashoffset: "0" }
                              : undefined
                          }
                        />

                        {/* Feather Tip Glowing Pip / Node */}
                        <circle
                          cx={item.endX}
                          cy={item.endY}
                          r={isHovered ? 6 : 4.5}
                          fill={isHovered ? "#0284c7" : "#d97706"}
                          className="wing-feather-dot cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setActiveIdx(i)}
                          onMouseLeave={() => setActiveIdx(null)}
                          onClick={() => handleServiceClick(item)}
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Interactive Service Titles (19px Bold, Single-Line, 55px Standoff Margin) */}
                <g id="wingServiceLabelsDesktop">
                  {scaledItems.map((item, i) => {
                    const isHovered = activeIdx === i;
                    return (
                      <g
                        key={`label-desktop-${i}`}
                        className="wing-service-label cursor-pointer group transition-all duration-200"
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseLeave={() => setActiveIdx(null)}
                        onClick={() => handleServiceClick(item)}
                      >
                        <text
                          x={item.textX}
                          y={item.textY}
                          textAnchor={item.isLeft ? "end" : "start"}
                          className="text-[19px] font-extrabold tracking-[-0.015em] transition-colors duration-200"
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
                          {item.title}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* MOBILE & TABLET VIEW (< 1024px): Full Uncut Outstretched Wings + Laser Animation + 14 Core Divisions Grid */}
          <div className="block lg:hidden w-full">
            {/* Centered Symmetrical Wings Graphic: Perfectly Framed from Tip to Tip */}
            <div className="w-full max-w-[480px] mx-auto px-1 sm:px-2">
              <svg
                viewBox="600 15 720 545"
                className="wings-anim-svg w-full h-auto block select-none drop-shadow-sm"
                role="img"
                aria-label="Symmetrical wings illuminating forensic divisions"
              >
                <defs>
                  <filter id="wingLaserGlowMobile" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.0" />
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
                          stroke={isHovered ? "var(--wing-cyan, #0284c7)" : "var(--wing-beam, #d97706)"}
                          strokeWidth={isHovered ? 7.5 : 6.5}
                          strokeLinecap="round"
                          filter="url(#wingLaserGlowMobile)"
                          opacity={isHovered ? 0.85 : 0.65}
                          className="wing-laser-path transition-all duration-200 pointer-events-none"
                          style={
                            isHovered
                              ? { strokeDasharray: "none", strokeDashoffset: "0" }
                              : undefined
                          }
                        />
                        <path
                          d={item.scaledD}
                          fill="none"
                          stroke={isHovered ? "var(--wing-cyan, #0284c7)" : "var(--wing-beam, #d97706)"}
                          strokeWidth={isHovered ? 2.6 : 2.2}
                          strokeLinecap="round"
                          opacity={isHovered ? 1.0 : 0.95}
                          className="wing-laser-path transition-all duration-200 pointer-events-none"
                          style={
                            isHovered
                              ? { strokeDasharray: "none", strokeDashoffset: "0" }
                              : undefined
                          }
                        />
                        <circle
                          cx={item.endX}
                          cy={item.endY}
                          r={isHovered ? 7 : 5}
                          fill={isHovered ? "#0284c7" : "#d97706"}
                          className="wing-feather-dot cursor-pointer transition-all duration-200"
                          onClick={() => handleServiceClick(item)}
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* 14 Core Divisions Responsive Grid Directly Below Outstretched Wings */}
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
