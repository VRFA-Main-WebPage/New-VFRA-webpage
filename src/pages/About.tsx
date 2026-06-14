import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";
import { Users, CheckCircle, Target, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useWebsiteContent, defaultAboutContent, AboutContent } from "@/hooks/useWebsiteContent";
import tanishPhoto from "@/assets/team/tanish.jpg";
import omPhoto from "@/assets/team/om.jpg";
import jafarPhoto from "@/assets/team/jafar.jpg";
import ShouryaPhoto from "@/assets/team/Shourya.jpg"
interface TeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string | null;
  photo_url: string | null;
  sort_order: number;
}

const fallbackTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Mr. Tanish Chouhan",
    role: "Founder & Director – Vigilant Forensic",
    credentials: "Digital Forensics & Cybercrime Investigation Leader | Specialized in EnCase, Cellebrite, X-Ways, FTK & Autopsy | Incident Response & Advanced Evidence Analysis | Legally Defensible Forensic Reporting",
    photo_url: tanishPhoto,
    sort_order: 0,
  },
{
  id: "2",
  name: "Mr. Shourya Bhagat",
  role: "Blockchain & Cryptocurrency Forensic Analyst",
  credentials: "Blockchain Transaction Analysis | Cryptocurrency Tracing & Wallet Attribution | Digital Asset Investigation | On-Chain Intelligence & Fraud Tracking",
  photo_url:ShouryaPhoto ,
  sort_order: 3,
},
   {
  id: "3",
  name: "Mr. Om Gatlewar",
  role: "Mobile Forensics & Cyber Investigation",
  credentials: "Mobile Device Forensics Specialist | Cellebrite & Advanced Mobile Extraction Workflows | Cybercrime Investigation & Digital Evidence Handling",
  photo_url: omPhoto,
  sort_order: 1,
  },
  {
  id: "4",
  name: "Mr. Jafar Naqvi",
  role: "Cybercrime Investigation & Incident Response",
  credentials: "Cybercrime Investigation & Incident Analysis | Digital Evidence Collection & Case Documentation | Assisted in Cybercrime Case Analysis with Cyber Cell, Nagpur",
  photo_url: jafarPhoto,
  sort_order: 2,
},
 
];

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(fallbackTeamMembers);
  const { content } = useWebsiteContent<AboutContent>("about", defaultAboutContent);

  useEffect(() => {
    const fetchData = async () => {
      const teamRes = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (teamRes.data && teamRes.data.length > 0) {
        setTeamMembers(teamRes.data);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SEO title="About Us | VFRA" description="Learn about Vigilant Forensic Research and Analytics Pvt. Ltd. and our mission in cyber investigations." />
      <div className="bg-background">

      {/* Hero Section */}
      <section className="relative py-10 md:py-20 lg:py-28 bg-gradient-hero border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-eyebrow">About Us</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Digital Forensics & Investigation Intelligence
            </h1>
            <p className="text-lg text-muted-foreground">
              Founded in 2025, we specialize in scientifically sound digital evidence analysis and cyber investigations with a strong focus on accuracy, integrity, and legal defensibility.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 md:py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">

            <Card className="premium-card border-border">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To uncover digital truth through structured, methodical forensic analysis, ensuring every investigation adheres to professional, legal, and evidentiary standards. We are committed to maintaining accuracy, integrity, and confidentiality while delivering clear, defensible findings that support informed decisions and withstand scrutiny.
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card border-border">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become a respected digital forensics firm in India by setting measurable benchmarks in investigative accuracy, operational transparency, and modern forensic methodologies. We aim to continuously evolve with emerging technologies while building long-term trust through ethical practice, technical excellence, and consistent professional standards.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10 md:py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
              Our Team
            </p>
            <h2 className="font-heading text-[28px] md:text-4xl font-bold text-foreground mb-4">
              Meet Our Experts
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team comprises certified forensic experts with deep technical experience in digital investigations and cybersecurity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="premium-card">
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mt-1">{member.role}</p>
                  {member.credentials && (
                    <p className="text-xs text-muted-foreground mt-2">{member.credentials}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Infrastructure */}
      <section className="py-10 md:py-20 lg:py-28 bg-surface border-t border-border">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
              Infrastructure
            </p>
            <h2 className="text-[28px] md:text-4xl font-bold text-foreground mb-6">
              State-of-the-Art Forensic Laboratory
            </h2>
            <p className="text-muted-foreground mb-8">
              Our laboratory is equipped with modern forensic tools and secure evidence handling systems to support legally defensible investigations.
            </p>

            <div className="space-y-4">
              {content.labEquipment.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  </>
  );
};

export default About;