import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // Full-Time | Part-Time | Internship | Contract
  experience: string;
  salary?: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  skills?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  portfolioUrl?: string;
  coverNote: string;
  resumeFileName?: string;
  resumeDataUrl?: string; // Base64 data URL for instant admin download/preview
  status: "New" | "Reviewing" | "Shortlisted" | "Rejected";
  appliedAt: string;
}

export interface CareersSettings {
  recipientEmail: string;
  ccEmail: string;
  enableDirectEmail: boolean;
}

export interface CareersModuleData {
  jobs: JobPosting[];
  applications: JobApplication[];
  settings: CareersSettings;
}

export const DEFAULT_CAREERS_SETTINGS: CareersSettings = {
  recipientEmail: "careers@vigilantforensic.com",
  ccEmail: "contact@vigilantforensic.com",
  enableDirectEmail: true,
};

export const DEFAULT_JOB_POSTINGS: JobPosting[] = [];

const LOCAL_STORAGE_KEY = "vfra_careers_module_data_v2";
const SECTION_KEY = "careers_module";

export function useCareersData() {
  const [data, setData] = useState<CareersModuleData>(() => {
    // Try reading cached data from localStorage first
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && Array.isArray(parsed.jobs)) {
            const sanitizedJobs = parsed.jobs.filter(
              (j: any) => !j.id?.startsWith("vfra-job-0")
            );
            return {
              ...parsed,
              jobs: sanitizedJobs,
            };
          }
        }
      } catch (e) {
        console.warn("Failed reading local careers data:", e);
      }
    }

    return {
      jobs: [],
      applications: [],
      settings: DEFAULT_CAREERS_SETTINGS,
    };
  });

  const [loading, setLoading] = useState(true);

  // Fetch from Supabase on mount
  useEffect(() => {
    fetchCareersData();
  }, []);

  const fetchCareersData = async () => {
    try {
      setLoading(true);
      const { data: row, error } = await supabase
        .from("website_content")
        .select("content")
        .eq("section_key", SECTION_KEY)
        .maybeSingle();

      if (error) {
        console.warn("Supabase careers_module read warning (using local fallback):", error);
        return;
      }

      if (row?.content) {
        const remote = row.content as unknown as CareersModuleData;
        if (remote && Array.isArray(remote.jobs)) {
          const sanitizedJobs = remote.jobs.filter(
            (j: any) => !j.id?.startsWith("vfra-job-0")
          );
          const merged: CareersModuleData = {
            jobs: sanitizedJobs,
            applications: Array.isArray(remote.applications) ? remote.applications : [],
            settings: remote.settings || DEFAULT_CAREERS_SETTINGS,
          };
          setData(merged);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        }
      }
    } catch (err) {
      console.warn("Error fetching careers data from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to persist data to Supabase and localStorage
  const persistData = async (newData: CareersModuleData): Promise<boolean> => {
    setData(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));

      const { data: existing } = await supabase
        .from("website_content")
        .select("id")
        .eq("section_key", SECTION_KEY)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("website_content")
          .update({ content: newData as unknown as Json, updated_at: new Date().toISOString() })
          .eq("section_key", SECTION_KEY);
      } else {
        await supabase
          .from("website_content")
          .insert({ section_key: SECTION_KEY, content: newData as unknown as Json });
      }

      return true;
    } catch (err) {
      console.error("Error saving careers data:", err);
      return false;
    }
  };

  // Save or update a job posting
  const saveJob = async (job: JobPosting): Promise<boolean> => {
    const existingIndex = data.jobs.findIndex((j) => j.id === job.id);
    let updatedJobs: JobPosting[];

    if (existingIndex >= 0) {
      updatedJobs = [...data.jobs];
      updatedJobs[existingIndex] = { ...job, updatedAt: new Date().toISOString() };
    } else {
      updatedJobs = [
        {
          ...job,
          id: job.id || `vfra-job-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
        ...data.jobs,
      ];
    }

    return persistData({ ...data, jobs: updatedJobs });
  };

  // Delete a job posting
  const deleteJob = async (jobId: string): Promise<boolean> => {
    const updatedJobs = data.jobs.filter((j) => j.id !== jobId);
    return persistData({ ...data, jobs: updatedJobs });
  };

  // Toggle active status
  const toggleJobStatus = async (jobId: string): Promise<boolean> => {
    const updatedJobs = data.jobs.map((j) =>
      j.id === jobId ? { ...j, isActive: !j.isActive, updatedAt: new Date().toISOString() } : j
    );
    return persistData({ ...data, jobs: updatedJobs });
  };

  // Submit an application
  const submitApplication = async (
    appData: Omit<JobApplication, "id" | "appliedAt" | "status">
  ): Promise<{ success: boolean; id: string; mailtoUrl: string }> => {
    const newApp: JobApplication = {
      ...appData,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: "New",
      appliedAt: new Date().toISOString(),
    };

    const updatedApps = [newApp, ...(data.applications || [])];
    const success = await persistData({ ...data, applications: updatedApps });

    // Build the formatted mailto URL so it can be directly transmitted to email
    const recipient = data.settings?.recipientEmail || "careers@vigilantforensic.com";
    const cc = data.settings?.ccEmail || "contact@vigilantforensic.com";
    const subject = encodeURIComponent(
      `[VFRA Job Application] ${appData.jobTitle} - ${appData.fullName}`
    );

    const bodyText = `
NEW VFRA CAREER APPLICATION
--------------------------------------------------------------
Applied Position: ${appData.jobTitle}
Reference ID: ${newApp.id}
Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

CANDIDATE INFORMATION:
• Full Name: ${appData.fullName}
• Email Address: ${appData.email}
• Contact Number: ${appData.phone}
• Total Relevant Experience: ${appData.experience || "Not specified"}
• Portfolio / LinkedIn: ${appData.portfolioUrl || "Not provided"}

COVER NOTE / EVIDENTIARY BACKGROUND:
${appData.coverNote || "None provided"}

RESUME / CV DETAILS:
${appData.resumeFileName ? `Attached File: ${appData.resumeFileName}` : "CV to be attached to this email."}
--------------------------------------------------------------
Candidate applied via VFRA Careers Portal.
    `.trim();

    const mailtoUrl = `mailto:${recipient}?cc=${cc}&subject=${subject}&body=${encodeURIComponent(bodyText)}`;

    return {
      success,
      id: newApp.id,
      mailtoUrl,
    };
  };

  // Update application status
  const updateApplicationStatus = async (
    appId: string,
    status: JobApplication["status"]
  ): Promise<boolean> => {
    const updatedApps = data.applications.map((a) =>
      a.id === appId ? { ...a, status } : a
    );
    return persistData({ ...data, applications: updatedApps });
  };

  // Delete an application
  const deleteApplication = async (appId: string): Promise<boolean> => {
    const updatedApps = data.applications.filter((a) => a.id !== appId);
    return persistData({ ...data, applications: updatedApps });
  };

  // Save settings
  const saveSettings = async (settings: CareersSettings): Promise<boolean> => {
    return persistData({ ...data, settings });
  };

  return {
    jobs: data.jobs,
    activeJobs: data.jobs.filter((j) => j.isActive),
    applications: data.applications || [],
    settings: data.settings || DEFAULT_CAREERS_SETTINGS,
    loading,
    saveJob,
    deleteJob,
    toggleJobStatus,
    submitApplication,
    updateApplicationStatus,
    deleteApplication,
    saveSettings,
    refetch: fetchCareersData,
  };
}
