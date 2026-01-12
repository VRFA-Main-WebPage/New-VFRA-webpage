import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Shield,
  Lock,
  Eye,
  LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string | null;
  href: string | null;
  sort_order: number;
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Smartphone,
  Monitor,
  Cloud,
  Network,
  Search,
  ShieldAlert,
  FileText,
  GraduationCap,
  HardDrive,
  Lock,
  Eye,
};

const gradients = [
  "from-blue-500/20 to-cyan-500/20",
  "from-violet-500/20 to-purple-500/20",
  "from-sky-500/20 to-blue-500/20",
  "from-emerald-500/20 to-teal-500/20",
  "from-orange-500/20 to-amber-500/20",
  "from-red-500/20 to-rose-500/20",
  "from-indigo-500/20 to-blue-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-slate-500/20 to-gray-500/20",
];

// Fallback services when database is empty
const fallbackServices = [
  { id: "1", title: "Mobile Forensics", description: "Extraction and analysis of data from smartphones, tablets, and mobile devices.", icon: "Smartphone", image_url: null, href: "/services/digital-forensics", sort_order: 0 },
  { id: "2", title: "Computer Forensics", description: "Comprehensive analysis of computers, laptops, and storage media.", icon: "Monitor", image_url: null, href: "/services/digital-forensics", sort_order: 1 },
  { id: "3", title: "Cloud Forensics", description: "Investigation of cloud-stored data and SaaS applications.", icon: "Cloud", image_url: null, href: "/services/digital-forensics", sort_order: 2 },
  { id: "4", title: "Network Forensics", description: "Analysis of network traffic, logs, and intrusion detection.", icon: "Network", image_url: null, href: "/services/digital-forensics", sort_order: 3 },
  { id: "5", title: "Cybercrime Investigation", description: "Professional investigation of cyber frauds, hacking, and online crimes.", icon: "Search", image_url: null, href: "/services/cybercrime-investigation", sort_order: 4 },
  { id: "6", title: "Incident Response", description: "Rapid response to security incidents and data breaches.", icon: "ShieldAlert", image_url: null, href: "/services/incident-response", sort_order: 5 },
  { id: "7", title: "Expert Witness", description: "Court testimony and expert reports for legal proceedings.", icon: "FileText", image_url: null, href: "/services/expert-witness", sort_order: 6 },
  { id: "8", title: "Training & Workshops", description: "Professional development programs for organizations.", icon: "GraduationCap", image_url: null, href: "/services/training", sort_order: 7 },
  { id: "9", title: "Data Recovery", description: "Recovery of deleted, corrupted, or damaged data.", icon: "HardDrive", image_url: null, href: "/services/lab-services", sort_order: 8 },
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
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (data && data.length > 0) {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

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
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Shield;
            const gradient = gradients[index % gradients.length];

            return (
              <motion.div key={service.id} variants={cardVariants}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card className="group h-full border-border/50 hover:border-primary/40 transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/5 overflow-hidden relative">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {service.image_url && (
                      <div className="h-40 overflow-hidden">
                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}

                    <CardHeader className="relative z-10">
                      <motion.div
                        className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <IconComponent className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                      </motion.div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <CardDescription className="text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
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
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
