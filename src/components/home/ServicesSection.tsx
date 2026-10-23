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

  const svgRef = useRef<SVGSVGElement | null>(null);
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
        startDelay: srv.pairIndex * 0.05,
      };
    });
  }, [sc]);

  // Laser Pulse Animation Controller (Rapid Instant Ignition on View)
  const playPulse = () => {
    if (typeof window === "undefined") return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll<SVGPathElement>(".wing-laser-path");
    const dots = svg.querySelectorAll<SVGCircleElement>(".wing-feather-dot");
    const labels = svg.querySelectorAll<SVGGElement>(".wing-service-label");

    // Initialize paths
    const pathLengths: number[] = [];
    paths.forEach((p, i) => {
      const len = p.getTotalLength();
      pathLengths[i] = len;
      const seg = Math.min(180, len * 0.3);
      p.style.strokeDasharray = `${seg} ${len + seg}`;
      p.style.strokeDashoffset = "-20";
    });

    dots.forEach((dot) => {
      dot.style.opacity = "0";
    });

    labels.forEach((g) => {
      g.style.opacity = "0";
    });

    const t0 = performance.now();
    const T = 0.55; // Rapid 0.55s laser travel time
    const E = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));

    const frame = (now: number) => {
      const t = (now - t0) / 1000;

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
        const seg = Math.min(180, len * 0.3);
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

        // Dot & label opacity illuminates rapidly as laser approaches the tip
        if (u >= T * 0.45) {
          const q = Math.min(1, (u - T * 0.45) / 0.22);
          if (dot) {
            dot.style.opacity = `${Math.min(1, q * 2)}`;
          }
          if (g) {
            g.style.opacity = `${Math.min(1, q * 2)}`;
          }
        }
      });

      const last = 6 * 0.05 + T + 0.35;
      if (t > last) {
        dots.forEach((dot) => {
          dot.style.opacity = "1";
        });
        labels.forEach((g) => {
          g.style.opacity = "1";
        });
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  // Trigger pulse on each view (scroll viewport entry)
  useEffect(() => {
    const el = wingsContainerRef.current;
    if (!el) return;

    const svg = svgRef.current;
    if (svg) {
      const paths = svg.querySelectorAll<SVGPathElement>(".wing-laser-path");
      const dots = svg.querySelectorAll<SVGCircleElement>(".wing-feather-dot");
      const labels = svg.querySelectorAll<SVGGElement>(".wing-service-label");
      paths.forEach((p) => {
        p.style.strokeDashoffset = "-20";
      });
      dots.forEach((dot) => {
        dot.style.opacity = "0";
      });
      labels.forEach((g) => {
        g.style.opacity = "0";
      });
    }

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
            if (svgRef.current) {
              const paths = svgRef.current.querySelectorAll<SVGPathElement>(".wing-laser-path");
              const dots = svgRef.current.querySelectorAll<SVGCircleElement>(".wing-feather-dot");
              const labels = svgRef.current.querySelectorAll<SVGGElement>(".wing-service-label");
              paths.forEach((p) => {
                p.style.strokeDashoffset = "-20";
              });
              dots.forEach((dot) => {
                dot.style.opacity = "0";
              });
              labels.forEach((g) => {
                g.style.opacity = "0";
              });
            }
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
    <section className="relative pt-12 md:pt-16 pb-4 md:pb-6 bg-[#F7F7F5] dark:bg-[#090B10] border-b border-[#E5E5E3] dark:border-white/10 overflow-hidden transition-colors duration-300">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-10 border-b border-[#E5E5E3] dark:border-white/10">
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
                All 26 Services
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* The Symmetrical Wings SVG Animation Canvas */}
        <div
          ref={wingsContainerRef}
          className="relative w-full overflow-x-auto hide-scrollbar flex justify-center"
        >
          <div className="min-w-[1000px] w-full max-w-[1920px]">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full h-auto block select-none"
              role="img"
              aria-label="Symmetrical wings illuminating fourteen forensic services at the flight feather tips"
            >
              <defs>
                <filter id="wingLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
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
              <g id="wingLaserFx">
                {scaledItems.map((item, i) => {
                  const isHovered = activeIdx === i;
                  return (
                    <g key={`fx-${i}`}>
                      {/* Thicker Ambient Glow Beam */}
                      <path
                        d={item.scaledD}
                        fill="none"
                        stroke={isHovered ? "var(--wing-cyan, #0284c7)" : "var(--wing-beam, #d97706)"}
                        strokeWidth={isHovered ? 7.5 : 6.5}
                        strokeLinecap="round"
                        filter="url(#wingLaserGlow)"
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
              <g id="wingServiceLabels">
                {scaledItems.map((item, i) => {
                  const isHovered = activeIdx === i;
                  return (
                    <g
                      key={`label-${i}`}
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
      </div>
    </section>
  );
}
