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
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "digital-forensics",
    icon: Monitor,
    title: "Digital Forensics",
    description: "Comprehensive digital evidence collection and analysis across all platforms and devices.",
    features: [
      "Mobile device forensics (Android, iOS)",
      "Computer forensics (Windows, Mac, Linux)",
      "Cloud data extraction and analysis",
      "Network traffic analysis",
      "Email and communication analysis",
      "Social media investigation",
    ],
    href: "/services/digital-forensics",
  },
  {
    id: "cybercrime-investigation",
    icon: Search,
    title: "Cybercrime Investigation",
    description: "Professional investigation of cyber frauds, hacking incidents, and online crimes.",
    features: [
      "Financial fraud investigation",
      "Phishing and social engineering analysis",
      "Ransomware incident investigation",
      "Identity theft cases",
      "Online harassment tracking",
      "Dark web intelligence",
    ],
    href: "/services/cybercrime-investigation",
  },
  {
    id: "incident-response",
    icon: ShieldAlert,
    title: "Incident Response",
    description: "Rapid response to security incidents with containment, investigation, and recovery.",
    features: [
      "24/7 emergency response",
      "Breach containment",
      "Malware analysis",
      "Root cause determination",
      "Remediation support",
      "Post-incident reporting",
    ],
    href: "/services/incident-response",
  },
  {
    id: "expert-witness",
    icon: FileText,
    title: "Expert Witness Services",
    description: "Court-admissible reports and expert testimony for legal proceedings.",
    features: [
      "Expert witness testimony",
      "Technical report preparation",
      "Evidence documentation",
      "Deposition support",
      "Case strategy consultation",
      "Rebuttal analysis",
    ],
    href: "/services/expert-witness",
  },
  {
    id: "training",
    icon: GraduationCap,
    title: "Training & Workshops",
    description: "Professional development programs for law enforcement and corporate teams.",
    features: [
      "Cyber forensics certification courses",
      "Law enforcement training",
      "Corporate security awareness",
      "Hands-on lab sessions",
      "Custom workshop programs",
      "Online learning modules",
    ],
    href: "/services/training",
  },
  {
    id: "lab-services",
    icon: HardDrive,
    title: "Lab Services",
    description: "Data recovery, evidence preservation, and specialized laboratory analysis.",
    features: [
      "Data recovery from damaged media",
      "Evidence imaging and preservation",
      "Password recovery",
      "Encrypted data analysis",
      "Hardware examination",
      "Chain of custody management",
    ],
    href: "/services/lab-services",
  },
];

const Services = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">Our Services</p>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Comprehensive Digital Forensics Solutions
            </h1>
            <p className="text-lg text-primary-foreground/70">
              From mobile device analysis to enterprise incident response, we provide end-to-end 
              investigation services backed by cutting-edge technology and certified experts.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">{service.title}</h2>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to={service.href}>
                    <Button className="gap-2">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Card className="bg-muted border-0">
                    <CardContent className="p-0">
                      <div className="aspect-video flex items-center justify-center">
                        <service.icon className="h-24 w-24 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-8">
              Every case is unique. Contact us to discuss your specific requirements 
              and we'll create a tailored approach for your investigation needs.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2">
                Contact Our Team
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
