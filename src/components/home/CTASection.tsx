import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWebsiteContent, defaultCTAContent, CTAContent } from "@/hooks/useWebsiteContent";

export function CTASection() {
  const { content } = useWebsiteContent<CTAContent>("cta", defaultCTAContent);

  // Split heading to highlight the special word
  const headingParts = content.heading.split(content.highlightWord);

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-hero overflow-hidden scanlines">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
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
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"
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
      <div className="absolute inset-0 grid-overlay opacity-50" />

      {/* Pulse rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          className="w-[400px] h-[400px] rounded-full border border-primary/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 w-[400px] h-[400px] rounded-full border border-accent/20"
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeOut" }}
        />
      </div>

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Radio className="h-4 w-4" />
            </motion.div>
            <span className="text-sm font-semibold font-mono">{content.badge}</span>
          </motion.div>

          <motion.h2
            className="font-display text-3xl md:text-4xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {headingParts[0]}
            <span className="text-primary text-glow">{content.highlightWord}</span>
            {headingParts[1]}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-foreground/60 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {content.description}
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
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-neon px-8 py-6 text-base font-semibold group"
                >
                  {content.primaryButtonText}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <a href={`tel:${content.phoneNumber.replace(/\s/g, '')}`}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-foreground/20 text-foreground bg-foreground/5 hover:bg-foreground/10 hover:border-primary/50 hover:text-primary gap-2 px-8 py-6 text-base font-semibold backdrop-blur-sm transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  Call: {content.phoneNumber}
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
            <motion.a
              href={`tel:${content.emergencyPhone.replace(/\s/g, '')}`}
              className="bg-card/30 backdrop-blur-md rounded-2xl p-6 border border-primary/20 hover:border-primary/40 hover:shadow-neon transition-all duration-300 group block"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Phone className="h-8 w-8 text-primary mx-auto mb-3 group-hover:text-glow" />
              </motion.div>
              <p className="text-sm text-foreground/50 mb-1 font-mono">// EMERGENCY</p>
              <p className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{content.emergencyPhone}</p>
            </motion.a>
            <motion.a
              href={`mailto:${content.emergencyEmail}`}
              className="bg-card/30 backdrop-blur-md rounded-2xl p-6 border border-primary/20 hover:border-accent/40 hover:shadow-neon-purple transition-all duration-300 group block"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Mail className="h-8 w-8 text-accent mx-auto mb-3" />
              </motion.div>
              <p className="text-sm text-foreground/50 mb-1 font-mono">// EMAIL</p>
              <p className="font-bold text-foreground text-lg group-hover:text-accent transition-colors">{content.emergencyEmail}</p>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
