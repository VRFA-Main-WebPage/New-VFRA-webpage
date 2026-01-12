import { Link } from "react-router-dom";
import { ArrowRight, Shield, Award, Users, FileCheck, Cpu, Binary, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: FileCheck, value: "500+", label: "Cases Solved" },
  { icon: Users, value: "200+", label: "Clients Served" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Shield, value: "100%", label: "Confidential" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const floatVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5 + i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

// Matrix rain character component
const MatrixColumn = ({ delay, left }: { delay: number; left: string }) => (
  <motion.div
    className="absolute text-primary/20 text-xs font-mono whitespace-nowrap"
    style={{ left }}
    initial={{ y: "-100%", opacity: 0 }}
    animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    {Array.from({ length: 20 }, () => 
      String.fromCharCode(0x30A0 + Math.random() * 96)
    ).join('\n')}
  </motion.div>
);

export function HeroSection() {
  return (
    <section className="relative bg-gradient-hero overflow-hidden min-h-screen flex items-center scanlines">
      {/* Matrix rain background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 15 }, (_, i) => (
          <MatrixColumn 
            key={i} 
            delay={i * 0.5} 
            left={`${(i / 15) * 100}%`} 
          />
        ))}
      </div>

      {/* Animated circuit lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(42 56% 59% / 0)" />
              <stop offset="50%" stopColor="hsl(42 56% 59% / 0.5)" />
              <stop offset="100%" stopColor="hsl(42 56% 59% / 0)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,200 Q200,100 400,200 T800,200 T1200,200 T1600,200"
            stroke="url(#circuit-gradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.path
            d="M0,400 Q200,300 400,400 T800,400 T1200,400 T1600,400"
            stroke="url(#circuit-gradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, delay: 1, repeat: Infinity, repeatType: "loop" }}
          />
        </svg>
      </div>

      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-[10%]"
          animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cpu className="h-12 w-12 text-primary/20" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-[15%]"
          animate={{ y: [20, -20, 20], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Binary className="h-16 w-16 text-accent/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-[20%]"
          animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <Terminal className="h-10 w-10 text-primary/15" />
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Rotating hex rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-overlay" />

      <div className="container relative z-10 py-32 lg:py-40">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Company Name */}
          <motion.div variants={itemVariants} className="mb-4">
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-primary text-glow tracking-wide">
              Vigilant Forensic Research and Analytics Pvt. Ltd.
            </h2>
          </motion.div>

          {/* Badge */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-sm mb-8 backdrop-blur-sm bg-primary/5"
              whileHover={{ scale: 1.05, borderColor: "hsl(180 100% 50% / 0.5)" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div variants={floatVariants} animate="animate">
                <Shield className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-foreground/90 font-medium">India's Trusted Digital Forensics Partner</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Heading with glitch effect */}
          <motion.h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight"
            variants={itemVariants}
          >
            <span className="block">Uncover the Truth with</span>
            <motion.span
              className="block text-primary text-glow mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            >
              Expert Digital Forensics
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-foreground/60 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Professional cybercrime investigation, digital evidence analysis, and expert witness services
            for law enforcement, government agencies, and corporate clients across India.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            variants={itemVariants}
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
                  Request Consultation
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/services">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-foreground/20 text-foreground bg-foreground/5 hover:bg-foreground/10 hover:border-primary/50 hover:text-primary px-8 py-6 text-base font-semibold backdrop-blur-sm transition-all duration-300"
                >
                  Explore Services
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group relative"
                custom={index}
                variants={statsVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-neon"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-7 w-7 text-primary" />
                </motion.div>
                <motion.div
                  className="text-3xl lg:text-5xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-foreground/50 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
