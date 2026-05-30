import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, ArrowRight, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type CaseStatus = "submitted" | "under_review" | "in_progress" | "on_hold" | "resolved" | "closed";

const statusConfig: Record<CaseStatus, { label: string; color: string; icon: any; description: string }> = {
  submitted: {
    label: "Submitted",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Clock,
    description: "Your case has been received and is awaiting review.",
  },
  under_review: {
    label: "Under Review",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: AlertCircle,
    description: "Our team is currently reviewing your case details.",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: Loader2,
    description: "Active investigation is underway.",
  },
  on_hold: {
    label: "On Hold",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: AlertCircle,
    description: "Case is temporarily paused. We may contact you for additional information.",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle,
    description: "Investigation complete. Final report is being prepared.",
  },
  closed: {
    label: "Closed",
    color: "bg-muted text-muted-foreground border-border",
    icon: CheckCircle,
    description: "Case has been closed.",
  },
};

const statusOrder: CaseStatus[] = ["submitted", "under_review", "in_progress", "resolved", "closed"];

const TrackCase = () => {
  const [caseId, setCaseId] = useState("");
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

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
      <SEO title="Track Case | VFRA" description="Track the status of your ongoing case investigation." />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">Case Tracking</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-glow">
                Track Your Case
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Enter your unique Case ID to check the current status of your investigation.
              </p>
            </motion.div>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Case ID (e.g., FX-20260112-ABC123)"
                      value={caseId}
                      onChange={(e) => setCaseId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="font-mono"
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20">
        <div className="container">
          {caseData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-4">
                      <CardTitle className="text-primary font-mono break-words md:break-normal truncate-on-mobile">{caseData.case_id}</CardTitle>
                      <CardDescription>{caseData.title}</CardDescription>
                    </div>
                    <Badge className={statusConfig[caseData.status as CaseStatus]?.color + " shrink-0"}>
                      {statusConfig[caseData.status as CaseStatus]?.label || caseData.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Status Timeline */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Case Progress</h3>
                    <div className="relative pl-6 md:pl-0">
                      {/* Horizontal Progress Bar (Desktop) */}
                      <div className="hidden md:block absolute top-4 left-4 right-4 h-0.5 bg-border">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{
                            width: `${(getCurrentStep(caseData.status) / (statusOrder.length - 1)) * 100}%`,
                          }}
                        />
                      </div>
                      
                      {/* Vertical Progress Bar (Mobile) */}
                      <div className="md:hidden absolute top-4 bottom-4 left-4 w-0.5 bg-border">
                         <div
                          className="w-full bg-primary transition-all duration-500"
                          style={{
                            height: `${(getCurrentStep(caseData.status) / (statusOrder.length - 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Status Steps */}
                      <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                        {statusOrder.map((status, idx) => {
                          const isActive = getCurrentStep(caseData.status) >= idx;
                          const isCurrent = caseData.status === status;
                          const config = statusConfig[status];
                          const Icon = config.icon;

                          return (
                            <div key={status} className="flex flex-row md:flex-col items-center gap-4 md:gap-0 relative">
                              <div
                                className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center z-10 transition-all ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                } ${isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={`text-xs md:mt-2 text-left md:text-center font-medium ${
                                  isActive ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {config.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status Description */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-foreground">
                      {statusConfig[caseData.status as CaseStatus]?.description}
                    </p>
                  </div>

                  {/* Case Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Category</span>
                      <p className="capitalize font-medium">{caseData.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted On</span>
                      <p className="font-medium">
                        {new Date(caseData.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Updated</span>
                      <p className="font-medium">
                        {new Date(caseData.updated_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Need assistance? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!caseData && !isLoading && !error && (
            <div className="max-w-2xl mx-auto text-center">
              <Card className="glass-card">
                <CardContent className="py-12">
                  <Shield className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Enter Your Case ID</h3>
                  <p className="text-muted-foreground mb-6">
                    Your Case ID was provided when you submitted your case. It follows the format FX-YYYYMMDD-XXXXXX.
                  </p>
                  <Link to="/submit-case">
                    <Button variant="outline" className="gap-2">
                      Submit a New Case
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  </>
  );
};

export default TrackCase;