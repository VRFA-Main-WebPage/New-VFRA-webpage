import { Link } from "react-router-dom";
import {
  Smartphone,
  Monitor,
  Cloud,
  Network,
  Search,
  ShieldAlert,
  FileText,
  GraduationCap,
  HardDrive,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Smartphone,
    title: "Mobile Forensics",
    description: "Extraction and analysis of data from smartphones, tablets, and mobile devices.",
    href: "/services/digital-forensics",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Monitor,
    title: "Computer Forensics",
    description: "Comprehensive analysis of computers, laptops, and storage media.",
    href: "/services/digital-forensics",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Cloud,
    title: "Cloud Forensics",
    description: "Investigation of cloud-stored data and SaaS applications.",
    href: "/services/digital-forensics",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: Network,
    title: "Network Forensics",
    description: "Analysis of network traffic, logs, and intrusion detection.",
    href: "/services/digital-forensics",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Search,
    title: "Cybercrime Investigation",
    description: "Professional investigation of cyber frauds, hacking, and online crimes.",
    href: "/services/cybercrime-investigation",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    icon: ShieldAlert,
    title: "Incident Response",
    description: "Rapid response to security incidents and data breaches.",
    href: "/services/incident-response",
    gradient: "from-red-500/20 to-rose-500/20",
  },
  {
    icon: FileText,
    title: "Expert Witness",
    description: "Court testimony and expert reports for legal proceedings.",
    href: "/services/expert-witness",
    gradient: "from-indigo-500/20 to-blue-500/20",
  },
  {
    icon: GraduationCap,
    title: "Training & Workshops",
    description: "Professional development programs for organizations.",
    href: "/services/training",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: HardDrive,
    title: "Data Recovery",
    description: "Recovery of deleted, corrupted, or damaged data.",
    href: "/services/lab-services",
    gradient: "from-slate-500/20 to-gray-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function ServicesSection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.p
            className="text-sm font-semibold text-primary mb-3 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our Expertise
          </motion.p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Comprehensive Digital Forensics Services
          </h2>
          <p className="text-muted-foreground text-lg">
            From mobile device analysis to enterprise incident response, we provide end-to-end
            digital investigation services backed by cutting-edge technology and certified experts.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Link to={service.href}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card className="group h-full border-border/50 hover:border-primary/40 transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/5 overflow-hidden relative">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <CardHeader className="relative z-10">
                      <motion.div
                        className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <service.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                      </motion.div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <CardDescription className="text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                        {service.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Learn more
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/services">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button variant="outline" size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
                View All Services
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
