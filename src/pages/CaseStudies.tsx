import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Scale, User, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "all", label: "All Cases" },
  { id: "government", label: "Government" },
  { id: "corporate", label: "Corporate" },
  { id: "legal", label: "Legal" },
  { id: "individual", label: "Individual" },
];

const caseStudies = [
  {
    id: 1,
    title: "Multi-State Financial Fraud Investigation",
    category: "government",
    client: "State Cyber Cell",
    description: "Investigation of a complex financial fraud spanning multiple states involving cryptocurrency and shell companies.",
    outcome: "₹15 Cr recovered, 12 arrests made",
    services: ["Digital Forensics", "Network Analysis", "Expert Witness"],
    impact: "Court conviction achieved",
  },
  {
    id: 2,
    title: "Corporate Data Breach Response",
    category: "corporate",
    client: "Fortune 500 IT Company",
    description: "Rapid incident response to a ransomware attack targeting critical infrastructure and customer data.",
    outcome: "Contained within 6 hours, zero data loss",
    services: ["Incident Response", "Malware Analysis", "Recovery"],
    impact: "Business continuity maintained",
  },
  {
    id: 3,
    title: "Matrimonial Digital Evidence Case",
    category: "legal",
    client: "High Court of Delhi",
    description: "Analysis of digital communications and financial transactions for a high-profile divorce proceeding.",
    outcome: "Evidence accepted, case decided",
    services: ["Mobile Forensics", "Email Analysis", "Expert Testimony"],
    impact: "Expert opinion cited in judgment",
  },
  {
    id: 4,
    title: "Employee IP Theft Investigation",
    category: "corporate",
    client: "Pharmaceutical Company",
    description: "Investigation of suspected intellectual property theft by departing employees to a competitor.",
    outcome: "Evidence trail established",
    services: ["Computer Forensics", "Cloud Analysis", "Timeline Reconstruction"],
    impact: "Civil suit filed successfully",
  },
  {
    id: 5,
    title: "Cyber Stalking & Harassment Case",
    category: "individual",
    client: "Private Client",
    description: "Tracing and identification of anonymous cyber stalker using multiple social media platforms.",
    outcome: "Perpetrator identified and arrested",
    services: ["Social Media Analysis", "IP Tracking", "Evidence Documentation"],
    impact: "Criminal case registered",
  },
  {
    id: 6,
    title: "Banking Sector Fraud Analysis",
    category: "government",
    client: "Economic Offences Wing",
    description: "Large-scale investigation into banking fraud involving insider trading and account manipulation.",
    outcome: "₹50 Cr fraud documented",
    services: ["Database Forensics", "Transaction Analysis", "Report Generation"],
    impact: "Chargesheet filed",
  },
];

const CaseStudies = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCases = activeCategory === "all" 
    ? caseStudies 
    : caseStudies.filter(c => c.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "government": return Scale;
      case "corporate": return Building2;
      case "legal": return Scale;
      case "individual": return User;
      default: return Award;
    }
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">Case Studies</p>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Our Success Stories
            </h1>
            <p className="text-lg text-primary-foreground/70">
              Explore anonymized case studies showcasing our expertise in solving complex 
              digital forensics challenges across various sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Cases */}
      <section className="py-20 lg:py-28">
        <div className="container">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Cases Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseStudy) => {
              const Icon = getCategoryIcon(caseStudy.category);
              return (
                <Card key={caseStudy.id} className="bg-card border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {caseStudy.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
                    <CardDescription className="text-sm text-primary">
                      {caseStudy.client}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {caseStudy.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase">Outcome</span>
                        <p className="text-sm font-medium text-foreground">{caseStudy.outcome}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase">Impact</span>
                        <p className="text-sm font-medium text-primary">{caseStudy.impact}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {caseStudy.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Cases Completed</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">₹100Cr+</div>
              <p className="text-muted-foreground">Fraud Recovered</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">200+</div>
              <p className="text-muted-foreground">Expert Testimonies</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Have a Case to Discuss?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our team is ready to help you with your digital forensics needs. 
              All consultations are strictly confidential.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2">
                Schedule Consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
