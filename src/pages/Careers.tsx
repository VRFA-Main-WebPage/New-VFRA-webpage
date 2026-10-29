import { useState } from "react";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Shield,
  Search,
  CheckCircle2,
  ArrowRight,
  Send,
  Building2,
  HardDrive,
  FileCheck,
  Mail,
  GraduationCap,
  Copy,
  Paperclip,
  Check,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useCareersData, JobPosting } from "@/hooks/useCareersData";

const GENERAL_APPLICATION_JOB: JobPosting = {
  id: "general-application",
  title: "General Forensic & Technical Application",
  department: "Forensic Operations & Research Directorate",
  location: "Nagpur Central Laboratory / Remote",
  type: "Full-Time / Research Fellowship",
  experience: "All Levels",
  summary:
    "Submit your resume and credentials for upcoming casework, reverse engineering, mobile acquisition, and research openings at VFRA.",
  responsibilities: [
    "Digital evidence acquisition, forensic examination, or threat intelligence investigation.",
    "Drafting courtroom-admissible Section 65B documentation or research advisories.",
  ],
  qualifications: [
    "Relevant background in digital forensics, cyber security, computer science, law, or reverse engineering.",
  ],
  isActive: true,
  createdAt: new Date().toISOString(),
};

export default function Careers() {
  const { activeJobs, submitApplication, settings, loading } = useCareersData();

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [notes, setNotes] = useState("");

  // Resume File State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeDataUrl, setResumeDataUrl] = useState<string | undefined>(undefined);

  // Success Confirmation State
  const [lastSubmissionMailto, setLastSubmissionMailto] = useState("");
  const [lastSubmissionSummary, setLastSubmissionSummary] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenApply = (job: JobPosting) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a resume file under 5MB (PDF, DOC, or DOCX).",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);

    // Read file as Base64 Data URL so it can be previewed/downloaded in Admin Panel
    const reader = new FileReader();
    reader.onload = () => {
      setResumeDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter your full name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedJob) return;

    setIsSubmitting(true);

    try {
      const { success, mailtoUrl } = await submitApplication({
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: experience.trim(),
        portfolioUrl: portfolio.trim(),
        coverNote: notes.trim(),
        resumeFileName: resumeFileName || undefined,
        resumeDataUrl: resumeDataUrl || undefined,
      });

      const summaryText = `
Job Application for: ${selectedJob.title}
Candidate: ${fullName.trim()}
Email: ${email.trim()}
Phone: ${phone.trim()}
Experience: ${experience.trim()}
LinkedIn/Portfolio: ${portfolio.trim()}
Cover Note: ${notes.trim()}
Resume: ${resumeFileName || "Sent via direct email attachment"}
      `.trim();

      setLastSubmissionMailto(mailtoUrl);
      setLastSubmissionSummary(summaryText);

      // Attempt immediate mail client launch
      try {
        const mailLink = document.createElement("a");
        mailLink.href = mailtoUrl;
        mailLink.click();
      } catch (err) {
        console.log("Auto-mailto prevented by browser policy", err);
      }

      setIsSubmitting(false);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);

      toast({
        title: "Application Received & Logged",
        description: `Your application has been registered and routed to ${settings.recipientEmail}.`,
      });

      // Clear Form
      setFullName("");
      setEmail("");
      setPhone("");
      setExperience("");
      setPortfolio("");
      setNotes("");
      setResumeFile(null);
      setResumeFileName("");
      setResumeDataUrl(undefined);
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: "Submission Error",
        description: "An error occurred while saving your application. Please email careers@vigilantforensic.com directly.",
        variant: "destructive",
      });
    }
  };

  const copyApplicationSummary = () => {
    navigator.clipboard.writeText(lastSubmissionSummary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copied to Clipboard",
      description: "Application summary copied. You can now paste it into your email client.",
    });
  };

  return (
    <>
      <SEO
        title="Careers & Forensic Fellowships | VFRA"
        description="Join Vigilant Forensic Research & Analytics Pvt. Ltd. Explore career opportunities in digital forensics, cyber investigations, malware analysis, OSINT, and Section 65B forensics."
      />

      <div className="bg-[#FAF9F6] min-h-screen">
        {/* 1. Hero Header */}
        <section className="relative py-16 md:py-24 bg-white border-b border-[#E5E5E3] overflow-hidden">
          <div className="container relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl space-y-5"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#111111]" />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#71717A] font-semibold">
                  VFRA LABORATORY CAREERS &amp; FELLOWSHIPS
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#111111] leading-tight"
              >
                Build the Future of Digital Forensics &amp; Cyber Investigation.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg text-[#555555] leading-relaxed"
              >
                Vigilant Forensic Research and Analytics (VFRA) is India&rsquo;s dedicated independent
                forensic laboratory. We are assembling an elite, multidisciplinary cadre of examiners,
                reverse engineers, threat intelligence analysts, and evidentiary specialists investigating
                high-stakes digital incidents.
              </motion.p>

              {/* Institutional Backing & Location Badges */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-2.5 pt-2"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E5E5E3] font-mono text-xs text-[#111111]">
                  <MapPin className="h-3.5 w-3.5 text-[#825816]" />
                  Central Laboratory: Nagpur, Maharashtra
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E5E5E3] font-mono text-xs text-[#111111]">
                  <Building2 className="h-3.5 w-3.5 text-[#825816]" />
                  Incubated at AIC-INFED (IIM Nagpur)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E5E5E3] font-mono text-xs text-[#111111]">
                  <Sparkles className="h-3.5 w-3.5 text-[#825816]" />
                  Supported by AIM, NITI Aayog
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. Pillars of Working at VFRA */}
        <section className="py-12 md:py-16 bg-[#FAF9F6] border-b border-[#E5E5E3]">
          <div className="container">
            <div className="max-w-2xl mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#71717A] font-semibold">
                LABORATORY CULTURE &amp; RIGOR
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mt-1.5">
                Why Practice Forensics at VFRA?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-xl bg-white border border-[#E5E5E3] shadow-2xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-[#FAF9F6] border border-[#E5E5E3] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#111111]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#111111]">
                  High-Stakes National Impact
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Direct technical assistance on critical cybercrime, financial fraud, and legal proceedings
                  with law enforcement and judiciary bodies.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#E5E5E3] shadow-2xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-[#FAF9F6] border border-[#E5E5E3] flex items-center justify-center">
                  <HardDrive className="h-5 w-5 text-[#111111]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#111111]">
                  Hardware-Grade Rigs &amp; Suites
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Work with physical write-blockers, chip-off stations, GPU password recovery clusters,
                  and industry forensic software.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#E5E5E3] shadow-2xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-[#FAF9F6] border border-[#E5E5E3] flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-[#111111]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#111111]">
                  Section 65B &amp; BSA Rigor
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Master the procedural rules of evidence under the Bharatiya Sakshya Adhiniyam, 2023,
                  producing court-tested testimony.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#E5E5E3] shadow-2xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-[#FAF9F6] border border-[#E5E5E3] flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-[#111111]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#111111]">
                  Continuous Research &amp; Fellowship
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Incubated at AIC-INFED (IIM Nagpur), fostering cutting-edge reverse engineering, darknet
                  monitoring, and published technical papers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Open Positions (Dynamically Managed from Admin Console) */}
        <section className="py-14 md:py-20 bg-white border-b border-[#E5E5E3]">
          <div className="container space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E5E3]">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#71717A] font-semibold">
                  CURRENT LABORATORY VACANCIES
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
                  Active Forensic Openings.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#555555] max-w-md">
                We review applications on a rolling basis. All positions undergo integrity assessments
                and chain-of-custody background screening.
              </p>
            </div>

            {/* Dynamic Job Grid from Admin Data */}
            {activeJobs.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#FAF9F6] border border-[#E5E5E3] space-y-5 max-w-3xl mx-auto shadow-2xs">
                <div className="h-14 w-14 rounded-2xl bg-white border border-[#E5E5E3] text-[#111111] flex items-center justify-center mx-auto shadow-2xs">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-bold text-[#111111]">
                    No Public Openings at Present
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555555] max-w-lg mx-auto leading-relaxed">
                    Our team is currently finalizing new technical forensic, investigation, and research roles.
                    In the meantime, we actively welcome general and speculative applications from talented examiners,
                    reverse engineers, and cyber investigators.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => handleOpenApply(GENERAL_APPLICATION_JOB)}
                    className="h-10 px-5 bg-[#111111] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.08em] rounded-lg gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit General Application / CV</span>
                  </Button>
                  <a
                    href={`mailto:${settings.recipientEmail}`}
                    className="h-10 px-4 rounded-lg bg-white hover:bg-[#FAF9F6] border border-[#E5E5E3] text-[#111111] text-xs font-mono inline-flex items-center gap-2"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#555555]" />
                    <span>{settings.recipientEmail}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 sm:p-7 rounded-2xl bg-[#FAF9F6] border border-[#E5E5E3] hover:border-[#111111] transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-11 w-11 rounded-xl bg-white border border-[#E5E5E3] group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                          <Briefcase className="h-5 w-5 text-[#111111] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 justify-end text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-white border border-[#E5E5E3] text-[#555555]">
                            {job.type}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#111111] text-white">
                            {job.experience}
                          </span>
                        </div>
                      </div>

                      {/* Title & Dept */}
                      <div>
                        <span className="font-mono text-[10px] text-[#825816] uppercase tracking-wider font-semibold">
                          {job.department}
                        </span>
                        <h3 className="font-heading font-semibold text-lg text-[#111111] group-hover:text-[#825816] transition-colors mt-0.5">
                          {job.title}
                        </h3>
                        <p className="text-xs text-[#555555] mt-1 flex items-center gap-1.5 font-mono">
                          <MapPin className="h-3 w-3 text-[#71717A]" />
                          {job.location}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                        {job.summary}
                      </p>

                      {/* Responsibilities */}
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div className="pt-2 border-t border-[#EAE9E4]">
                          <h4 className="font-mono text-[10.5px] uppercase tracking-wider text-[#111111] font-semibold mb-2">
                            Core Responsibilities:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-[#555555]">
                            {job.responsibilities.slice(0, 3).map((resp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#047857] shrink-0 mt-0.5" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5E5E3] text-[#444444]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-6 mt-6 border-t border-[#EAE9E4] flex items-center justify-between gap-4">
                      <span className="text-[11px] font-mono text-[#71717A]">
                        Ref: VFRA-{job.id.substring(0, 10).toUpperCase()}
                      </span>
                      <Button
                        type="button"
                        onClick={() => handleOpenApply(job)}
                        className="h-9 px-4 bg-[#111111] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.08em] rounded-lg flex items-center gap-2 group-hover:scale-[1.02] transition-transform"
                      >
                        <span>Apply For Role</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Hiring & Vetting Process */}
        <section className="py-14 md:py-20 bg-[#FAF9F6] border-b border-[#E5E5E3]">
          <div className="container space-y-10">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#71717A] font-semibold">
                SELECTION STANDARD OPERATING PROCEDURE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
                Our 4-Stage Candidate Evaluation.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  title: "Portfolio & Technical CV Review",
                  desc: "We examine your concrete casework, research write-ups, code repositories, and laboratory background.",
                },
                {
                  step: "02",
                  title: "Practical Forensic Assessment",
                  desc: "Demonstrate your methodology on sample forensic images, PCAP captures, memory dumps, or legal drafting tasks.",
                },
                {
                  step: "03",
                  title: "Directorate & Peer Interview",
                  desc: "Technical discussion with senior forensic examiners focusing on methodology, problem-solving, and legal ethics.",
                },
                {
                  step: "04",
                  title: "Security Clearance & Offer",
                  desc: "Formal background integrity verification, chain-of-custody non-disclosure execution, and onboarding.",
                },
              ].map((phase) => (
                <div
                  key={phase.step}
                  className="p-6 rounded-xl bg-white border border-[#E5E5E3] shadow-2xs space-y-2.5 relative"
                >
                  <span className="font-mono text-xs text-[#825816] font-bold">
                    STAGE {phase.step}
                  </span>
                  <h3 className="font-heading font-semibold text-sm text-[#111111]">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Direct Contact & Speculative Applications */}
        <section className="py-14 md:py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto rounded-2xl bg-[#FAF9F6] border border-[#E5E5E3] p-8 sm:p-12 text-center space-y-5">
              <div className="h-12 w-12 rounded-full bg-white border border-[#E5E5E3] flex items-center justify-center mx-auto shadow-2xs">
                <Mail className="h-5 w-5 text-[#111111]" />
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold text-[#111111]">
                  Don&rsquo;t See an Exact Match?
                </h2>
                <p className="text-xs sm:text-sm text-[#555555] max-w-lg mx-auto leading-relaxed">
                  We are always eager to connect with seasoned forensic researchers, ethical hackers,
                  cryptographic analysts, and legal practitioners.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${settings.recipientEmail}?subject=Speculative%20Forensic%20Application`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.1em] transition-all shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Email: {settings.recipientEmail}</span>
                </a>
                <p className="text-[11px] font-mono text-[#71717A] mt-2">
                  Please attach your CV, work history, and forensic portfolio.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Application Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg p-6 sm:p-8 bg-white border border-[#E5E5E3] rounded-2xl">
          <DialogHeader className="space-y-1.5 text-left">
            <span className="font-mono text-[10px] text-[#825816] uppercase tracking-wider font-semibold">
              EVIDENTIARY APPLICATION
            </span>
            <DialogTitle className="font-heading text-xl font-bold text-[#111111]">
              Apply for {selectedJob?.title || "Position"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#555555]">
              Submit your details and CV below. Your submission is recorded directly in our laboratory
              portal and transmitted to our recruitment desk.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-[#111111] mb-1 font-medium">
                Full Name *
              </label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Adv. Rohit Sharma / Rahul Verma"
                className="h-10 text-xs bg-[#FAF9F6] border-[#E5E5E3] focus-visible:ring-black/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#111111] mb-1 font-medium">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="h-10 text-xs bg-[#FAF9F6] border-[#E5E5E3] focus-visible:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#111111] mb-1 font-medium">
                  Contact Number *
                </label>
                <Input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-10 text-xs bg-[#FAF9F6] border-[#E5E5E3] focus-visible:ring-black/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#111111] mb-1 font-medium">
                  Relevant Experience
                </label>
                <Input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 3 Years (Mobile Forensics)"
                  className="h-10 text-xs bg-[#FAF9F6] border-[#E5E5E3] focus-visible:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#111111] mb-1 font-medium">
                  LinkedIn / GitHub / Portfolio URL
                </label>
                <Input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="h-10 text-xs bg-[#FAF9F6] border-[#E5E5E3] focus-visible:ring-black/10"
                />
              </div>
            </div>

            {/* Resume / CV File Attachment */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E5E3] space-y-1.5">
              <label className="block text-xs font-mono text-[#111111] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5 text-[#825816]" />
                  Attach Resume / CV (PDF, DOC, DOCX up to 5MB)
                </span>
                {resumeFileName && (
                  <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                    <Check className="h-3 w-3" /> Ready
                  </span>
                )}
              </label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="h-9 text-xs bg-white border-[#E5E5E3] file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:bg-[#111111] file:text-white cursor-pointer"
              />
              <p className="text-[10px] text-[#71717A] font-mono">
                Your CV is securely linked to your application and forwarded directly to{" "}
                {settings.recipientEmail}.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#111111] mb-1 font-medium">
                Cover Note / Key Casework Experience
              </label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly highlight your forensic suite experience, past investigations, or certifications..."
                className="text-xs bg-[#FAF9F6] border-[#E5E5E3] focus-visible:ring-black/10 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-5 bg-[#111111] hover:bg-black text-white text-xs font-mono uppercase tracking-[0.08em] gap-1.5"
              >
                {isSubmitting ? (
                  "Transmitting Application..."
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit &amp; Email CV</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation & Direct Email Dispatch Helper Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md p-6 bg-white border border-[#E5E5E3] rounded-2xl text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <Check className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <DialogTitle className="font-heading text-xl font-bold text-[#111111]">
              Application Logged Successfully!
            </DialogTitle>
            <DialogDescription className="text-xs text-[#555555]">
              Your dossier has been registered in the VFRA recruitment database and routed to our team.
            </DialogDescription>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E5E3] text-left text-xs space-y-2">
            <span className="font-mono text-[10px] text-[#71717A] uppercase font-bold block">
              DIRECT RECRUITMENT ROUTING
            </span>
            <p className="text-[#333333] leading-relaxed">
              To ensure your application and attached CV are received immediately in our recruitment inbox,
              click below to open your email client:
            </p>

            <a
              href={lastSubmissionMailto}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white text-xs font-mono uppercase tracking-wider"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Open Email App ({settings.recipientEmail})</span>
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyApplicationSummary}
              className="text-xs gap-1.5 flex-1"
            >
              {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isCopied ? "Copied" : "Copy Application Text"}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsSuccessModalOpen(false)}
              className="text-xs px-4"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
