import { CheckCircle, Building2, Scale, GraduationCap, Briefcase, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

const certifications = [
  "ISO 27001 Certified",
  "NABL Accredited Lab",
  "EnCase Certified",
  "Cellebrite Certified",
  "ACE Certified",
];

const clientTypes = [
  { icon: Scale, label: "Law Enforcement", description: "Police & Cyber Cells" },
  { icon: Building2, label: "Government", description: "Agencies & PSUs" },
  { icon: Briefcase, label: "Corporate", description: "Enterprises & MNCs" },
  { icon: GraduationCap, label: "Legal", description: "Courts & Law Firms" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export function TrustSection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 grid-overlay opacity-50" />
      
      {/* Floating hexagons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[10%]"
          animate={{ rotate: 360, y: [-10, 10, -10] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        >
          <Hexagon className="h-20 w-20 text-primary/5 stroke-[0.5]" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-[5%]"
          animate={{ rotate: -360, y: [10, -10, 10] }}
          transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        >
          <Hexagon className="h-16 w-16 text-accent/5 stroke-[0.5]" />
        </motion.div>
      </div>

      {/* Glowing line */}
      <motion.div 
        className="absolute top-1/2 left-0 w-full h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.p
              className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest text-glow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Why Choose Us
            </motion.p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Trusted by India's{" "}
              <span className="text-primary">Leading Organizations</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              With over 15 years of experience in digital forensics and cybercrime investigation,
              we've established ourselves as India's trusted partner for sensitive investigations.
              Our state-of-the-art laboratory and certified experts ensure accurate, court-admissible evidence.
            </p>

            {/* Certifications */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 group"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-neon transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="text-foreground font-medium text-lg group-hover:text-primary transition-colors">{cert}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Client Types */}
          <div className="grid grid-cols-2 gap-5">
            {clientTypes.map((client, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-card/50 rounded-2xl p-6 border border-primary/10 hover:border-primary/30 hover:shadow-neon transition-all duration-300 cursor-pointer group backdrop-blur-sm"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:shadow-neon transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <client.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="font-display font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{client.label}</h3>
                <p className="text-sm text-muted-foreground">{client.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <motion.div
          className="mt-20 pt-16 border-t border-primary/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-widest font-medium">
            Trusted by leading organizations across India
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <motion.div
                key={index}
                className="h-12 w-36 bg-primary/5 border border-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xs text-muted-foreground font-medium font-mono">PARTNER_{index + 1}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
