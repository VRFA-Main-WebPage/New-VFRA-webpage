import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  ArrowLeft,
  Trash2,
  Edit,
  Mail,
  Download,
  CheckCircle2,
  Clock,
  User,
  Phone,
  ExternalLink,
  FileText,
  Search,
  Filter,
  Eye,
  Send,
  Save,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCareersData, JobPosting, JobApplication } from "@/hooks/useCareersData";

export default function CareersAdmin() {
  const { toast } = useToast();
  const {
    jobs,
    applications,
    settings,
    saveJob,
    deleteJob,
    toggleJobStatus,
    updateApplicationStatus,
    deleteApplication,
    saveSettings,
  } = useCareersData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"jobs" | "applications" | "settings">("jobs");

  // Job Modal State
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const initialJobForm = {
    title: "",
    department: "Digital Forensics Division",
    location: "Nagpur Laboratory (On-Site)",
    type: "Full-Time",
    experience: "2 – 4 Years",
    salary: "Competitive",
    summary: "",
    responsibilitiesText: "",
    qualificationsText: "",
    skillsText: "",
    isActive: true,
  };

  const [jobForm, setJobForm] = useState(initialJobForm);

  // Application Preview Modal State
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  // Filter States for Applications
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Email Settings Form
  const [recipientEmail, setRecipientEmail] = useState(settings.recipientEmail);
  const [ccEmail, setCcEmail] = useState(settings.ccEmail);

  // Open Create Job Dialog
  const handleOpenCreateJob = () => {
    setEditingJobId(null);
    setJobForm(initialJobForm);
    setIsJobDialogOpen(true);
  };

  // Open Edit Job Dialog
  const handleOpenEditJob = (job: JobPosting) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary || "Competitive",
      summary: job.summary,
      responsibilitiesText: job.responsibilities.join("\n"),
      qualificationsText: job.qualifications.join("\n"),
      skillsText: (job.skills || []).join(", "),
      isActive: job.isActive,
    });
    setIsJobDialogOpen(true);
  };

  // Save Job Submit
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.summary.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide a Job Title and Role Summary.",
        variant: "destructive",
      });
      return;
    }

    const responsibilities = jobForm.responsibilitiesText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const qualifications = jobForm.qualificationsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const skills = jobForm.skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: JobPosting = {
      id: editingJobId || `vfra-job-${Date.now()}`,
      title: jobForm.title.trim(),
      department: jobForm.department.trim(),
      location: jobForm.location.trim(),
      type: jobForm.type.trim(),
      experience: jobForm.experience.trim(),
      salary: jobForm.salary.trim() || undefined,
      summary: jobForm.summary.trim(),
      responsibilities:
        responsibilities.length > 0
          ? responsibilities
          : ["Execute laboratory investigations and evidentiary reporting."],
      qualifications:
        qualifications.length > 0
          ? qualifications
          : ["Relevant qualification in Digital Forensics or Computer Science."],
      skills: skills.length > 0 ? skills : undefined,
      isActive: jobForm.isActive,
      createdAt: new Date().toISOString(),
    };

    const ok = await saveJob(payload);
    if (ok) {
      toast({
        title: editingJobId ? "Job Posting Updated" : "Job Posting Created",
        description: `"${payload.title}" is now saved and ${payload.isActive ? "active" : "drafted"}.`,
      });
      setIsJobDialogOpen(false);
    } else {
      toast({
        title: "Save Failed",
        description: "Could not save job posting. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete Job Handler
  const handleDeleteJob = async (job: JobPosting) => {
    if (confirm(`Are you sure you want to delete the job posting: "${job.title}"?`)) {
      await deleteJob(job.id);
      toast({
        title: "Job Posting Deleted",
        description: `"${job.title}" has been removed.`,
      });
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveSettings({
      recipientEmail: recipientEmail.trim(),
      ccEmail: ccEmail.trim(),
      enableDirectEmail: true,
    });
    if (ok) {
      toast({
        title: "Notification Settings Updated",
        description: `New applications will route to ${recipientEmail}.`,
      });
    }
  };

  // Filtered Applications
  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (jobFilter !== "all" && app.jobId !== jobFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.fullName.toLowerCase().includes(q);
      const matchEmail = app.email.toLowerCase().includes(q);
      const matchJob = app.jobTitle.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchJob) return false;
    }
    return true;
  });

  // Export Applications to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast({
        title: "No Applications to Export",
        description: "Your applications inbox is currently empty.",
      });
      return;
    }

    const headers = ["ID", "Applied Date", "Job Title", "Candidate Name", "Email", "Phone", "Experience", "Status", "LinkedIn/Portfolio", "Cover Note"];
    const rows = applications.map((a) => [
      `"${a.id}"`,
      `"${new Date(a.appliedAt).toLocaleString()}"`,
      `"${a.jobTitle.replace(/"/g, '""')}"`,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.experience || ""}"`,
      `"${a.status}"`,
      `"${a.portfolioUrl || ""}"`,
      `"${(a.coverNote || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vfra_job_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Export Complete",
      description: `Exported ${applications.length} applications to CSV.`,
    });
  };

  // Download CV helper
  const handleDownloadCV = (app: JobApplication) => {
    if (app.resumeDataUrl) {
      const link = document.createElement("a");
      link.href = app.resumeDataUrl;
      link.download = app.resumeFileName || `${app.fullName.replace(/\s+/g, "_")}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        title: "CV Delivered Via Email",
        description: `This candidate's CV was transmitted directly to ${settings.recipientEmail}.`,
      });
    }
  };

  const newAppsCount = applications.filter((a) => a.status === "New").length;
  const activeJobsCount = jobs.filter((j) => j.isActive).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E3]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1 text-xs text-[#555555] hover:text-[#111111]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#D4D4D0]">/</span>
            <span className="text-xs font-mono text-[#825816] font-semibold">
              CAREERS &amp; RECRUITMENT
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">
            Careers &amp; Job Openings Console
          </h1>
          <p className="text-xs sm:text-sm text-[#555555]">
            Publish forensic job descriptions, manage vacancies, and review candidate CV applications directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/careers" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 text-xs h-9">
              <span>View Public Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={handleOpenCreateJob}
            className="gap-2 bg-[#111111] hover:bg-black text-white text-xs h-9 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Job (JD)</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#FAF9F6] border-[#E5E5E3] shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="font-mono text-xs text-[#71717A]">
              ACTIVE JOB POSTINGS
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#111111]">
              {activeJobsCount}{" "}
              <span className="text-xs font-normal text-[#555555]">
                / {jobs.length} total
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[#FAF9F6] border-[#E5E5E3] shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="font-mono text-xs text-[#71717A]">
              TOTAL APPLICATIONS
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#111111]">
              {applications.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[#FAF9F6] border-[#E5E5E3] shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="font-mono text-xs text-[#71717A]">
              NEW / UNREVIEWED
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">
              {newAppsCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[#FAF9F6] border-[#E5E5E3] shadow-2xs">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="font-mono text-xs text-[#71717A]">
              DIRECT RECRUITMENT EMAIL
            </CardDescription>
            <CardTitle className="text-xs font-mono font-semibold text-[#111111] truncate mt-1">
              {settings.recipientEmail}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-[#F4F3EE] p-1 border border-[#EBEAE5] rounded-xl">
          <TabsTrigger value="jobs" className="gap-2 text-xs font-medium">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Manage JDs ({jobs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2 text-xs font-medium relative">
            <FileText className="h-3.5 w-3.5" />
            <span>Applications Inbox ({applications.length})</span>
            {newAppsCount > 0 && (
              <span className="h-4 px-1.5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                {newAppsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 text-xs font-medium">
            <Mail className="h-3.5 w-3.5" />
            <span>Email Routing</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MANAGE JOB POSTINGS (JDs) */}
        <TabsContent value="jobs" className="space-y-4">
          <Card className="border-[#E5E5E3] shadow-2xs bg-white overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-[#EBEAE5] bg-[#FAF9F6] flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-[#111111]">
                  Forensic Job Descriptions &amp; Vacancies
                </CardTitle>
                <CardDescription className="text-xs text-[#555555]">
                  Active jobs appear immediately on the public /careers portal.
                </CardDescription>
              </div>

              <Button
                size="sm"
                onClick={handleOpenCreateJob}
                className="gap-2 bg-[#111111] hover:bg-black text-white text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create JD</span>
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#FAF9F6]">
                  <TableRow>
                    <TableHead className="text-xs font-mono">Job Title &amp; Department</TableHead>
                    <TableHead className="text-xs font-mono">Type &amp; Experience</TableHead>
                    <TableHead className="text-xs font-mono">Location</TableHead>
                    <TableHead className="text-xs font-mono text-center">Status</TableHead>
                    <TableHead className="text-xs font-mono text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-[#555555]">
                        No job postings found. Click &quot;Create JD&quot; to add your first opening.
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-xs sm:text-sm text-[#111111] block">
                              {job.title}
                            </span>
                            <span className="text-[11px] font-mono text-[#825816]">
                              {job.department}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E5E3] font-mono text-[10px]">
                              {job.type}
                            </span>
                            <span className="block text-[#555555] text-[11px]">
                              {job.experience}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-[#555555]">
                          {job.location}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              checked={job.isActive}
                              onCheckedChange={() => toggleJobStatus(job.id)}
                            />
                            <Badge
                              variant="outline"
                              className={
                                job.isActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                                  : "bg-gray-50 text-gray-500 border-gray-200 text-[10px]"
                              }
                            >
                              {job.isActive ? "Active" : "Draft"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditJob(job)}
                              className="h-8 w-8 p-0 text-[#555555] hover:text-[#111111]"
                              title="Edit JD"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJob(job)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete JD"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: APPLICATIONS INBOX */}
        <TabsContent value="applications" className="space-y-4">
          <Card className="border-[#E5E5E3] shadow-2xs bg-white overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-[#EBEAE5] bg-[#FAF9F6]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-[#111111]">
                    Received Candidate Applications
                  </CardTitle>
                  <CardDescription className="text-xs text-[#555555]">
                    All submissions from the public website, including CVs and contact records.
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="gap-2 text-xs h-8"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export to CSV</span>
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-[#888888] absolute left-3 top-2.5" />
                  <Input
                    placeholder="Search candidate name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs bg-white"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Reviewing">Reviewing</SelectItem>
                    <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue placeholder="Filter by Job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Openings</SelectItem>
                    {jobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#FAF9F6]">
                  <TableRow>
                    <TableHead className="text-xs font-mono">Date Applied</TableHead>
                    <TableHead className="text-xs font-mono">Candidate Info</TableHead>
                    <TableHead className="text-xs font-mono">Applied Role</TableHead>
                    <TableHead className="text-xs font-mono">Experience</TableHead>
                    <TableHead className="text-xs font-mono">Status</TableHead>
                    <TableHead className="text-xs font-mono text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-xs text-[#555555]">
                        No applications matched your filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                        <TableCell className="text-[11px] font-mono text-[#71717A] whitespace-nowrap">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-semibold text-xs text-[#111111] block">
                              {app.fullName}
                            </span>
                            <span className="text-[11px] text-[#555555] block">
                              {app.email}
                            </span>
                            {app.phone && (
                              <span className="text-[10px] font-mono text-[#71717A]">
                                {app.phone}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-medium text-[#111111]">
                            {app.jobTitle}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-[#555555]">
                          {app.experience || "—"}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(val: any) => updateApplicationStatus(app.id, val)}
                          >
                            <SelectTrigger className="h-7 text-[11px] w-28 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Reviewing">Reviewing</SelectItem>
                              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedApp(app);
                                setIsAppModalOpen(true);
                              }}
                              className="h-7 px-2.5 text-xs gap-1"
                              title="View Candidate Application"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View CV</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                if (confirm(`Remove application from ${app.fullName}?`)) {
                                  await deleteApplication(app.id);
                                }
                              }}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                              title="Delete Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: EMAIL ROUTING SETTINGS */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-[#E5E5E3] shadow-2xs bg-white max-w-2xl">
            <CardHeader className="p-6 border-b border-[#EBEAE5] bg-[#FAF9F6]">
              <CardTitle className="text-base font-semibold text-[#111111]">
                Application Direct Email Delivery Settings
              </CardTitle>
              <CardDescription className="text-xs text-[#555555]">
                Candidate applications and CV links submitted on the website will be dispatched to these emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase">Primary Recruitment Email *</Label>
                  <Input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="careers@vigilantforensic.com"
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-[#71717A]">
                    Primary inbox where new job applications and candidate notifications will arrive.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase">CC Notification Email</Label>
                  <Input
                    type="email"
                    value={ccEmail}
                    onChange={(e) => setCcEmail(e.target.value)}
                    placeholder="contact@vigilantforensic.com"
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-[#71717A]">
                    Secondary address for lab directorate visibility.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E5E3] text-xs text-[#555555] space-y-1">
                  <span className="font-semibold text-[#111111] block">
                    How Email Delivery Works:
                  </span>
                  <p>
                    1. When a candidate submits an application on <code>/careers</code>, a complete dossier with candidate details and CV is permanently stored in your Admin Inbox.
                  </p>
                  <p>
                    2. An instant transmission trigger generates the formatted email to <code>{recipientEmail}</code> with CC to <code>{ccEmail}</code>.
                  </p>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="gap-2 bg-[#111111] hover:bg-black text-white text-xs h-9">
                    <Save className="h-4 w-4" />
                    <span>Save Email Settings</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: CREATE / EDIT JOB POSTING (JD) */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white border border-[#E5E5E3] rounded-2xl">
          <DialogHeader className="pb-3 border-b border-[#E5E5E3]">
            <DialogTitle className="font-heading text-lg font-bold text-[#111111]">
              {editingJobId ? "Edit Job Description (JD)" : "Create New Job Opening"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#555555]">
              Define the requirements, responsibilities, and qualifications for this forensic role.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveJob} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-mono">Job Title *</Label>
                <Input
                  required
                  placeholder="e.g. Senior Mobile Forensics Examiner"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Department *</Label>
                <Input
                  required
                  placeholder="e.g. Digital Forensics Division"
                  value={jobForm.department}
                  onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-mono">Employment Type</Label>
                <Select
                  value={jobForm.type}
                  onValueChange={(val) => setJobForm({ ...jobForm, type: val })}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Internship / Fellowship">Internship / Fellowship</SelectItem>
                    <SelectItem value="Contract / Consultant">Contract / Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Location</Label>
                <Input
                  placeholder="e.g. Nagpur Lab (On-Site)"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Experience Required</Label>
                <Input
                  placeholder="e.g. 2 – 5 Years"
                  value={jobForm.experience}
                  onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Salary / Compensation (Optional)</Label>
              <Input
                placeholder="e.g. Competitive · Monthly Research Stipend"
                value={jobForm.salary}
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Role Summary *</Label>
              <Textarea
                required
                rows={2}
                placeholder="Brief 1-2 sentence overview of the role and its objective in the laboratory..."
                value={jobForm.summary}
                onChange={(e) => setJobForm({ ...jobForm, summary: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">
                Key Responsibilities (1 item per line) *
              </Label>
              <Textarea
                rows={4}
                placeholder="Enter each core duty on a new line:&#10;• Perform write-blocked physical acquisition of flash drives&#10;• Analyze SQLite databases and recover deleted chat logs&#10;• Prepare Section 65B forensic reports for trial"
                value={jobForm.responsibilitiesText}
                onChange={(e) => setJobForm({ ...jobForm, responsibilitiesText: e.target.value })}
                className="text-xs font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">
                Qualifications &amp; Requirements (1 item per line) *
              </Label>
              <Textarea
                rows={4}
                placeholder="Enter each qualification on a new line:&#10;• B.Sc / M.Sc in Forensic Science or Cyber Security&#10;• Hands-on proficiency with Cellebrite or Oxygen Detective&#10;• Certifications like CHFI / EnCE preferred"
                value={jobForm.qualificationsText}
                onChange={(e) => setJobForm({ ...jobForm, qualificationsText: e.target.value })}
                className="text-xs font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Core Skills Tags (Comma-separated)</Label>
              <Input
                placeholder="Cellebrite, SQLite, X-Ways, Section 65B, Chip-Off"
                value={jobForm.skillsText}
                onChange={(e) => setJobForm({ ...jobForm, skillsText: e.target.value })}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E5E3]">
              <div>
                <Label className="text-xs font-semibold text-[#111111] block">
                  Publish to Website Immediately
                </Label>
                <p className="text-[11px] text-[#555555]">
                  If turned off, the job will be saved as a draft and hidden from public view.
                </p>
              </div>
              <Switch
                checked={jobForm.isActive}
                onCheckedChange={(val) => setJobForm({ ...jobForm, isActive: val })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E5E3]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsJobDialogOpen(false)}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#111111] hover:bg-black text-white text-xs h-9"
              >
                {editingJobId ? "Save Changes" : "Create & Publish Job"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: VIEW CANDIDATE APPLICATION & CV */}
      <Dialog open={isAppModalOpen} onOpenChange={setIsAppModalOpen}>
        <DialogContent className="max-w-xl p-6 bg-white border border-[#E5E5E3] rounded-2xl">
          {selectedApp && (
            <>
              <DialogHeader className="pb-3 border-b border-[#E5E5E3]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-[#825816] uppercase font-bold">
                    CANDIDATE DOSSIER
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Status: {selectedApp.status}
                  </Badge>
                </div>
                <DialogTitle className="font-heading text-xl font-bold text-[#111111]">
                  {selectedApp.fullName}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#555555]">
                  Applied for: <strong>{selectedApp.jobTitle}</strong> on{" "}
                  {new Date(selectedApp.appliedAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E5E3]">
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] block">EMAIL</span>
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="font-medium text-[#111111] hover:underline"
                    >
                      {selectedApp.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] block">PHONE</span>
                    <a
                      href={`tel:${selectedApp.phone}`}
                      className="font-medium text-[#111111] hover:underline"
                    >
                      {selectedApp.phone || "Not provided"}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] block">EXPERIENCE</span>
                    <span className="font-medium text-[#111111]">
                      {selectedApp.experience || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] block">PORTFOLIO</span>
                    {selectedApp.portfolioUrl ? (
                      <a
                        href={selectedApp.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#825816] font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-[#888888]">None</span>
                    )}
                  </div>
                </div>

                {/* Cover Note */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717A] font-semibold block">
                    COVER NOTE / EVIDENTIARY BACKGROUND
                  </span>
                  <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E5E3] text-[#333333] leading-relaxed whitespace-pre-wrap">
                    {selectedApp.coverNote || "No cover note provided by candidate."}
                  </div>
                </div>

                {/* CV Attachment Box */}
                <div className="p-3.5 rounded-xl bg-[#F4F3EE] border border-[#EBEAE5] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-5 w-5 text-[#111111] shrink-0" />
                    <div className="min-w-0">
                      <span className="font-semibold text-[#111111] block truncate text-xs">
                        {selectedApp.resumeFileName || "Candidate_CV.pdf"}
                      </span>
                      <span className="text-[10px] text-[#71717A] block">
                        {selectedApp.resumeDataUrl ? "Uploaded Document Available" : "Transmitted via Direct Email"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleDownloadCV(selectedApp)}
                    className="h-8 px-3 bg-[#111111] hover:bg-black text-white text-xs gap-1.5 shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CV</span>
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E3]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#555555]">Update Status:</span>
                    <Select
                      value={selectedApp.status}
                      onValueChange={(val: any) => {
                        updateApplicationStatus(selectedApp.id, val);
                        setSelectedApp({ ...selectedApp, status: val });
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs w-32 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Reviewing">Reviewing</SelectItem>
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedApp.email}?subject=Regarding%20your%20application%20for%20${encodeURIComponent(selectedApp.jobTitle)}%20at%20VFRA`}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#FAF9F6] border border-[#E5E5E3] text-xs font-medium hover:bg-white transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Email Candidate</span>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
