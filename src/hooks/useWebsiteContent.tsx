import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

import labSetupImg from "@/assets/services/Labsetup.jpg";
import trainingImg from "@/assets/services/trainingandworkshops.jpeg";
import digitalForensicsImg from "@/assets/services/digitalforensics.webp";
import cyberInvestigationImg from "@/assets/services/cybercrimeinvestigation.jpg";
import incidentResponseImg from "@/assets/services/incidenceresponse.jpg";
import expertWitnessImg from "@/assets/services/expertwitness.jpg";

export interface HeroContent {
  companyName: string;
  companyFullName: string;
  badge: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  stats: Array<{ value: string; label: string }>;
}

export interface CTAContent {
  badge: string;
  heading: string;
  highlightWord: string;
  description: string;
  primaryButtonText: string;
  phoneNumber: string;
  emergencyPhone: string;
  emergencyEmail: string;
}

export interface CaseSectionContent {
  badge: string;
  heading: string;
  highlightWord: string;
  description: string;
  steps: Array<{ title: string; description: string }>;
  trustBadges: string[];
}

export interface ContactContent {
  phone: string;
  email: string;
  address: string;
  addressLine2: string;
  addressLine3: string;
  workingHours: string;
}

export interface FooterContent {
  tagline: string;
  gstin: string;
  cin: string;
  linkedin: string;
  twitter: string;
  github: string;
}

export interface TrustContent {
  badge: string;
  heading: string;
  highlightWord: string;
  description: string;
  certifications: string[];
  clientTypes: Array<{ icon: string; label: string; description: string }>;
}

export interface ServicesSectionContent {
  badge: string;
  heading: string;
  description: string;
}

export interface AboutContent {
  heroTitle: string;
  heroDescription: string;
  mission: string;
  vision: string;
  labEquipment: string[];
}

export type GalleryCategory =
  | "Lab Infrastructure"
  | "Workshops & Training"
  | "Law Enforcement"
  | "Field Research"
  | "Conferences";

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  image_url: string;
  date: string;
  location?: string;
  featured?: boolean;
  code?: string;
}

export interface GalleryContent {
  heading: string;
  subheading: string;
  items: GalleryItem[];
}

export interface EventExtraMeta {
  banner_url?: string;
  registration_link?: string;
  speaker?: string;
  highlights?: string[];
}

export interface PastEventItem {
  id: string;
  title: string;
  date: string;
  participants: string;
  location: string;
  category?: string;
  banner_url?: string;
  summary?: string;
}

export interface EventsExtendedContent {
  mediaByEventId: Record<string, EventExtraMeta>;
  pastEvents: PastEventItem[];
}

// Default values for each section
export const defaultHeroContent: HeroContent = {
  companyName: "VFRA",
  companyFullName: "Vigilant Forensic Research and Analytics Pvt. Ltd.",
  badge: "Digital Forensics | Cyber Investigation | Expert Reporting",

  headingLine1: "Digital Evidence. Structured Analysis.",
  headingLine2: "Legally Defensible Results.",

  description:
    "We deliver structured digital forensic investigations, cybercrime analysis, and expert technical reporting. Every examination follows strict evidence handling protocols, ensuring accuracy, integrity, and courtroom defensibility.",

  primaryButtonText: "Request Case Consultation",
  secondaryButtonText: "View Our Services",
  stats: [
    { value: "2025", label: "Established" },
    { value: "100%", label: "Evidence Integrity" },
    { value: "ISO-Ready", label: "Structured Protocols" },
    { value: "24 / 7", label: "Confidential Response" },
  ],
};

export const defaultCTAContent: CTAContent = {
  badge: "24/7 EMERGENCY RESPONSE",
  heading: "Need Urgent Assistance?",
  highlightWord: "Urgent",
  description: "Our expert team is available for emergency incident response and urgent consultations. Contact us now to discuss your case confidentially.",
  primaryButtonText: "Schedule Consultation",
  phoneNumber: "+91 95119 57687",
  emergencyPhone: "+91 95119 57687",
  emergencyEmail: "contact@vigilantforensics.com",
};

export const defaultCaseSectionContent: CaseSectionContent = {
  badge: "Case Management",
  heading: "Submit & Track Your Investigation",
  highlightWord: "Investigation",
  description: "Our secure case management system allows you to submit investigation requests and track their progress with a unique Case ID.",
  steps: [
    { title: "Submit Your Case", description: "Fill out our secure form with details about your investigation needs." },
    { title: "Get Case ID", description: "Receive a unique case ID to track your investigation status." },
    { title: "Track Progress", description: "Monitor your case status in real-time from submission to resolution." },
  ],
  trustBadges: ["Confidential & Secure", "24-Hour Response", "Real-time Tracking"],
};

export const defaultContactContent: ContactContent = {
  phone: "+91 95119 57687",
  email: "contact@vigilantforensics.com",
  address: "Plot No. 5 Akhil Vishwa Bharti Co-Op. Society",
  addressLine2: "Opp. Prathamesh Towers, Besa Nagpur (M Corp.)",
  addressLine3: "Maharashtra – 440034",
  workingHours: "Monday - Friday: 9:00 AM - 6:00 PM",
};

export const defaultFooterContent: FooterContent = {
  tagline: "India's trusted digital forensics and cybercrime investigation laboratory. Providing expert solutions to law enforcement, government, and corporate clients.",
  gstin: "27AALCV7316E1Z5",
  cin: "U69100PN2025PTC250064 ",
  linkedin: "https://www.linkedin.com/company/vigilant-forensic-research-and-analytics-pvt-ltd/",
  twitter: "#",
  github: "#",
};

export const defaultTrustContent: TrustContent = {
  badge: "Why Choose Us",
  heading: "Professional. Precise. Confidential.",
  highlightWord: "Precise",
  description:
    "As a modern digital forensics and cyber investigation firm, we focus on structured investigative workflows, forensically sound evidence handling, and legally defensible reporting. Our work is guided by technical expertise, ethical standards, and practical field experience.",

  certifications: [
    "Structured Digital Forensic Methodologies",
    "Forensically Sound Evidence Handling Practices",
    "Advanced Tool Expertise (EnCase, Cellebrite, X-Ways, FTK, Autopsy)",
    "Confidential & Court-Oriented Reporting"
  ],

  clientTypes: [
    { icon: "Scale", label: "Law Enforcement", description: "Cybercrime Units & Investigative Teams" },
    { icon: "Building2", label: "Corporate", description: "Organizations & Security Teams" },
    { icon: "GraduationCap", label: "Academic Institutions", description: "Cybersecurity Workshops & Training" },
    { icon: "Briefcase", label: "Legal Professionals", description: "Technical Consultation & Reporting Support" },
  ],
};

export const defaultServicesSectionContent: ServicesSectionContent = {
  badge: "Our Expertise",
  heading: "Comprehensive Digital Forensics Services",
  description: "From mobile device analysis to enterprise incident response, we provide end-to-end digital investigation services backed by cutting-edge technology and certified experts.",
};

export const defaultAboutContent: AboutContent = {
  heroTitle: "India's Premier Digital Forensics Laboratory",
  heroDescription:
    "Established in 2025, we specialize in structured digital forensics and cybercrime investigation services, supporting legal professionals, organizations, and investigative teams with technically sound and defensible analysis.",

  mission:
    "To uncover digital truth through structured forensic methodologies, ensuring every investigation is conducted with accuracy, integrity, and strict confidentiality while meeting professional and evidentiary standards.",

  vision:
    "To build a respected digital forensics practice in India by maintaining investigative rigor, ethical standards, and continuous advancement in modern forensic techniques.",

  labEquipment: [
    "Cellebrite UFED for mobile device extraction",
    "EnCase Forensic workstations",
    "X-Ways Forensics suite",
    "Hardware write blockers and imaging systems",
    "Chain of custody compliant evidence storage",
  ],
};

export const defaultGalleryContent: GalleryContent = {
  heading: "Forensic Operations & Field Archive",
  subheading:
    "Documented moments from our Nagpur forensic laboratory, law enforcement capacity-building programmes, and institutional workshops.",
  items: [
    {
      id: "gal-01",
      code: "ARC-01",
      title: "Forensic Workstation & Write-Blocked Imaging Bay",
      caption:
        "Dedicated digital evidence acquisition environment equipped with hardware write-blockers and bit-stream verification systems at VFRA Nagpur.",
      category: "Lab Infrastructure",
      image_url: labSetupImg,
      date: "2026-02",
      location: "VFRA Laboratory, Nagpur",
      featured: true,
    },
    {
      id: "gal-02",
      code: "ARC-02",
      title: "Law Enforcement Capacity Building & Cybercrime Workshop",
      caption:
        "Hands-on investigative training session on CDR/IPDR analysis, digital evidence preservation, and Section 65B / BSA compliance.",
      category: "Workshops & Training",
      image_url: trainingImg,
      date: "2026-01",
      location: "Nagpur, Maharashtra",
      featured: true,
    },
    {
      id: "gal-03",
      code: "ARC-03",
      title: "Mobile & Storage Media Extraction Protocol",
      caption:
        "Logical and physical extraction workflows for mobile devices and solid-state storage under strict chain-of-custody documentation.",
      category: "Lab Infrastructure",
      image_url: digitalForensicsImg,
      date: "2025-12",
      location: "VFRA Lab Unit 02",
      featured: false,
    },
    {
      id: "gal-04",
      code: "ARC-04",
      title: "Cybercrime Intelligence & Network Attribution Analysis",
      caption:
        "Multi-layered OSINT, financial fund-flow reconstruction, and threat actor network mapping for complex cyber fraud investigations.",
      category: "Field Research",
      image_url: cyberInvestigationImg,
      date: "2025-11",
      location: "Nagpur Cyber Operations",
      featured: false,
    },
    {
      id: "gal-05",
      code: "ARC-05",
      title: "Enterprise Incident Response & Triage Exercise",
      caption:
        "Rapid containment, volatile memory capture, and root-cause forensic reconstruction during simulated enterprise breach scenarios.",
      category: "Law Enforcement",
      image_url: incidentResponseImg,
      date: "2025-10",
      location: "Institutional Briefing Room",
      featured: false,
    },
    {
      id: "gal-06",
      code: "ARC-06",
      title: "Evidentiary Documentation & Courtroom Reporting Review",
      caption:
        "Verification of cryptographic hash logs and structured technical testimony dossiers prepared for judicial review.",
      category: "Conferences",
      image_url: expertWitnessImg,
      date: "2025-09",
      location: "Legal & Forensic Division, Nagpur",
      featured: false,
    },
  ],
};

export const defaultEventsExtendedContent: EventsExtendedContent = {
  mediaByEventId: {},
  pastEvents: [
    {
      id: "past-1",
      title: "Dark Web Investigation & Digital Forensics Workshop",
      date: "2026",
      participants: "200+ Students & Faculty",
      location: "Ramdeobaba College of Engineering & Management, Nagpur",
      category: "Academic Workshop",
      banner_url: trainingImg,
      summary: "Intensive workshop covering darknet architecture, OSINT trace methodologies, and evidentiary handling.",
    },
    {
      id: "past-2",
      title: "Cybersecurity Awareness & Digital Fraud Prevention Session",
      date: "2026",
      participants: "500+ Officers & Staff",
      location: "Life Insurance Corporation of India (LIC)",
      category: "Institutional Seminar",
      banner_url: cyberInvestigationImg,
      summary: "Executive and operational training on financial fraud vectors, phishing forensics, and institutional safeguards.",
    },
    {
      id: "past-3",
      title: "Cybercrime Investigation & Digital Evidence Techniques Training",
      date: "2025",
      participants: "1000+ Law Enforcement Personnel",
      location: "Regional Law Enforcement Unit, Maharashtra",
      category: "LEA Capacity Building",
      banner_url: labSetupImg,
      summary: "Standardized field training on mobile extraction, CDR/IPDR correlation, and BSA 2023 electronic evidence certification.",
    },
  ],
};

export type SectionKey =
  | "hero"
  | "cta"
  | "case_section"
  | "contact"
  | "footer"
  | "trust"
  | "services_section"
  | "about"
  | "gallery"
  | "events_extended";

export function useWebsiteContent<T>(sectionKey: SectionKey, defaultContent: T) {
  const [content, setContent] = useState<T>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("website_content")
        .select("content")
        .eq("section_key", sectionKey)
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setContent({ ...defaultContent, ...(data.content as T) });
      }
    } catch (err) {
      console.error(`Error fetching ${sectionKey} content:`, err);
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, error, refetch: fetchContent };
}

export async function saveWebsiteContent<T>(sectionKey: SectionKey, content: T): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: existing } = await supabase
      .from("website_content")
      .select("id")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("website_content")
        .update({ content: content as unknown as Json, updated_at: new Date().toISOString() })
        .eq("section_key", sectionKey);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("website_content")
        .insert({ section_key: sectionKey, content: content as unknown as Json });

      if (error) throw error;
    }

    return { success: true };
  } catch (err) {
    console.error(`Error saving ${sectionKey} content:`, err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to save content" };
  }
}

export async function uploadWebsiteAsset(file: File, folder: "gallery" | "events" | "partners" | "services" | "case-studies"): Promise<{ url: string | null; error?: string }> {
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    const { data, error } = await supabase.storage
      .from("website-assets")
      .upload(`${folder}/${fileName}`, file, { upsert: false });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: urlData } = supabase.storage.from("website-assets").getPublicUrl(data.path);
    return { url: urlData.publicUrl };
  } catch (err) {
    return { url: null, error: err instanceof Error ? err.message : "Upload failed" };
  }
}
