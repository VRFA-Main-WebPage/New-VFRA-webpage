import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridScan from "./GridScan";
import { ShieldCheck, Terminal, X } from "lucide-react";

export function GridScanIntro() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING FORENSIC ENVIRONMENT...");

  useEffect(() => {
    // Only trigger once per browser session when the site is opened
    const alreadySeen = sessionStorage.getItem("vfra_grid_scan_intro_played");
    if (!alreadySeen) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    // Progression timeline
    const startTime = performance.now();
    const duration = 2600; // 2.6 seconds

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 35) {
        setStatusText("SWEEPING 3D SENSOR MATRIX...");
      } else if (pct < 70) {
        setStatusText("VERIFYING EVIDENCE ARCHITECTURE (BSA 2023)...");
      } else if (pct < 98) {
        setStatusText("CALIBRATION COMPLETE · DEPLOYING INTERFACE...");
      } else {
        setStatusText("SYSTEM READY // ACCESS GRANTED");
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          handleDismiss();
        }, 350);
      }
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  const handleDismiss = () => {
    sessionStorage.setItem("vfra_grid_scan_intro_played", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="vfra-grid-scan-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#0A0A0C] flex flex-col items-center justify-between overflow-hidden select-none"
        >
          {/* React Bits 3D GridScan Canvas */}
          <div className="absolute inset-0 pointer-events-auto">
            <GridScan
              linesColor="#3f384d"
              scanColor="#7dd3fc"
              lineStyle="solid"
              scanDirection="forward"
              clickEffect="ping"
              scanDuration={2.0}
              glow={1.2}
              interactive={true}
              autoScan={true}
            />
          </div>

          {/* Top Forensic HUD Bar */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between text-xs font-mono text-cyan-400/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="tracking-[0.2em] font-semibold text-white">VFRA · LAB SCANNER</span>
              <span className="text-white/30">|</span>
              <span className="text-white/60 hidden sm:inline">SYS_VER 4.2 · BESA_HQ</span>
            </div>

            <button
              onClick={handleDismiss}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-white/20 bg-black/40 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-[11px] font-mono tracking-wider"
            >
              <span>SKIP [ESC]</span>
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Center Targeting Reticle & Branding */}
          <div className="relative z-10 text-center px-6 max-w-md pointer-events-none">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 mb-4 shadow-[0_0_30px_rgba(125,211,252,0.25)]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1 font-heading">
              VIGILANT FORENSIC
            </h1>
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-cyan-300/80 mb-6">
              Research & Analytics Pvt. Ltd.
            </p>

            {/* Progress Bar & Readout */}
            <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden mb-3 border border-white/10">
              <motion.div
                className="bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 h-full rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
              <span className="truncate pr-2">{statusText}</span>
              <span className="font-semibold text-cyan-300">{progress}%</span>
            </div>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-6 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>SEC_65B // BSA 2023 RECEPTOR ACTIVE</span>
            <span className="flex items-center gap-1 text-cyan-400/80">
              <Terminal className="h-3 w-3" />
              <span>3D LASER MESH: LIVE</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
