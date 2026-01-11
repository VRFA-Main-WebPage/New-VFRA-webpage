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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Smartphone,
    title: "Mobile Forensics",
    description: "Extraction and analysis of data from smartphones, tablets, and mobile devices.",
    href: "/services/digital-forensics",
  },
  {
    icon: Monitor,
    title: "Computer Forensics",
    description: "Comprehensive analysis of computers, laptops, and storage media.",
    href: "/services/digital-forensics",
  },
  {
    icon: Cloud,
    title: "Cloud Forensics",
    description: "Investigation of cloud-stored data and SaaS applications.",
    href: "/services/digital-forensics",
  },
  {
    icon: Network,
    title: "Network Forensics",
    description: "Analysis of network traffic, logs, and intrusion detection.",
    href: "/services/digital-forensics",
  },
  {
    icon: Search,
    title: "Cybercrime Investigation",
    description: "Professional investigation of cyber frauds, hacking, and online crimes.",
    href: "/services/cybercrime-investigation",
  },
  {
    icon: ShieldAlert,
    title: "Incident Response",
    description: "Rapid response to security incidents and data breaches.",
    href: "/services/incident-response",
  },
  {
    icon: FileText,
    title: "Expert Witness",
    description: "Court testimony and expert reports for legal proceedings.",
    href: "/services/expert-witness",
  },
  {
    icon: GraduationCap,
    title: "Training & Workshops",
    description: "Professional development programs for organizations.",
    href: "/services/training",
  },
  {
    icon: HardDrive,
    title: "Data Recovery",
    description: "Recovery of deleted, corrupted, or damaged data.",
    href: "/services/lab-services",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Our Expertise</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Digital Forensics Services
          </h2>
          <p className="text-muted-foreground">
            From mobile device analysis to enterprise incident response, we provide end-to-end 
            digital investigation services backed by cutting-edge technology and certified experts.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link key={index} to={service.href}>
              <Card className="group h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" size="lg" className="gap-2">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
