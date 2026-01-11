import { CheckCircle, Award, Building2, Scale, GraduationCap } from "lucide-react";

const certifications = [
  "ISO 27001 Certified",
  "NABL Accredited Lab",
  "EnCase Certified",
  "Cellebrite Certified",
  "ACE Certified",
];

const clientTypes = [
  { icon: Building2, label: "Government Agencies" },
  { icon: Scale, label: "Law Enforcement" },
  { icon: Building2, label: "Corporate Clients" },
  { icon: GraduationCap, label: "Educational Institutions" },
];

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Trusted by India's Leading Organizations
            </h2>
            <p className="text-muted-foreground mb-8">
              With over 15 years of experience in digital forensics and cybercrime investigation, 
              we've established ourselves as India's trusted partner for sensitive investigations. 
              Our state-of-the-art laboratory and certified experts ensure accurate, court-admissible evidence.
            </p>

            {/* Certifications */}
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Client Types */}
          <div className="grid grid-cols-2 gap-4">
            {clientTypes.map((client, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <client.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{client.label}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Partners/Logos would go here */}
        <div className="mt-16 pt-12 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading organizations across India</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-60">
            {/* Placeholder for partner logos */}
            <div className="h-12 w-32 bg-muted-foreground/20 rounded flex items-center justify-center text-xs text-muted-foreground">Partner Logo</div>
            <div className="h-12 w-32 bg-muted-foreground/20 rounded flex items-center justify-center text-xs text-muted-foreground">Partner Logo</div>
            <div className="h-12 w-32 bg-muted-foreground/20 rounded flex items-center justify-center text-xs text-muted-foreground">Partner Logo</div>
            <div className="h-12 w-32 bg-muted-foreground/20 rounded flex items-center justify-center text-xs text-muted-foreground">Partner Logo</div>
            <div className="h-12 w-32 bg-muted-foreground/20 rounded flex items-center justify-center text-xs text-muted-foreground">Partner Logo</div>
          </div>
        </div>
      </div>
    </section>
  );
}
