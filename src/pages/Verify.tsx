import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle,
  XCircle,
  Award,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const isExpired =
    result?.data?.expiry_date && new Date(result.data.expiry_date) < new Date();

  return (
    <>
      <SEO
        title="Verify Certificate | VFRA"
        description="Verify the authenticity of certificates issued by Vigilant Forensic Research and Analytics Pvt. Ltd."
      />
      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container max-w-2xl text-center">
            <span className="section-eyebrow">CREDENTIAL REGISTRY // VERIFICATION</span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#111111] tracking-[-0.035em] mb-4">
              Certificate Verification.
            </h1>
            <p className="text-base text-[#555555]">
              Confirm the authenticity of training, internship, and workshop credentials issued by VFRA.
            </p>
          </div>
        </section>

        {/* Form & Result */}
        <section className="py-16 md:py-24">
          <div className="container max-w-xl">
            <div className="premium-card p-6 md:p-8 bg-white">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E3]">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#111111] font-semibold">
                  ENTER CREDENTIAL ID
                </span>
                <Award className="h-4 w-4 text-[#111111]" />
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                  <Input
                    placeholder="e.g., CERT-MKBG73BV"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="pl-10 h-12 font-mono uppercase bg-[#F7F7F5]/60 border-[#E5E5E3]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.12em]"
                  disabled={isVerifying}
                >
                  {isVerifying ? "Querying Registry..." : "Verify Credential"}
                </Button>
              </form>
            </div>

            {result && (
              <div className="mt-6 premium-card p-6 md:p-8 bg-[#F7F7F5]/50">
                {result.valid && result.data ? (
                  <div>
                    <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5E5E3]">
                      <div className="flex items-center gap-3">
                        {isExpired ? (
                          <Shield className="h-6 w-6 text-amber-600" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-emerald-700" />
                        )}
                        <div>
                          <h3 className="font-heading text-lg font-bold text-[#111111]">
                            {isExpired ? "Credential Expired" : "Authentic VFRA Credential"}
                          </h3>
                          <p className="font-mono text-xs text-[#555555]">
                            ID: {result.data.certificate_number}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#111111] text-white">
                        {isExpired ? "EXPIRED" : "VALID"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-[#E5E5E3] rounded-md p-5">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] block">
                          Recipient Name
                        </span>
                        <p className="text-sm font-semibold text-[#111111] mt-1">
                          {result.data.recipient_name}
                        </p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] block">
                          Credential Classification
                        </span>
                        <p className="text-sm font-medium text-[#111111] mt-1">
                          {certificateTypeLabels[result.data.certificate_type] ||
                            result.data.certificate_type}
                        </p>
                      </div>
                      {result.data.course_name && (
                        <div className="sm:col-span-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] block">
                            Programme / Workshop
                          </span>
                          <p className="text-sm font-medium text-[#111111] mt-1">
                            {result.data.course_name}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] block">
                          Issue Date
                        </span>
                        <p className="font-mono text-xs text-[#111111] mt-1">
                          {formatDate(result.data.issue_date)}
                        </p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] block">
                          Issuing Authority
                        </span>
                        <p className="text-xs font-medium text-[#111111] mt-1">
                          {result.data.signing_authority_name}
                          {result.data.signing_authority_designation
                            ? ` (${result.data.signing_authority_designation})`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <XCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
                    <h3 className="font-heading text-lg font-bold text-[#111111] mb-1">
                      Record Not Found
                    </h3>
                    <p className="text-sm text-[#555555]">
                      No credential matching that ID was found in the VFRA registry. Please check the characters and try again.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 text-center text-xs text-[#555555] font-mono">
              Need verification assistance?{" "}
              <Link to="/contact" className="text-[#111111] underline">
                Contact Laboratory Registry
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Verify;