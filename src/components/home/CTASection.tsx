import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-hero overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="container relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">24/7 Emergency Response Available</span>
          </motion.div>

          <motion.h2
            className="font-display text-3xl md:text-4xl lg:text-6xl font-bold text-primary-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Need Urgent Assistance?
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Our expert team is available for emergency incident response and urgent consultations.
            Contact us now to discuss your case confidentially.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/contact">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 shadow-lg shadow-accent/25 px-8 py-6 text-base font-semibold">
                  Schedule Consultation
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <a href="tel:+911204567890">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary-foreground/30 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/15 gap-2 px-8 py-6 text-base font-semibold backdrop-blur-sm"
                >
                  <Phone className="h-5 w-5" />
                  Call: +91 120 456 7890
                </Button>
              </motion.div>
            </a>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            className="grid sm:grid-cols-2 gap-5 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20 hover:border-accent/40 transition-colors group"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Phone className="h-8 w-8 text-accent mx-auto mb-3" />
              </motion.div>
              <p className="text-sm text-primary-foreground/60 mb-1">24/7 Emergency</p>
              <p className="font-bold text-primary-foreground text-lg">+91 98765 43210</p>
            </motion.div>
            <motion.div
              className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20 hover:border-accent/40 transition-colors group"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Mail className="h-8 w-8 text-accent mx-auto mb-3" />
              </motion.div>
              <p className="text-sm text-primary-foreground/60 mb-1">Email Us</p>
              <p className="font-bold text-primary-foreground text-lg">urgent@forensix.in</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
