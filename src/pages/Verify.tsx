import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Search, CheckCircle, XCircle, Award, Calendar, User, BookOpen, Hash, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CertificateRecord {
  id: string;
  certificate_number: string;
  recipient_name: string;
  recipient_email: string | null;
  certificate_type: string;
  course_name: string | null;
  issue_date: string;
  expiry_date: string | null;
  signing_authority_name: string;
  signing_authority_designation: string | null;
  status: string;
}

const certificateTypeLabels: Record<string, string> = {
  completion: "Certificate of Completion",
  achievement: "Certificate of Achievement",
  participation: "Certificate of Participation",
  training: "Training Certificate",
  internship: "Internship Certificate",
  excellence: "Certificate of Excellence",
};

const Verify = () => {
  const [certificateId, setCertificateId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; data?: CertificateRecord } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      toast.error("Please enter a certificate ID");
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_number", certificateId.toUpperCase().trim())
        .maybeSingle();

      if (error) {
        console.error("Verification error:", error);
        toast.error("Error verifying certificate");
        setResult({ valid: false });
      } else if (data) {
        setResult({ valid: true, data: data as CertificateRecord });
      } else {
        setResult({ valid: false });
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Error verifying certificate");
      setResult({ valid: false });
    }

    setIsVerifying(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isExpired = result?.data?.expiry_date && new Date(result.data.expiry_date) < new Date();

  return (
    <>
      <SEO title="Verify Certificate | VFRA" description="Verify the authenticity of VFRA certificates." />
      <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-hero border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5">
              Certificate Verification
            </h1>
            <p className="text-lg text-muted-foreground mb-3">
              Verify the authenticity of certificates issued by VFRA.
            </p>
            <p className="text-sm text-muted-foreground/90 italic">
              This page verifies certificates issued by VFRA.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Form */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <Card className="premium-card">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-foreground">Enter Certificate ID</CardTitle>
                <CardDescription className="text-muted-foreground">
                  You can find the Certificate ID on the bottom of your certificate or scan the QR code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g., CERT-MKBG73BV"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="pl-10 uppercase"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-gold" disabled={isVerifying}>
                    {isVerifying ? "Verifying..." : "Verify Certificate"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result */}
            {result && (
              <Card
                className={`mt-6 border-2 premium-card ${
                  result.valid
                    ? isExpired
                      ? "border-warning/50"
                      : "border-success shadow-[0_0_24px_-4px_hsl(var(--success)/0.25)]"
                    : "border-destructive/50"
                }`}
              >
                <CardContent className="pt-6">
                  {result.valid && result.data ? (
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full ${isExpired ? "bg-warning/20" : "bg-success/20"} flex items-center justify-center mx-auto mb-4`}>
                        {isExpired ? (
                          <Shield className="h-8 w-8 text-warning" />
                        ) : (
                          <CheckCircle className="h-8 w-8 text-success" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {isExpired ? "Certificate Expired" : "Certificate Verified"}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {isExpired 
                          ? "This certificate was issued by VFRA but has expired."
                          : "This certificate is valid and was issued by VFRA."
                        }
                      </p>

                      <div className="bg-muted rounded-lg p-4 text-left space-y-4">
                        <div className="flex items-start gap-3">
                          <Hash className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="text-sm text-muted-foreground">Certificate ID</span>
                            <p className="font-mono font-medium text-foreground">{result.data.certificate_number}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="text-sm text-muted-foreground">Issued To</span>
                            <p className="font-medium text-foreground">{result.data.recipient_name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="text-sm text-muted-foreground">Certificate Type</span>
                            <p className="font-medium text-foreground">
                              {certificateTypeLabels[result.data.certificate_type] || result.data.certificate_type}
                            </p>
                          </div>
                        </div>
                        {result.data.course_name && (
                          <div className="flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <span className="text-sm text-muted-foreground">Program / Course</span>
                              <p className="font-medium text-foreground">{result.data.course_name}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="text-sm text-muted-foreground">Issue Date</span>
                            <p className="font-medium text-foreground">{formatDate(result.data.issue_date)}</p>
                          </div>
                        </div>
                        {result.data.expiry_date && (
                          <div className="flex items-start gap-3">
                            <Calendar className={`h-5 w-5 ${isExpired ? "text-destructive" : "text-primary"} mt-0.5`} />
                            <div>
                              <span className="text-sm text-muted-foreground">
                                {isExpired ? "Expired On" : "Valid Until"}
                              </span>
                              <p className={`font-medium ${isExpired ? "text-destructive" : "text-foreground"}`}>
                                {formatDate(result.data.expiry_date)}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">Signed By</span>
                          <p className="font-medium text-foreground">{result.data.signing_authority_name}</p>
                          {result.data.signing_authority_designation && (
                            <p className="text-sm text-muted-foreground">{result.data.signing_authority_designation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                        <XCircle className="h-8 w-8 text-destructive" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Certificate Not Found
                      </h3>
                      <p className="text-muted-foreground">
                        The certificate ID you entered could not be verified. Please check the ID and try again. 
                        If you believe this is an error, please contact us.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Help Text */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Having trouble verifying your certificate?{" "}
                <a href="/contact" className="text-primary hover:underline">
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>
  );
};

export default Verify;