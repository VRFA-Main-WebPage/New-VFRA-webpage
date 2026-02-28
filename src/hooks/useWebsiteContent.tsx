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
  phone24x7: string;
  email: string;
  urgentEmail: string;
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
  badge: "India's Trusted Digital Forensics Partner",
  headingLine1: "Uncover the Truth with",
  headingLine2: "Expert Digital Forensics",
  description: "Professional cybercrime investigation, digital evidence analysis, and expert witness services for law enforcement, government agencies, and corporate clients across India.",
  primaryButtonText: "Request Consultation",
  secondaryButtonText: "Explore Services",
  stats: [
    { value: "500+", label: "Cases Solved" },
    { value: "200+", label: "Clients Served" },
    { value: "15+", label: "Years Experience" },
    { value: "100%", label: "Confidential" },
  ],
};

export const defaultCTAContent: CTAContent = {
  badge: "24/7 EMERGENCY RESPONSE",
  heading: "Need Urgent Assistance?",
  highlightWord: "Urgent",
  description: "Our expert team is available for emergency incident response and urgent consultations. Contact us now to discuss your case confidentially.",
  primaryButtonText: "Schedule Consultation",
  phoneNumber: "+91 95119 57687",
  emergencyPhone: "+91 95119 57687",  // ADD THIS
  emergencyEmail: "vfrapvtltd@gmail.com",
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
  phone24x7: "+91 95119 57687",
  email: "contact@vigilantforensics.com",
  urgentEmail: "vfrapvtltd@gmail.com",
  address: "Plot No. 5 Akhil Vishwa Bharti Co-Op. Society",
  addressLine2: "Opp. Prathamesh Towers, Besa Nagpur (M Corp.)",
  addressLine3: "Maharashtra – 440034",
  workingHours: "Monday - Friday: 9:00 AM - 6:00 PM",
};

export const defaultFooterContent: FooterContent = {
  tagline: "India's trusted digital forensics and cybercrime investigation laboratory. Providing expert solutions to law enforcement, government, and corporate clients.",
  gstin: "09AAACF1234A1ZZ",
  cin: "U69100PN2025PTC250064 ",
  linkedin: "#",
  twitter: "#",
  github: "#",
};

export const defaultTrustContent: TrustContent = {
  badge: "Why Choose Us",
  heading: "Trusted by India's Leading Organizations",
  highlightWord: "Leading Organizations",
  description: "With over 15 years of experience in digital forensics and cybercrime investigation, we've established ourselves as India's trusted partner for sensitive investigations. Our state-of-the-art laboratory and certified experts ensure accurate, court-admissible evidence.",
  certifications: ["ISO 27001 Certified", "NABL Accredited Lab", "EnCase Certified", "Cellebrite Certified", "ACE Certified"],
  clientTypes: [
    { icon: "Scale", label: "Law Enforcement", description: "Police & Cyber Cells" },
    { icon: "Building2", label: "Government", description: "Agencies & PSUs" },
    { icon: "Briefcase", label: "Corporate", description: "Enterprises & MNCs" },
    { icon: "GraduationCap", label: "Legal", description: "Courts & Law Firms" },
  ],
};

export const defaultServicesSectionContent: ServicesSectionContent = {
  badge: "Our Expertise",
  heading: "Comprehensive Digital Forensics Services",
  description: "From mobile device analysis to enterprise incident response, we provide end-to-end digital investigation services backed by cutting-edge technology and certified experts.",
};

export const defaultAboutContent: AboutContent = {
  heroTitle: "India's Premier Digital Forensics Laboratory",
  heroDescription: "For over 15 years, we've been at the forefront of digital forensics and cybercrime investigation, serving law enforcement, government agencies, and enterprises across India.",
  mission: "To provide world-class digital forensics services that help uncover the truth, support justice, and protect organizations from cyber threats. We are committed to maintaining the highest standards of integrity, accuracy, and confidentiality in every investigation.",
  vision: "To be India's most trusted digital forensics partner, recognized globally for excellence in investigation, innovation in methodology, and commitment to training the next generation of cybersecurity professionals.",
  labEquipment: [
    "Cellebrite UFED for mobile device extraction",
    "EnCase Forensic workstations",
    "X-Ways Forensics suite",
    "Hardware write blockers and imaging systems",
    "Faraday cages for secure device handling",
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
