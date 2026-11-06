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
  recipientEmail: "contact@vigilantforensic.com",
  ccEmail: "careers@vigilantforensic.com",
  enableDirectEmail: true,
};

export const DEFAULT_JOB_POSTINGS: JobPosting[] = [
  {
    id: "vfra-job-full-stack-developer",
    title: "Full Stack Developer",
    department: "Software & Technology Engineering",
    location: "Nagpur, Maharashtra (On-site / Hybrid)",
    type: "Full-Time",
    experience: "Freshers & candidates with relevant experience",
    salary: "Performance-based incentives & long-term opportunities",
    summary:
      "Contribute to both frontend and backend development of modern web applications—supporting data-heavy dashboards, investigation workflows, case or evidence-related records, analytics, and internal or client-facing digital security platforms.",
    responsibilities: [
      "Develop and maintain responsive frontend interfaces using suitable web technologies and frameworks (React, Angular, Vue).",
      "Build reusable UI components, pages, forms, tables, dashboards, and application layouts.",
      "Develop backend functionality, server-side business logic, and RESTful APIs (Node.js/Express, Java/Spring Boot, Python).",
      "Integrate frontend applications with backend services and handle API requests, responses, loading states, and error handling.",
      "Design, implement, and maintain database schemas, models, relationships, and data operations (MySQL, PostgreSQL, MongoDB).",
      "Implement authentication, role-based authorisation, input validation, and secure application practices.",
      "Debug frontend, backend, and database issues; identify root causes and implement fixes.",
      "Write readable, maintainable, and well-structured code following project development conventions.",
      "Use Git for version control and collaborate through branches, code reviews, and pull requests.",
      "Coordinate with technical and management teams to understand requirements, estimate tasks, and communicate progress.",
    ],
    qualifications: [
      "Strong foundation in at least one web programming language: JavaScript, TypeScript, Java, or Python.",
      "Understanding of frontend fundamentals: HTML5, CSS3, JavaScript, responsive design, and browser debugging.",
      "Practical knowledge of at least one modern frontend framework (React, Angular, Vue) or equivalent development experience.",
      "Understanding of backend development: server-side programming, routing, request/response handling, and REST API concepts.",
      "Practical knowledge of backend technologies (Node.js/Express, Java/Spring Boot, Python/Django or Flask).",
      "Ability to work with relational (MySQL, PostgreSQL) or NoSQL (MongoDB) databases and perform CRUD operations.",
      "Understanding of HTTP methods, status codes, JSON, API integration, and API testing using Postman or similar tools.",
      "Basic Git and GitHub knowledge, debugging skills, problem-solving ability, and willingness to learn.",
      "Suitable for CS, IT, engineering graduates, final-year students, and early-career developers with personal or academic projects.",
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "REST APIs",
      "Git & GitHub",
      "Application Security",
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vfra-job-business-development-executive",
    title: "Business Development Executive",
    department: "Business Development & Client Relations",
    location: "Nagpur, Maharashtra (On-site / Hybrid)",
    type: "Full-Time",
    experience: "Freshers & candidates with relevant experience",
    salary: "Performance-based incentives & Pre-Placement / long-term opportunity",
    summary:
      "Support VFRA's business growth across corporate organisations, law firms, fintech companies, and public-sector ecosystems by identifying potential clients, understanding operational and investigation requirements, presenting forensic capabilities, and qualifying business opportunities.",
    responsibilities: [
      "Research industries, organisations, decision-makers, and potential clients relevant to VFRA's service areas.",
      "Generate leads through professional networking, referrals, email outreach, calls, LinkedIn, events, and other appropriate channels.",
      "Identify client requirements and qualify opportunities based on need, relevance, urgency, and potential scope.",
      "Introduce VFRA's services—including digital forensics, cybercrime investigation, OSINT, blockchain analysis, and investigation solutions—in clear, non-technical business language.",
      "Schedule meetings and coordinate discussions between prospective clients, management, and technical teams.",
      "Prepare and support proposals, capability presentations, quotations, company profiles, and follow-up communication.",
      "Maintain an organised record of leads, meetings, conversations, follow-ups, and opportunity status in a CRM or tracking sheet.",
      "Build and maintain professional relationships with clients, institutional contacts, and industry stakeholders.",
      "Track market developments, competitor positioning, client pain points, and relevant industry opportunities.",
      "Work with the core team to improve outreach strategies, business pipelines, and conversion processes.",
    ],
    qualifications: [
      "Strong verbal and written communication, presentation, and interpersonal skills.",
      "Confidence in speaking with professionals, institutions, and business decision-makers.",
      "Research skills and the ability to identify relevant organisations and qualified potential opportunities.",
      "Persuasive but professional consultative communication, active listening, and relationship-building ability.",
      "Basic understanding of lead generation, sales processes, and business development fundamentals.",
      "Good organisation, follow-up discipline, and ability to maintain accurate records.",
      "Willingness to learn technical service offerings and explain them accurately to non-technical audiences.",
      "Professional conduct, discretion, and respect for confidentiality.",
      "Suitable for graduates, final-year students, and early-career candidates from business, management, commerce, engineering, or related backgrounds.",
    ],
    skills: [
      "Lead Generation",
      "Client Outreach",
      "B2B Sales",
      "CRM & Pipeline",
      "Proposals & Pitches",
      "Market Research",
      "Consultative Engagement",
      "Professional Networking",
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vfra-job-social-media-intern",
    title: "Social Media & Visual Communications Intern",
    department: "Marketing & Brand Communications",
    location: "Nagpur, Maharashtra (On-site / Hybrid)",
    type: "Internship (3 Months)",
    experience: "Freshers & students welcome",
    salary: "Performance-based Pre-Placement Offer (PPO) & Internship Certificate",
    summary:
      "Help build and elevate VFRA's digital brand by combining social media management, graphic design, content creation, branding, and digital communications across LinkedIn, Instagram, and web platforms in a specialised cyber intelligence environment.",
    responsibilities: [
      "Create graphics, carousels, posters, banners, and other social media creatives.",
      "Create and manage content for LinkedIn, Instagram, and other digital platforms.",
      "Develop visual content around cybersecurity, cybercrime, digital forensics, and VFRA's work.",
      "Assist with reels, short-form videos, and promotional content.",
      "Research industry trends and convert them into engaging digital content.",
      "Help maintain and execute the social media content calendar.",
      "Support branding, marketing campaigns, events, announcements, and product launches.",
      "Maintain consistency across VFRA's visual identity, typography, and communication.",
      "Work directly with the founding team on creative and marketing initiatives.",
    ],
    qualifications: [
      "Strong creative and visual sense with an eye for clean digital layouts and typography.",
      "Basic knowledge of Canva, Figma, Photoshop, Illustrator, or similar design tools.",
      "Understanding of social media platforms and content formats (carousels, reels, posts).",
      "Good written and verbal communication skills.",
      "Ability to create professional, engaging visual content.",
      "Willingness to learn and take ownership of assigned creative work.",
      "Video editing and reel creation skills are preferred (Premiere Pro, CapCut, etc.).",
      "Suitable for students and freshers interested in social media, graphic design, digital marketing, and content creation.",
    ],
    skills: [
      "Figma",
      "Canva",
      "Graphic Design",
      "Social Media Management",
      "Content Creation",
      "Video & Reel Editing",
      "LinkedIn Growth",
      "Brand Identity",
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEY = "vfra_careers_module_data_v3";
const SECTION_KEY = "careers_module";

export function useCareersData() {
  const [data, setData] = useState<CareersModuleData>(() => {
    // Try reading cached data from localStorage first
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && Array.isArray(parsed.jobs) && parsed.jobs.length > 0) {
            const sanitizedJobs = parsed.jobs.filter(
              (j: any) => !j.id?.startsWith("vfra-job-0")
            );
            return {
              ...parsed,
              jobs: sanitizedJobs.length > 0 ? sanitizedJobs : DEFAULT_JOB_POSTINGS,
            };
          }
        }
      } catch (e) {
        console.warn("Failed reading local careers data:", e);
      }
    }

    return {
      jobs: DEFAULT_JOB_POSTINGS,
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
        if (remote && Array.isArray(remote.jobs) && remote.jobs.length > 0) {
          const sanitizedJobs = remote.jobs.filter(
            (j: any) => !j.id?.startsWith("vfra-job-0")
          );
          const finalJobs = sanitizedJobs.length > 0 ? sanitizedJobs : DEFAULT_JOB_POSTINGS;
          const merged: CareersModuleData = {
            jobs: finalJobs,
            applications: Array.isArray(remote.applications) ? remote.applications : [],
            settings: remote.settings || DEFAULT_CAREERS_SETTINGS,
          };
          setData(merged);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        }
      } else {
        // If not stored in Supabase yet, use DEFAULT_JOB_POSTINGS
        setData((prev) => {
          const nextJobs = prev.jobs.length > 0 ? prev.jobs : DEFAULT_JOB_POSTINGS;
          const updated = {
            ...prev,
            jobs: nextJobs,
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
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
