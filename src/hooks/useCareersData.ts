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
  recipientEmail: "hiring@vigilantforensic.com",
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

function mapCaseRowToApplication(row: any): JobApplication {
  let meta: any = {};
  if (row.description) {
    try {
      meta = JSON.parse(row.description);
    } catch {
      meta = { coverNote: row.description };
    }
  }

  let status: JobApplication["status"] = "New";
  if (row.status === "Reviewing" || row.status === "under_review" || row.status === "in_progress") {
    status = "Reviewing";
  } else if (row.status === "Shortlisted" || row.status === "resolved") {
    status = "Shortlisted";
  } else if (row.status === "Rejected" || row.status === "closed") {
    status = "Rejected";
  } else {
    status = "New";
  }

  let validResumeDataUrl = meta.resumeDataUrl;
  if (
    typeof validResumeDataUrl === "string" &&
    (validResumeDataUrl.includes("AAAAAAAAAA") || validResumeDataUrl.length < 50)
  ) {
    validResumeDataUrl = undefined;
  }

  return {
    id: row.id,
    jobId: meta.jobId || "vfra-job-general",
    jobTitle:
      meta.jobTitle ||
      (row.title ? row.title.replace(/^\[Job Application\]\s*/i, "") : "Position"),
    fullName: row.client_name || meta.fullName || "Candidate",
    email: row.client_email || meta.email || "",
    phone: row.client_phone || meta.phone || "",
    experience: meta.experience || "",
    portfolioUrl: meta.portfolioUrl || undefined,
    coverNote: meta.coverNote || row.notes || "",
    resumeFileName: meta.resumeFileName || undefined,
    resumeDataUrl: validResumeDataUrl || undefined,
    status,
    appliedAt: row.created_at || new Date().toISOString(),
  };
}

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
              settings: parsed.settings || DEFAULT_CAREERS_SETTINGS,
              applications: Array.isArray(parsed.applications) ? parsed.applications : [],
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

      // 1. Fetch Job Postings from website_content (or fallback to defaults)
      let fetchedJobs: JobPosting[] = DEFAULT_JOB_POSTINGS;
      let fetchedSettings: CareersSettings = DEFAULT_CAREERS_SETTINGS;

      try {
        const { data: row, error: wcError } = await supabase
          .from("website_content")
          .select("content")
          .eq("section_key", SECTION_KEY)
          .maybeSingle();

        if (!wcError && row?.content) {
          const remote = row.content as any;
          if (remote && Array.isArray(remote.jobs) && remote.jobs.length > 0) {
            const sanitizedJobs = remote.jobs.filter(
              (j: any) => !j.id?.startsWith("vfra-job-0")
            );
            if (sanitizedJobs.length > 0) {
              fetchedJobs = sanitizedJobs;
            }
          }
          if (remote?.settings?.recipientEmail) {
            fetchedSettings = {
              recipientEmail: remote.settings.recipientEmail,
              ccEmail: remote.settings.ccEmail || DEFAULT_CAREERS_SETTINGS.ccEmail,
              enableDirectEmail: remote.settings.enableDirectEmail ?? true,
            };
          }
        }
      } catch (err) {
        console.warn("Supabase careers_module read warning (using fallback):", err);
      }

      // 2. Fetch Settings from cases table (real-time settings storage)
      try {
        const { data: settingCase } = await supabase
          .from("cases")
          .select("description, client_email, client_phone")
          .eq("category", "careers_settings")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (settingCase?.description) {
          try {
            const parsed = JSON.parse(settingCase.description);
            if (parsed?.recipientEmail) {
              fetchedSettings = {
                recipientEmail: parsed.recipientEmail,
                ccEmail: parsed.ccEmail || fetchedSettings.ccEmail,
                enableDirectEmail: parsed.enableDirectEmail ?? true,
              };
            }
          } catch (e) {
            if (settingCase.client_email) {
              fetchedSettings.recipientEmail = settingCase.client_email;
            }
            if (settingCase.client_phone) {
              fetchedSettings.ccEmail = settingCase.client_phone;
            }
          }
        }
      } catch (err) {
        console.warn("Could not read careers_settings from cases table:", err);
      }

      // 3. Fetch Applications from cases table (category = 'job_application')
      let fetchedApps: JobApplication[] = [];
      try {
        const { data: caseRows, error: appsError } = await supabase
          .from("cases")
          .select("*")
          .eq("category", "job_application")
          .order("created_at", { ascending: false });

        if (!appsError && caseRows) {
          const validRows = caseRows.filter(
            (r) =>
              !r.title?.includes("Test Big") &&
              !r.client_name?.includes("Test Big")
          );
          fetchedApps = validRows.map(mapCaseRowToApplication);
        }
      } catch (err) {
        console.warn("Could not read job applications from cases table:", err);
      }

      // Merge any local applications cached offline if not already present
      let finalApps = fetchedApps;
      if (typeof window !== "undefined") {
        try {
          const localStr = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localStr) {
            const localObj = JSON.parse(localStr);
            if (Array.isArray(localObj.applications) && localObj.applications.length > 0) {
              const existingIds = new Set(fetchedApps.map((a) => a.id));
              const missingLocal = localObj.applications.filter(
                (a: JobApplication) =>
                  !existingIds.has(a.id) &&
                  !a.fullName?.includes("Test Big") &&
                  !a.jobTitle?.includes("Test Big")
              );
              finalApps = [...fetchedApps, ...missingLocal];
            }
          }
        } catch (e) {}
      }

      const mergedData: CareersModuleData = {
        jobs: fetchedJobs,
        applications: finalApps,
        settings: fetchedSettings,
      };

      setData(mergedData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));
      } catch (e) {}
    } catch (err) {
      console.warn("Error fetching careers data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to persist jobs data to Supabase website_content and localStorage
  const persistJobsData = async (newJobs: JobPosting[]): Promise<boolean> => {
    const updatedData: CareersModuleData = { ...data, jobs: newJobs };
    setData(updatedData);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));

      const { data: existing } = await supabase
        .from("website_content")
        .select("id, content")
        .eq("section_key", SECTION_KEY)
        .maybeSingle();

      const existingContent = (existing?.content as any) || {};
      const newContent = {
        ...existingContent,
        jobs: newJobs,
        settings: data.settings,
      };

      if (existing) {
        await supabase
          .from("website_content")
          .update({ content: newContent as unknown as Json, updated_at: new Date().toISOString() })
          .eq("section_key", SECTION_KEY);
      } else {
        await supabase
          .from("website_content")
          .insert({ section_key: SECTION_KEY, content: newContent as unknown as Json });
      }

      return true;
    } catch (err) {
      console.error("Error saving careers jobs data:", err);
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

    return persistJobsData(updatedJobs);
  };

  // Delete a job posting
  const deleteJob = async (jobId: string): Promise<boolean> => {
    const updatedJobs = data.jobs.filter((j) => j.id !== jobId);
    return persistJobsData(updatedJobs);
  };

  // Toggle active status
  const toggleJobStatus = async (jobId: string): Promise<boolean> => {
    const updatedJobs = data.jobs.map((j) =>
      j.id === jobId ? { ...j, isActive: !j.isActive, updatedAt: new Date().toISOString() } : j
    );
    return persistJobsData(updatedJobs);
  };

  // Submit an application
  const submitApplication = async (
    appData: Omit<JobApplication, "id" | "appliedAt" | "status">
  ): Promise<{ success: boolean; id: string; mailtoUrl: string }> => {
    let assignedId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Store resume data URL for up to 5MB files (approx 7.5M - 8M base64 chars)
    const safeResumeDataUrl =
      appData.resumeDataUrl && appData.resumeDataUrl.length < 8000000
        ? appData.resumeDataUrl
        : undefined;

    const descriptionPayload = JSON.stringify({
      jobId: appData.jobId,
      jobTitle: appData.jobTitle,
      experience: appData.experience,
      portfolioUrl: appData.portfolioUrl,
      coverNote: appData.coverNote,
      resumeFileName: appData.resumeFileName,
      resumeDataUrl: safeResumeDataUrl,
    });

    try {
      const { data: inserted, error: insertError } = await supabase
        .from("cases")
        .insert({
          title: `[Job Application] ${appData.jobTitle} - ${appData.fullName}`,
          client_name: appData.fullName,
          client_email: appData.email,
          client_phone: appData.phone,
          category: "job_application",
          status: "New",
          priority: "medium",
          description: descriptionPayload,
        })
        .select("id")
        .single();

      if (!insertError && inserted?.id) {
        assignedId = inserted.id;
      } else if (insertError) {
        console.warn("Application saved locally, Supabase case insert note:", insertError);
      }
    } catch (err) {
      console.warn("Exception writing to cases table:", err);
    }

    const newApp: JobApplication = {
      ...appData,
      id: assignedId,
      status: "New",
      appliedAt: new Date().toISOString(),
    };

    setData((prev) => {
      const updatedApps = [newApp, ...(prev.applications || [])];
      const updated = { ...prev, applications: updatedApps };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Build the formatted mailto URL so it can be directly transmitted to email
    const recipient = data.settings?.recipientEmail || DEFAULT_CAREERS_SETTINGS.recipientEmail;
    const cc = data.settings?.ccEmail || DEFAULT_CAREERS_SETTINGS.ccEmail;
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
      success: true,
      id: newApp.id,
      mailtoUrl,
    };
  };

  // Update application status
  const updateApplicationStatus = async (
    appId: string,
    status: JobApplication["status"]
  ): Promise<boolean> => {
    try {
      await supabase.from("cases").update({ status }).eq("id", appId);
    } catch (e) {
      console.warn("Could not update application status in cases:", e);
    }

    setData((prev) => {
      const updatedApps = (prev.applications || []).map((a) =>
        a.id === appId ? { ...a, status } : a
      );
      const next = { ...prev, applications: updatedApps };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    return true;
  };

  // Delete an application
  const deleteApplication = async (appId: string): Promise<boolean> => {
    try {
      await supabase.from("cases").delete().eq("id", appId);
    } catch (e) {
      console.warn("Could not delete application from cases:", e);
    }

    setData((prev) => {
      const updatedApps = (prev.applications || []).filter((a) => a.id !== appId);
      const next = { ...prev, applications: updatedApps };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    return true;
  };

  // Save settings
  const saveSettings = async (settings: CareersSettings): Promise<boolean> => {
    try {
      await supabase.from("cases").insert({
        title: "[System Config] Careers Email Routing",
        client_name: "VFRA System",
        client_email: settings.recipientEmail,
        client_phone: settings.ccEmail,
        category: "careers_settings",
        status: "closed",
        priority: "medium",
        description: JSON.stringify(settings),
      });
    } catch (e) {
      console.warn("Failed saving settings to cases:", e);
    }

    try {
      const { data: existing } = await supabase
        .from("website_content")
        .select("id, content")
        .eq("section_key", SECTION_KEY)
        .maybeSingle();

      if (existing) {
        const existingContent = (existing.content as any) || {};
        await supabase
          .from("website_content")
          .update({
            content: { ...existingContent, settings } as unknown as Json,
            updated_at: new Date().toISOString(),
          })
          .eq("section_key", SECTION_KEY);
      }
    } catch (e) {
      // ignore
    }

    setData((prev) => {
      const next = { ...prev, settings };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    return true;
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
