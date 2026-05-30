import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
    "Established in 2026, we specialize in structured digital forensics and cybercrime investigation services, supporting legal professionals, organizations, and investigative teams with technically sound and defensible analysis.",

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

type SectionKey = "hero" | "cta" | "case_section" | "contact" | "footer" | "trust" | "services_section" | "about";

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
        // Merge fetched content with defaults to ensure all fields exist
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
    // Check if record exists
    const { data: existing } = await supabase
      .from("website_content")
      .select("id")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("website_content")
        .update({ content: content as unknown as Json, updated_at: new Date().toISOString() })
        .eq("section_key", sectionKey);

      if (error) throw error;
    } else {
      // Insert new
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
