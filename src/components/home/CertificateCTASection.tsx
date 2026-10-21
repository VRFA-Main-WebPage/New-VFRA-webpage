import { Link } from "react-router-dom";
import { Award, ArrowRight, FolderPlus, SearchCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, useInView } from "@/lib/motion";

export function CertificateCTASection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#E5E5E3]">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Card 01: Register Case */}
          <div className="premium-card p-6 md:p-8 flex flex-col justify-between bg-[#F7F7F5]/60">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E3]">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555]">
                  PORTAL // 01
                </span>
                <FolderPlus className="h-4 w-4 text-[#111111]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#111111] mb-2">
                Register an Investigation
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Submit a digital forensic or cybercrime matter securely. Receive a unique cryptographic Case ID (`FX-YYYYMMDD`) for status tracking.
              </p>
            </div>
            <Link to="/submit-case">
              <Button className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.1em] gap-2">
                Submit Case Intake
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Card 02: Track Case */}
          <div className="premium-card p-6 md:p-8 flex flex-col justify-between bg-[#F7F7F5]/60">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E3]">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555]">
                  PORTAL // 02
                </span>
                <SearchCheck className="h-4 w-4 text-[#111111]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#111111] mb-2">
                Track Case Status
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Monitor real-time investigation progress from initial intake and forensic imaging through final report preparation.
              </p>
            </div>
            <Link to="/track-case">
              <Button
                variant="outline"
                className="w-full h-11 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-[0.1em] gap-2"
              >
                Track Case ID
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Card 03: Verify Certificate */}
          <div className="premium-card p-6 md:p-8 flex flex-col justify-between bg-[#F7F7F5]/60">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E3]">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555]">
                  PORTAL // 03
                </span>
                <Award className="h-4 w-4 text-[#111111]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#111111] mb-2">
                Verify Certificate
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Confirm the authenticity and issuance record of training, internship, and workshop certificates issued by VFRA.
              </p>
            </div>
            <Link to="/verify">
              <Button
                variant="outline"
                className="w-full h-11 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-[0.1em] gap-2"
              >
                Verify Credential
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
