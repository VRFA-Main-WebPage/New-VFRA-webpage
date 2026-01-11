import { useState } from "react";
import { Search, CheckCircle, XCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VerificationResult {
  valid: boolean;
  data?: {
    name: string;
    event: string;
    date: string;
    certificateId: string;
    role: string;
  };
}

const Verify = () => {
  const [certificateId, setCertificateId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setIsVerifying(true);
    setResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock verification result
    if (certificateId.toUpperCase().startsWith("CERT")) {
      setResult({
        valid: true,
        data: {
          name: "John Doe",
          event: "Mobile Forensics Masterclass",
          date: "January 15, 2024",
          certificateId: certificateId.toUpperCase(),
          role: "Participant",
        },
      });
    } else {
      setResult({ valid: false });
    }

    setIsVerifying(false);
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Certificate Verification
            </h1>
            <p className="text-lg text-primary-foreground/70">
              Verify the authenticity of certificates issued by ForensiX India for 
              training programs, workshops, and courses.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Form */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <Card className="bg-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle>Enter Certificate ID</CardTitle>
                <CardDescription>
                  You can find the Certificate ID on the bottom of your certificate or scan the QR code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g., CERT-2024-001234"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isVerifying}>
                    {isVerifying ? "Verifying..." : "Verify Certificate"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result */}
            {result && (
              <Card className={`mt-6 border-2 ${result.valid ? "border-success" : "border-destructive"}`}>
                <CardContent className="pt-6">
                  {result.valid ? (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Certificate Verified
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        This certificate is valid and was issued by ForensiX India.
                      </p>

                      <div className="bg-muted rounded-lg p-4 text-left space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Certificate ID</span>
                          <p className="font-medium text-foreground">{result.data?.certificateId}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Issued To</span>
                          <p className="font-medium text-foreground">{result.data?.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Event/Program</span>
                          <p className="font-medium text-foreground">{result.data?.event}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Date</span>
                          <p className="font-medium text-foreground">{result.data?.date}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Role</span>
                          <p className="font-medium text-foreground">{result.data?.role}</p>
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
  );
};

export default Verify;
