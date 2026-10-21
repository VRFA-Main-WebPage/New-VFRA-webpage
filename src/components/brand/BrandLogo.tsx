import { useState } from "react";
import vfraLogo from "@/assets/vfra-logo.webp";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  interactive?: boolean;
}

export function BrandLogo({
  className,
  size = "md",
  showText = false,
  interactive = true,
}: BrandLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Generous, prominent heights with natural emblem aspect ratio
  const sizeClasses = {
    sm: "h-11 sm:h-12 w-auto aspect-[513/640]",
    md: "h-14 sm:h-[62px] w-auto aspect-[513/640]",
    lg: "h-20 sm:h-24 w-auto aspect-[513/640]",
  }[size];

  return (
    <div
      className={cn("flex items-center gap-3.5 select-none", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Freestanding Emblem Wrapper (NO BORDER, completely unconstrained for maximum visibility) */}
      <div
        className={cn(
          "relative flex items-center justify-center transition-transform duration-300",
          interactive && "group-hover:scale-[1.04]",
          sizeClasses
        )}
      >
        {/* Soft Ambient Gold Backlight Breathing directly behind the crest */}
        <div
          className="absolute inset-[-10%] pointer-events-none rounded-full animate-[eagleBodyBreathe_5s_ease-in-out_infinite_alternate]"
          style={{
            background:
              "radial-gradient(circle at 60% 45%, rgba(212, 175, 55, 0.35) 0%, rgba(212, 175, 55, 0.08) 55%, transparent 75%)",
          }}
        />

        {/* Eagle Silhouette Masked Sheen Sweep (Shine sweeps strictly across eagle feathers & shield) */}
        <div
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          style={{
            WebkitMaskImage: `url(${vfraLogo})`,
            maskImage: `url(${vfraLogo})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          <div
            className={cn(
              "absolute -inset-full w-[250%] h-[250%] pointer-events-none",
              "bg-gradient-to-r from-transparent via-amber-200/50 via-white/70 to-transparent",
              "-rotate-45",
              interactive && isHovered
                ? "animate-[logoSheenHover_1s_ease-in-out_forwards]"
                : "animate-[logoSheenSweep_7s_cubic-bezier(0.4,0,0.2,1)_infinite]"
            )}
          />
        </div>

        {/* High-Definition Eagle Crest Image */}
        <img
          src={vfraLogo}
          alt="VFRA Crest"
          className={cn(
            "relative w-full h-full object-contain transition-all duration-300",
            "filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.14)]",
            interactive && isHovered && "drop-shadow-[0_6px_18px_rgba(212,175,55,0.4)]"
          )}
          loading="eager"
          decoding="async"
        />

        {/* Eagle Eye Watcher Cinematic Lens Glint */}
        {/* Exact pupil coordinates: Left 69.4%, Top 20.3% */}
        <div
          className="absolute pointer-events-none z-20 w-0 h-0 flex items-center justify-center"
          style={{
            left: "69.4%",
            top: "20.3%",
          }}
          aria-hidden="true"
        >
          {/* Dynamic Optical Flare (Zero static dot: completely transparent when resting) */}
          <div
            className={cn(
              "absolute pointer-events-none flex items-center justify-center w-0 h-0 mix-blend-screen",
              interactive && isHovered
                ? "animate-[eagleEyeHoverGlint_0.9s_ease-out_forwards]"
                : "animate-[eagleEyeGleamCycle_5.5s_cubic-bezier(0.4,0,0.2,1)_infinite]"
            )}
          >
            {/* Horizontal anamorphic specular laser streak */}
            <span className="absolute w-7 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 shadow-[0_0_8px_#FFF]" />

            {/* Vertical lens streak */}
            <span className="absolute h-4 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent opacity-80" />

            {/* Specular brilliant white core */}
            <span className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#FFF,0_0_12px_rgba(251,191,36,0.9)]" />

            {/* Ambient golden aura */}
            <span className="absolute w-4 h-4 rounded-full bg-amber-400/50 blur-[2px]" />
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-heading font-bold text-base sm:text-[18px] tracking-[-0.02em] text-[#111111]">
            VIGILANT FORENSIC
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#555555] mt-0.5">
            Research &amp; Analytics
          </span>
        </div>
      )}
    </div>
  );
}
