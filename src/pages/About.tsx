import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Check, Target, Eye, ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useWebsiteContent, defaultAboutContent, AboutContent } from "@/hooks/useWebsiteContent";
import { fadeUp, staggerContainer } from "@/lib/motion";
import tanishPhoto from "@/assets/team/tanish.jpg";
import omPhoto from "@/assets/team/om.jpg";
import jafarPhoto from "@/assets/team/jafar.jpg";
import ShouryaPhoto from "@/assets/team/Shourya.jpg";
import labSetupImg from "@/assets/services/Labsetup.jpg";

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
    credentials:
      "Digital Forensics & Cybercrime Investigation Leader | Specialized in EnCase, Cellebrite, X-Ways, FTK & Autopsy | Incident Response & Advanced Evidence Analysis | Legally Defensible Forensic Reporting",
    photo_url: tanishPhoto,
    sort_order: 0,
  },
  {
    id: "3",
    name: "Mr. Om Gatlewar",
    role: "Mobile Forensics & Cyber Investigation",
    credentials:
      "Mobile Device Forensics Specialist | Cellebrite & Advanced Mobile Extraction Workflows | Cybercrime Investigation & Digital Evidence Handling",
    photo_url: omPhoto,
    sort_order: 1,
  },
  {
    id: "4",
    name: "Mr. Jafar Naqvi",
    role: "Cybercrime Investigation & Incident Response",
    credentials:
      "Cybercrime Investigation & Incident Analysis | Digital Evidence Collection & Case Documentation | Assisted in Cybercrime Case Analysis with Cyber Cell, Nagpur",
    photo_url: jafarPhoto,
    sort_order: 2,
  },
  {
    id: "2",
    name: "Mr. Shourya Bhagat",
    role: "Blockchain & Cryptocurrency Forensic Analyst",
    credentials:
      "Blockchain Transaction Analysis | Cryptocurrency Tracing & Wallet Attribution | Digital Asset Investigation | On-Chain Intelligence & Fraud Tracking",
    photo_url: ShouryaPhoto,
    sort_order: 3,
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
      <SEO
        title="About Us | VFRA Nagpur"
        description="Learn about Vigilant Forensic Research and Analytics Pvt. Ltd. (Nagpur) and our mission in digital forensics and cybercrime investigations."
      />
      <div className="bg-white min-h-screen">
        {/* Hero Header */}
        <section className="relative py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />
          <div className="container relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.span variants={fadeUp} className="section-eyebrow">
                INSTITUTIONAL PROFILE // VFRA NAGPUR
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="font-heading text-4xl md:text-5xl lg:text-[54px] font-semibold text-[#111111] tracking-[-0.035em] leading-[1.08] mb-6"
              >
                {content.heroTitle || "Digital Forensics & Investigation Intelligence."}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg text-[#555555] leading-relaxed"
              >
                {content.heroDescription ||
                  "Founded in 2025 in Nagpur, Maharashtra, Vigilant Forensic Research and Analytics Pvt. Ltd. specializes in scientifically sound digital evidence examination, cybercrime intelligence, and court-admissible technical reporting."}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Specification Grid */}
        <section className="py-16 md:py-24 border-b border-[#E5E5E3]">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="premium-card p-8 md:p-10 bg-[#F7F7F5]/60">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E3]">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#555555]">
                    01 // MANDATE &amp; MISSION
                  </span>
                  <Target className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-[#111111] mb-4">
                  Our Mission
                </h2>
                <p className="text-sm md:text-base text-[#555555] leading-relaxed">
                  {content.mission}
                </p>
              </div>

              <div className="premium-card p-8 md:p-10 bg-[#F7F7F5]/60">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E3]">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#555555]">
                    02 // LONG-TERM VISION
                  </span>
                  <Eye className="h-4 w-4 text-[#111111]" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-[#111111] mb-4">
                  Our Vision
                </h2>
                <p className="text-sm md:text-base text-[#555555] leading-relaxed">
                  {content.vision}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership & Forensic Specialists */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-12 border-b border-[#E5E5E3]">
              <div>
                <span className="section-eyebrow">03 // FORENSIC DIRECTORATE &amp; SPECIALISTS</span>
                <h2 className="section-heading">Meet Our Experts.</h2>
              </div>
              <p className="text-sm text-[#555555] max-w-md">
                Specialists trained in industry-standard forensic suites, mobile extraction, on-chain tracing, and incident response.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="premium-card overflow-hidden flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="aspect-[4/4] w-full bg-[#F0EFEA] border-b border-[#E5E5E3] overflow-hidden relative">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-12 w-12 text-[#71717A]" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 font-mono text-[10px] px-2 py-0.5 bg-white/90 backdrop-blur-sm border border-[#E5E5E3] text-[#111111]">
                        EXP-0{index + 1}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-heading font-bold text-base text-[#111111]">
                        {member.name}
                      </h3>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[#555555] mt-1 pb-3 mb-3 border-b border-[#E5E5E3]">
                        {member.role}
                      </p>
                      {member.credentials && (
                        <p className="text-xs text-[#555555] leading-relaxed">
                          {member.credentials}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Laboratory Infrastructure */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <span className="section-eyebrow">04 // LABORATORY INFRASTRUCTURE</span>
                <h2 className="section-heading mb-4">
                  Forensic Workstation &amp; Acquisition Suite.
                </h2>
                <p className="text-sm md:text-base text-[#555555] leading-relaxed mb-8">
                  Our Nagpur facility is equipped with industry-standard forensic extraction hardware, write-blocked imaging systems, and chain-of-custody evidence vaults.
                </p>

                <div className="space-y-3 mb-8">
                  {content.labEquipment.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3.5 rounded-md bg-[#F7F7F5] border border-[#E5E5E3]"
                    >
                      <div className="w-5 h-5 rounded-sm bg-[#111111] text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium text-[#111111]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/gallery">
                    <Button className="bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.1em] h-11 px-6 gap-2">
                      Explore Lab Gallery
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="border-[#111111] text-[#111111] hover:bg-[#F7F7F5] font-mono text-xs uppercase tracking-[0.1em] h-11 px-6"
                    >
                      Schedule Lab Consultation
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="premium-card overflow-hidden bg-[#F7F7F5]">
                  <div className="px-4 py-3 border-b border-[#E5E5E3] bg-white flex items-center justify-between font-mono text-[11px] text-[#555555]">
                    <span className="inline-flex items-center gap-2 text-[#111111] font-semibold">
                      <Terminal className="h-3.5 w-3.5" />
                      FACILITY // NAGPUR HQ
                    </span>
                    <span>ISO-READY WORKFLOW</span>
                  </div>
                  <img
                    src={labSetupImg}
                    alt="VFRA Forensic Laboratory Infrastructure"
                    className="w-full aspect-[16/11] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;