import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, ArrowRight, CheckCircle, Copy, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SubmitCase = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    category: "individual",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.client_name) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the case title and your name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("cases")
        .insert({
          title: formData.title,
          description: formData.description,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          category: formData.category,
          status: "submitted",
        })
        .select("case_id")
        .single();

      if (error) throw error;

      setSubmittedCaseId(data.case_id);
      toast({
        title: "Case submitted successfully",
        description: "Save your Case ID to track progress.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      toast({
        title: "Error submitting case",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedCaseId) {
      navigator.clipboard.writeText(submittedCaseId);
      toast({ title: "Case ID copied to clipboard" });
    }
  };

  if (submittedCaseId) {
    return (
      <>
        <SEO title="Case Registered | VFRA Nagpur" description="Your case has been registered with VFRA." />
        <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full"
          >
            <div className="premium-card p-8 md:p-10 bg-white text-center">
              <div className="w-12 h-12 rounded-md bg-[#F7F7F5] border border-[#E5E5E3] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-6 w-6 text-emerald-700" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#555555]">
                INTAKE CONFIRMATION
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#111111] mt-1 mb-2">
                Case Logged Successfully
              </h2>
              <p className="text-sm text-[#555555] mb-8">
                Store your unique Case ID securely. You will require this identifier to monitor investigation progress.
              </p>

              <div className="bg-[#F7F7F5] border border-[#111111] rounded-md p-6 mb-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#555555] mb-2">
                  ASSIGNED CASE IDENTIFIER
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-2xl md:text-3xl font-bold text-[#111111] tracking-tight">
                    {submittedCaseId}
                  </span>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy Case ID">
                    <Copy className="h-4 w-4 text-[#111111]" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link to="/">
                  <Button className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.1em] gap-2">
                    Return to Home
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Register a Case | VFRA Nagpur" description="Submit a new case for digital forensic investigation." />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white border border-[#E5E5E3] mb-4">
              <Lock className="h-3.5 w-3.5 text-[#111111]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111111]">
                CONFIDENTIAL CASE INTAKE
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#111111] tracking-[-0.035em] mb-4">
              Register a Case.
            </h1>
            <p className="text-base text-[#555555] leading-relaxed">
              Submit your matter for technical review. All information is handled strictly under chain-of-custody and non-disclosure protocols.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 md:py-24">
          <div className="container max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1 */}
              <div className="premium-card p-6 md:p-8 bg-white">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E3]">
                  <span className="font-mono text-xs font-semibold text-[#111111]">
                    01 // MATTER SPECIFICATION
                  </span>
                  <span className="font-mono text-[10px] text-[#555555] uppercase">REQUIRED</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="title" className="font-mono text-xs uppercase tracking-wider">
                      Case Title / Subject *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Brief summary of the incident or examination needed"
                      required
                      className="mt-2 h-11 bg-[#F7F7F5]/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="font-mono text-xs uppercase tracking-wider">
                      Classification
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger id="category" className="mt-2 h-11 bg-[#F7F7F5]/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual / Personal</SelectItem>
                        <SelectItem value="corporate">Corporate / Enterprise</SelectItem>
                        <SelectItem value="legal">Legal / Advocate Counsel</SelectItem>
                        <SelectItem value="government">Government / Law Enforcement</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-mono text-xs uppercase tracking-wider">
                      Detailed Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Include relevant dates, device types, and context..."
                      rows={5}
                      className="mt-2 bg-[#F7F7F5]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="premium-card p-6 md:p-8 bg-white">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E3]">
                  <span className="font-mono text-xs font-semibold text-[#111111]">
                    02 // POINT OF CONTACT
                  </span>
                  <span className="font-mono text-[10px] text-[#555555] uppercase">CONFIDENTIAL</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="client_name" className="font-mono text-xs uppercase tracking-wider">
                      Full Name *
                    </Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="mt-2 h-11 bg-[#F7F7F5]/50"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client_email" className="font-mono text-xs uppercase tracking-wider">
                        Email Address
                      </Label>
                      <Input
                        id="client_email"
                        type="email"
                        value={formData.client_email}
                        onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                        placeholder="name@example.com"
                        className="mt-2 h-11 bg-[#F7F7F5]/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_phone" className="font-mono text-xs uppercase tracking-wider">
                        Phone Number
                      </Label>
                      <Input
                        id="client_phone"
                        value={formData.client_phone}
                        onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                        placeholder="+91"
                        className="mt-2 h-11 bg-[#F7F7F5]/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-md border border-[#E5E5E3] bg-[#F7F7F5] text-xs text-[#555555] space-y-2">
                <p className="flex items-start gap-2.5 text-[#111111] font-medium">
                  <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Evidentiary &amp; Lawful Authority Declaration</span>
                </p>
                <p className="leading-relaxed">
                  By submitting this intake form, you confirm that you possess lawful authority to request forensic examination for this matter.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.12em] gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating Case ID..." : "Submit Case Intake"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default SubmitCase;
