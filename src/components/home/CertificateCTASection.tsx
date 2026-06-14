import { Link } from "react-router-dom";
import { Award, ArrowRight, FolderPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, useInView } from "@/lib/motion";

export function CertificateCTASection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-10 md:py-20 lg:py-24 bg-surface border-b border-border">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="grid grid-cols-2 gap-3 md:gap-6"
        >
          <div className="premium-card p-3 md:p-8 flex flex-col">
            <FolderPlus className="h-6 w-6 md:h-8 md:w-8 text-primary mb-2 md:mb-4" />
            <h3 className="font-heading text-sm md:text-2xl font-bold text-foreground mb-1 md:mb-2">Register a Case</h3>
            <p className="text-muted-foreground text-[10px] md:text-sm leading-tight md:leading-relaxed mb-3 md:mb-6 flex-1">
              Submit your matter securely. Receive a Case ID to track progress and communicate with our team.
            </p>
            <Link to="/submit-case" className="mt-auto">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#F3E5AB] gap-1 w-full text-[10px] md:text-sm h-8 md:h-10 px-2 font-bold">
                Register
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </Link>
          </div>

          <div className="premium-card p-3 md:p-8 flex flex-col">
            <Award className="h-6 w-6 md:h-8 md:w-8 text-primary mb-2 md:mb-4" />
            <h3 className="font-heading text-sm md:text-2xl font-bold text-foreground mb-1 md:mb-2">Verify Certificate</h3>
            <p className="text-muted-foreground text-[10px] md:text-sm leading-tight md:leading-relaxed mb-1 md:mb-2 flex-1">
              Confirm authenticity of certificates issued by VFRA for training and professional programmes.
            </p>
            <p className="hidden md:block text-xs text-muted-foreground/80 mb-6 italic">
              This page verifies certificates issued by VFRA.
            </p>
            <Link to="/verify" className="mt-auto">
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 gap-1 w-full text-[10px] md:text-sm h-8 md:h-10 px-2 font-bold">
                Verify
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
