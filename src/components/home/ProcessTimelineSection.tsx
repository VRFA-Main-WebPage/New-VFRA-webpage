import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { FORENSIC_PROCESS_STEPS } from "@/data/vfraServices";
import { Button } from "@/components/ui/button";

export function ProcessTimelineSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // 6 node X coordinates centered over the 6 columns in a 1200px coordinate system:
  // Column centers: 1200 / 6 * (i + 0.5) => [100, 300, 500, 700, 900, 1100]
  const NODE_X = [100, 300, 500, 700, 900, 1100];
  const START_X = 100;
  const END_X = 1100;
  const TOTAL_DIST = END_X - START_X;

  const playConnectingAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setActiveStep(0);
    setProgress(0);

    const startTime = performance.now();
    const duration = 2400; // ms to connect all 6 steps

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      const curX = START_X + p * TOTAL_DIST;
      let reached = 0;
      for (let i = 0; i < NODE_X.length; i++) {
        if (curX >= NODE_X[i] - 15) {
          reached = i + 1;
        }
      }
      setActiveStep(reached);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setActiveStep(6);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  // Trigger connecting dot animation on each view (scroll viewport entry)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      playConnectingAnimation();
      return;
    }

    let hasEverIntersected = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          playConnectingAnimation();
          hasEverIntersected = true;
        } else {
          if (hasEverIntersected) {
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
            setActiveStep(0);
            setProgress(0);
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          playConnectingAnimation();
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
  }, []);

  const curBeamX = START_X + progress * TOTAL_DIST;

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 lg:py-28 bg-[#F7F7F5] border-b border-[#E5E5E3] overflow-hidden"
    >
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 border-b border-[#E5E5E3]">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-semibold tracking-[0.16em] text-[#825816] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              05 // STANDARD OPERATING PROTOCOL
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111111] tracking-[-0.03em] leading-tight">
              Six-Step Forensic Workflow.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#555555] max-w-md leading-relaxed">
              A disciplined protocol from intake consultation through judicial testimony—engineered for evidentiary integrity and auditability.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={playConnectingAnimation}
              className="self-start sm:self-auto gap-2 border-[#D4AF37]/40 text-[#825816] hover:bg-[#D4AF37]/10 font-mono text-xs uppercase tracking-wider shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Replay Pipeline
            </Button>
          </div>
        </div>

        {/* Desktop Connected Dots SVG Pipeline Track */}
        <div className="hidden lg:block w-full mb-3">
          <svg
            viewBox="0 0 1200 48"
            className="w-full h-12 block overflow-visible select-none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="pipelineGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Dashed Guide Line */}
            <line
              x1={START_X}
              y1={24}
              x2={END_X}
              y2={24}
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Animated Laser Connector Beam */}
            {progress > 0 && (
              <line
                x1={START_X}
                y1={24}
                x2={curBeamX}
                y2={24}
                stroke="#D4AF37"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#pipelineGlow)"
              />
            )}

            {/* 6 Connected Milestone Nodes */}
            {NODE_X.map((x, i) => {
              const isReached = activeStep > i;
              const isCurrent = activeStep === i + 1;
              const isHovered = hoveredStep === i + 1;
              const isActive = isReached || isHovered;

              return (
                <g key={`node-${i}`} className="transition-all duration-300">
                  {/* Expanding Ripple Sonar Pulse when reached */}
                  {isCurrent && progress < 1 && (
                    <circle
                      cx={x}
                      cy={24}
                      r={16}
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="1.5"
                      className="animate-[nodeRipplePulse_1.2s_ease-out_infinite]"
                    />
                  )}

                  {/* Outer Node Ring */}
                  <circle
                    cx={x}
                    cy={24}
                    r={isActive ? 11 : 9}
                    fill="#FFFFFF"
                    stroke={isActive ? "#D4AF37" : "#CBD5E1"}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-all duration-300"
                    style={
                      isActive
                        ? { filter: "drop-shadow(0 0 6px rgba(212, 175, 55, 0.7))" }
                        : undefined
                    }
                  />

                  {/* Inner Core Glowing Pip */}
                  <circle
                    cx={x}
                    cy={24}
                    r={isActive ? 5.5 : 4}
                    fill={isActive ? "#D4AF37" : "#94A3B8"}
                    className="transition-all duration-300"
                    style={
                      isActive
                        ? { filter: "drop-shadow(0 0 4px #D4AF37)" }
                        : undefined
                    }
                  />

                  {/* Step Milestone Label */}
                  <text
                    x={x}
                    y={10}
                    textAnchor="middle"
                    className="font-mono text-[9.5px] font-bold tracking-wider transition-colors duration-300"
                    fill={isActive ? "#825816" : "#71717A"}
                  >
                    0{i + 1}
                  </text>
                </g>
              );
            })}

            {/* Traveling Comet Light Dot */}
            {progress > 0 && progress < 1 && (
              <circle
                cx={curBeamX}
                cy={24}
                r={5.5}
                fill="#FFFFFF"
                filter="url(#pipelineGlow)"
                style={{
                  filter:
                    "drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 8px #D4AF37) drop-shadow(0 0 14px #38BDF8)",
                }}
              />
            )}
          </svg>
        </div>

        {/* Six Forensic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 border border-[#E5E5E3] bg-white rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E3] shadow-sm overflow-hidden">
          {FORENSIC_PROCESS_STEPS.map((item, idx) => {
            const isReached = activeStep >= item.step;
            const isCurrent = activeStep === item.step;
            const isHovered = hoveredStep === item.step;
            const isActive = isReached || isHovered;

            return (
              <div
                key={item.step}
                onMouseEnter={() => setHoveredStep(item.step)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`relative p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isActive ? "bg-[#FAFAF8]" : "bg-white hover:bg-[#F7F7F5]/60"
                }`}
              >
                {/* Active Step Top Indicator Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] shadow-[0_2px_8px_rgba(212,175,55,0.6)]"
                      : "bg-transparent"
                  }`}
                />

                {/* Mobile / Tablet Connected Node Indicator */}
                <div className="lg:hidden flex items-center gap-2 mb-3 pb-2 border-b border-[#E5E5E3]">
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
                        : "bg-[#CBD5E1]"
                    }`}
                  />
                  <span className="font-mono text-[10px] text-[#71717A] tracking-wider">
                    CHAIN NODE 0{item.step} // 06
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-sm transition-all duration-300 ${
                        isActive
                          ? "bg-[#D4AF37] text-[#111111] shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                          : "bg-[#111111] text-white"
                      }`}
                    >
                      0{item.step}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                      PHASE
                    </span>
                  </div>
                  <h3
                    className={`font-heading text-base font-semibold mb-2 leading-snug transition-colors duration-200 ${
                      isActive ? "text-[#825816]" : "text-[#111111]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E5E5E3] flex items-center justify-between font-mono text-[10px] text-[#71717A]">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857]"
                        : "bg-transparent text-[#71717A]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive
                          ? "bg-[#10B981] animate-pulse"
                          : "bg-[#94A3B8]"
                      }`}
                    />
                    VERIFIED
                  </span>
                  <span>STEP 0{item.step}/06</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Evidentiary Pipeline Status Line */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#71717A] px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            <span>
              STATUS:{" "}
              <strong className="text-[#825816] uppercase">
                {activeStep === 6
                  ? "CHAIN OF CUSTODY VERIFIED // ALL 6 PHASES SYNCHRONIZED"
                  : `SYNCHRONIZING PHASE 0${activeStep || 1} OF 06...`}
              </strong>
            </span>
          </div>
          <span className="hidden sm:inline">EVIDENTIARY AUDIT STANDARD // ISO-17025 COMPLIANT</span>
        </div>
      </div>
    </section>
  );
}
