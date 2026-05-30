import { Link } from "react-router-dom";
import { Award, ArrowRight, FolderPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, useInView } from "@/lib/motion";

export function CertificateCTASection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-20 lg:py-24 bg-surface border-b border-border">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="premium-card p-8 flex flex-col">
            <FolderPlus className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Register a Case</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
              Submit your matter securely. Receive a Case ID to track progress and communicate with our team.
            </p>
            <Link to="/submit-case">
              <Button className="btn-gold gap-2 w-full sm:w-auto">
                Register a Case
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="premium-card p-8 flex flex-col">
            <Award className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Verify Certificate</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2 flex-1">
              Confirm authenticity of certificates issued by VFRA for training and professional programmes.
            </p>
            <p className="text-xs text-muted-foreground/80 mb-6 italic">
              This page verifies certificates issued by VFRA.
            </p>
            <Link to="/verify">
              <Button variant="outline" className="btn-outline-gold gap-2 w-full sm:w-auto">
                Verify Certificate
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
