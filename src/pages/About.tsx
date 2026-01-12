import { useState, useEffect } from "react";
import { Shield, Award, Users, CheckCircle, MapPin, Calendar, Target, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useWebsiteContent, defaultAboutContent, AboutContent } from "@/hooks/useWebsiteContent";

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  sort_order: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string | null;
  photo_url: string | null;
  sort_order: number;
}

interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  is_headquarters: boolean;
  sort_order: number;
}

// Fallback data
const fallbackMilestones = [
  { id: "1", year: "2009", title: "Founded", description: "Established as India's first private digital forensics lab", sort_order: 0 },
  { id: "2", year: "2012", title: "ISO Certified", description: "Received ISO 27001 certification for information security", sort_order: 1 },
  { id: "3", year: "2015", title: "NABL Accredited", description: "Became NABL accredited forensic laboratory", sort_order: 2 },
  { id: "4", year: "2018", title: "500+ Cases", description: "Crossed 500 successful investigations milestone", sort_order: 3 },
  { id: "5", year: "2021", title: "Training Academy", description: "Launched professional training academy", sort_order: 4 },
  { id: "6", year: "2024", title: "Pan-India Presence", description: "Expanded with offices across 5 major cities", sort_order: 5 },
];

const fallbackTeamMembers = [
  { id: "1", name: "Dr. Rajesh Kumar", role: "Founder & Chief Forensic Expert", credentials: "Ph.D. Computer Science, EnCase Certified, CHFI", photo_url: null, sort_order: 0 },
  { id: "2", name: "Priya Sharma", role: "Director - Mobile Forensics", credentials: "Cellebrite Certified, GIAC GCFE", photo_url: null, sort_order: 1 },
  { id: "3", name: "Amit Verma", role: "Head - Cybercrime Investigation", credentials: "Ex-Cyber Cell, OSCP, ACE", photo_url: null, sort_order: 2 },
  { id: "4", name: "Dr. Sneha Patel", role: "Lead - Training & Development", credentials: "Ph.D. Digital Forensics, Certified Trainer", photo_url: null, sort_order: 3 },
];

const fallbackLocations = [
  { id: "1", city: "Noida", address: "123 Cyber Tower, IT Park, Sector 62", is_headquarters: true, sort_order: 0 },
  { id: "2", city: "Mumbai", address: "456 Tech Hub, BKC, Mumbai", is_headquarters: false, sort_order: 1 },
  { id: "3", city: "Bangalore", address: "789 Innovation Center, Whitefield", is_headquarters: false, sort_order: 2 },
  { id: "4", city: "Chennai", address: "321 Digital Complex, OMR", is_headquarters: false, sort_order: 3 },
  { id: "5", city: "Hyderabad", address: "654 Cyber Towers, HITEC City", is_headquarters: false, sort_order: 4 },
];

const About = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(fallbackMilestones);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(fallbackTeamMembers);
  const [locations, setLocations] = useState<OfficeLocation[]>(fallbackLocations);
  const { content } = useWebsiteContent<AboutContent>("about", defaultAboutContent);

  useEffect(() => {
    const fetchData = async () => {
      const [milestonesRes, teamRes, locationsRes] = await Promise.all([
        supabase.from("milestones").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("team_members").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("office_locations").select("*").eq("is_active", true).order("sort_order"),
      ]);

      if (milestonesRes.data && milestonesRes.data.length > 0) setMilestones(milestonesRes.data);
      if (teamRes.data && teamRes.data.length > 0) setTeamMembers(teamRes.data);
      if (locationsRes.data && locationsRes.data.length > 0) setLocations(locationsRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
        {/* Grid overlay effect */}
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider font-mono">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
              {content.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {content.heroDescription}
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
                  {content.mission}
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
                  {content.vision}
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
                  key={milestone.id}
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
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-card border-border/50 hover:shadow-lg transition-shadow">
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
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Infrastructure</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              State-of-the-Art Forensic Laboratory
            </h2>
            <p className="text-muted-foreground mb-8">
              Our NABL-accredited laboratory is equipped with the latest forensic tools and 
              technology to handle even the most complex digital investigations.
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
            {locations.map((location) => (
              <Card key={location.id} className="bg-card border-border/50">
                <CardContent className="pt-6">
                  <MapPin className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground">
                    {location.city}
                    {location.is_headquarters && <span className="ml-2 text-xs text-primary">(HQ)</span>}
                  </h3>
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