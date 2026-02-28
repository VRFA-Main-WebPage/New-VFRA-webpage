import { CheckCircle, Building2, Scale, GraduationCap, Briefcase, Hexagon, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useWebsiteContent, defaultTrustContent, TrustContent } from "@/hooks/useWebsiteContent";
import maharashtraPoliceLogo from "@/assets/partners/maharashtra-police.jpg";
import nagpurPoliceLogo from "@/assets/partners/nagpur-police.jpg";

const iconMap: Record<string, LucideIcon> = {
  Scale,
  Building2,
  Briefcase,
  GraduationCap,
};

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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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
  const { content } = useWebsiteContent<TrustContent>("trust", defaultTrustContent);

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 grid-overlay opacity-50" />

      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[10%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Hexagon className="h-20 w-20 text-primary/5 stroke-[0.5]" />
        </motion.div>
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest">
              {content.badge}
            </p>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {content.heading.replace(content.highlightWord, "").trim()}{" "}
              <span className="text-primary">{content.highlightWord}</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              {content.description}
            </p>

            {/* Certifications */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {content.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium text-lg">
                    {cert}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Client Types */}
          <div className="grid grid-cols-2 gap-5">
            {content.clientTypes.map((client, index) => {
              const IconComponent = iconMap[client.icon] || Scale;
              return (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-6 border border-primary/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-1">
                    {client.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {client.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Partners Section */}
        <motion.div
  className="mt-20 pt-16 border-t border-primary/10"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <p className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-widest font-medium">
    Trusted by Law Enforcement Agencies
  </p>

  <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">

    {/* Maharashtra Police */}
    <div className="flex flex-col items-center gap-4">
      <div className="h-24 w-56 bg-card border border-primary/20 rounded-lg flex items-center justify-center p-4">
        <img
          src={maharashtraPoliceLogo}
          alt="Maharashtra Police"
          className="h-16 object-contain"
        />
      </div>
      <p className="text-foreground font-semibold tracking-wide">
        Maharashtra Police
      </p>
    </div>

    {/* Nagpur Police */}
    <div className="flex flex-col items-center gap-4">
      <div className="h-24 w-56 bg-card border border-primary/20 rounded-lg flex items-center justify-center p-4">
        <img
          src={nagpurPoliceLogo}
          alt="Nagpur Police"
          className="h-16 object-contain"
        />
      </div>
      <p className="text-foreground font-semibold tracking-wide">
        Nagpur Police
      </p>
    </div>

  </div>
</motion.div>
      </div>
    </section>
  );
}