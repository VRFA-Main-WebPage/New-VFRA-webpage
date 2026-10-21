import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Search,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

type CaseStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "on_hold"
  | "resolved"
  | "closed";

const statusConfig: Record<
  CaseStatus,
  { label: string; badgeClass: string; icon: any; description: string }
> = {
  submitted: {
    label: "Submitted",
    badgeClass: "bg-[#F7F7F5] text-[#111111] border-[#D4D4D0]",
    icon: Clock,
    description: "Your case has been received and logged into the intake queue.",
  },
  under_review: {
    label: "Under Review",
    badgeClass: "bg-[#F7F7F5] text-[#111111] border-[#111111]",
    icon: AlertCircle,
    description: "Our forensic examiners are reviewing the scope and submitted details.",
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-[#111111] text-white border-[#111111]",
    icon: Loader2,
    description: "Active digital forensic investigation and analysis are underway.",
  },
  on_hold: {
    label: "On Hold",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    icon: AlertCircle,
    description: "Investigation is paused pending additional authorization or information.",
  },
  resolved: {
    label: "Resolved",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    icon: CheckCircle,
    description: "Examination complete. Final technical report is ready for release.",
  },
  closed: {
    label: "Closed",
    badgeClass: "bg-[#F0EFEA] text-[#555555] border-[#E5E5E3]",
    icon: CheckCircle,
    description: "Case file has been formally closed and archived.",
  },
};

const statusOrder: CaseStatus[] = [
  "submitted",
  "under_review",
  "in_progress",
  "resolved",
  "closed",
];

const TrackCase = () => {
  const [caseId, setCaseId] = useState("");
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!caseId.trim()) {
      setError("Please enter a Case ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setCaseData(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("cases")
        .select("case_id, title, status, category, created_at, updated_at")
        .eq("case_id", caseId.toUpperCase().trim())
        .single();

      if (fetchError || !data) {
        setError("Case not found. Please check the Case ID and try again.");
        return;
      }

      setCaseData(data);
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStep = (status: CaseStatus) => {
    const idx = statusOrder.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <>
      <SEO
        title="Track Case Status | VFRA"
        description="Track the status of your ongoing digital forensic case investigation."
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container max-w-2xl text-center">
            <span className="section-eyebrow">INVESTIGATION TRACKING // CASE REGISTRY</span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#111111] tracking-[-0.035em] mb-4">
              Track Your Case.
            </h1>
            <p className="text-base text-[#555555] mb-8">
              Enter your unique cryptographic Case ID (`FX-YYYYMMDD-XXXXXX`) to view real-time investigation status.
            </p>

            <div className="premium-card p-4 bg-white max-w-lg mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="FX-20260112-ABC123"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="font-mono uppercase h-11 bg-[#F7F7F5]/60 border-[#E5E5E3]"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="h-11 px-5 bg-[#111111] text-white hover:bg-[#2A2A2A]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {error && <p className="text-red-600 text-xs font-mono mt-2.5 text-left">{error}</p>}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 md:py-24">
          <div className="container">
            {caseData && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <div className="premium-card p-6 md:p-8 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E5E3]">
                    <div>
                      <span className="font-mono text-xs text-[#555555] uppercase tracking-wider block">
                        CASE DOSSIER
                      </span>
                      <h2 className="font-mono text-xl md:text-2xl font-bold text-[#111111] mt-0.5">
                        {caseData.case_id}
                      </h2>
                      <p className="text-sm text-[#555555] mt-1">{caseData.title}</p>
                    </div>
                    <span
                      className={`font-mono text-xs uppercase tracking-widest px-3 py-1 border ${
                        statusConfig[caseData.status as CaseStatus]?.badgeClass || ""
                      }`}
                    >
                      {statusConfig[caseData.status as CaseStatus]?.label || caseData.status}
                    </span>
                  </div>

                  {/* Progress Steps */}
                  <div className="mb-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555] mb-5">
                      WORKFLOW PROGRESSION
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {statusOrder.map((status, idx) => {
                        const isActive = getCurrentStep(caseData.status) >= idx;
                        const isCurrent = caseData.status === status;
                        const config = statusConfig[status];
                        const Icon = config.icon;

                        return (
                          <div
                            key={status}
                            className={`p-3.5 rounded-md border flex md:flex-col items-center md:items-start gap-3 ${
                              isCurrent
                                ? "bg-[#111111] text-white border-[#111111]"
                                : isActive
                                ? "bg-[#F7F7F5] text-[#111111] border-[#D4D4D0]"
                                : "bg-white text-[#71717A] border-[#E5E5E3]"
                            }`}
                          >
                            <div className="flex items-center justify-between w-auto md:w-full">
                              <span className="font-mono text-[10px]">0{idx + 1}</span>
                              <Icon className="h-3.5 w-3.5 hidden md:block" />
                            </div>
                            <span className="font-heading text-xs font-semibold">
                              {config.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 rounded-md bg-[#F7F7F5] border border-[#E5E5E3] mb-6">
                    <p className="text-sm text-[#111111]">
                      {statusConfig[caseData.status as CaseStatus]?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E5E5E3]">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                        Category
                      </span>
                      <p className="capitalize text-sm font-semibold text-[#111111] mt-1">
                        {caseData.category}
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                        Submitted Date
                      </span>
                      <p className="font-mono text-xs text-[#111111] mt-1">
                        {new Date(caseData.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                        Last Updated
                      </span>
                      <p className="font-mono text-xs text-[#111111] mt-1">
                        {new Date(caseData.updated_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!caseData && !isLoading && !error && (
              <div className="max-w-xl mx-auto text-center">
                <div className="premium-card p-8 md:p-10 bg-[#F7F7F5]/60">
                  <Shield className="h-10 w-10 text-[#111111] mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-bold text-[#111111] mb-2">
                    Awaiting Case Identifier
                  </h3>
                  <p className="text-sm text-[#555555] mb-6">
                    Your Case ID is generated automatically upon submitting a case intake request.
                  </p>
                  <Link to="/submit-case">
                    <Button
                      variant="outline"
                      className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-[0.1em] gap-2"
                    >
                      Register a New Case
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default TrackCase;