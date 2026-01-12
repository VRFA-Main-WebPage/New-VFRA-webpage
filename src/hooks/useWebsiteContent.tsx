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
  workingHours: string;
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
  phoneNumber: "+91 120 456 7890",
  emergencyPhone: "+91 98765 43210",
  emergencyEmail: "urgent@vfra.in",
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
  phone: "+91 120 456 7890",
  email: "contact@vfra.in",
  address: "Sector 62, Noida, UP, India",
  workingHours: "Mon-Sat: 9AM - 6PM",
};

type SectionKey = "hero" | "cta" | "case_section" | "contact";

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
