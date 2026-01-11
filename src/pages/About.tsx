import { Shield, Award, Users, CheckCircle, MapPin, Calendar, Target, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const milestones = [
  { year: "2009", title: "Founded", description: "Established as India's first private digital forensics lab" },
  { year: "2012", title: "ISO Certified", description: "Received ISO 27001 certification for information security" },
  { year: "2015", title: "NABL Accredited", description: "Became NABL accredited forensic laboratory" },
  { year: "2018", title: "500+ Cases", description: "Crossed 500 successful investigations milestone" },
  { year: "2021", title: "Training Academy", description: "Launched professional training academy" },
  { year: "2024", title: "Pan-India Presence", description: "Expanded with offices across 5 major cities" },
];

const teamMembers = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Founder & Chief Forensic Expert",
    credentials: "Ph.D. Computer Science, EnCase Certified, CHFI",
  },
  {
    name: "Priya Sharma",
    role: "Director - Mobile Forensics",
    credentials: "Cellebrite Certified, GIAC GCFE",
  },
  {
    name: "Amit Verma",
    role: "Head - Cybercrime Investigation",
    credentials: "Ex-Cyber Cell, OSCP, ACE",
  },
  {
    name: "Dr. Sneha Patel",
    role: "Lead - Training & Development",
    credentials: "Ph.D. Digital Forensics, Certified Trainer",
  },
];

const About = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              India's Premier Digital Forensics Laboratory
            </h1>
            <p className="text-lg text-primary-foreground/70">
              For over 15 years, we've been at the forefront of digital forensics and cybercrime investigation, 
              serving law enforcement, government agencies, and enterprises across India.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-primary/20 bg-card">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide world-class digital forensics services that help uncover the truth, 
                  support justice, and protect organizations from cyber threats. We are committed 
                  to maintaining the highest standards of integrity, accuracy, and confidentiality 
                  in every investigation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be India's most trusted digital forensics partner, recognized globally for 
                  excellence in investigation, innovation in methodology, and commitment to training 
                  the next generation of cybersecurity professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              15+ Years of Excellence
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col lg:flex-row items-center gap-4 lg:gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <Card className="inline-block bg-card">
                      <CardContent className="p-6">
                        <span className="text-sm font-medium text-primary">{milestone.year}</span>
                        <h3 className="text-lg font-semibold text-foreground mt-1">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Our Team</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Experts
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team comprises certified forensic experts with decades of combined experience 
              in law enforcement, cybersecurity, and digital investigations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-card border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mt-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-2">{member.credentials}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Infrastructure */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Infrastructure</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                State-of-the-Art Forensic Laboratory
              </h2>
              <p className="text-muted-foreground mb-8">
                Our NABL-accredited laboratory is equipped with the latest forensic tools and 
                technology to handle even the most complex digital investigations.
              </p>

              <div className="space-y-4">
                {[
                  "Cellebrite UFED for mobile device extraction",
                  "EnCase Forensic workstations",
                  "X-Ways Forensics suite",
                  "Hardware write blockers and imaging systems",
                  "Faraday cages for secure device handling",
                  "Chain of custody compliant evidence storage",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border/50">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Lab Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Locations</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Pan-India Presence
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { city: "Noida (HQ)", address: "123 Cyber Tower, IT Park, Sector 62" },
              { city: "Mumbai", address: "456 Tech Hub, BKC, Mumbai" },
              { city: "Bangalore", address: "789 Innovation Center, Whitefield" },
              { city: "Chennai", address: "321 Digital Complex, OMR" },
              { city: "Hyderabad", address: "654 Cyber Towers, HITEC City" },
            ].map((location, index) => (
              <Card key={index} className="bg-card border-border/50">
                <CardContent className="pt-6">
                  <MapPin className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground">{location.city}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{location.address}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
