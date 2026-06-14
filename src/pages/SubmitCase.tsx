import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Shield, ArrowRight, CheckCircle, Copy, Lock, FileText, User } from "lucide-react";
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
      <SEO title="Register a Case | VFRA" description="Submit a new case for digital forensic investigation." />
      <div className="min-h-screen bg-background flex items-center justify-center py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="premium-card text-center border-primary/20">
            <CardContent className="pt-10 pb-10">
              <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Case Registered Successfully
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Your matter has been logged. Store your Case ID securely — you will need it to track status.
              </p>

              <div className="bg-panel border-2 border-primary/30 rounded-xl p-6 mb-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Your Case ID</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-[24px] md:text-3xl font-bold text-primary tracking-wide">
                    {submittedCaseId}
                  </span>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy Case ID">
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                VFRA will review your submission and respond based on scope, authorization, and engagement terms.
                Submission does not guarantee acceptance or specific outcomes.
              </p>

              <div className="flex flex-col gap-2">
                <Link to="/track-case">
                  <Button className="w-full btn-gold gap-2">
                    Track Your Case
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full btn-outline-gold">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
    );
  }

  return (
    <>
      <SEO title="Register a Case | VFRA" description="Submit a new case for digital forensic investigation." />
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-hero py-10 md:py-20 lg:py-28 relative border-b border-border overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 border border-border bg-card/50 rounded-full px-4 py-1.5 mb-6 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-primary" />
                Secure case intake
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5">
                Register a Case
              </h1>
              <p className="text-lg text-muted-foreground">
                Submit your matter for professional review. All information is handled confidentially under
                our engagement and privacy protocols.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="container max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card className="premium-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                      1
                    </span>
                    <div>
                      <CardTitle className="font-heading flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Case Information
                      </CardTitle>
                      <CardDescription>Describe the matter you need assistance with</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Case Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Brief summary of your matter"
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Include relevant dates, context, and any evidence references..."
                      rows={5}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Case Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger id="category" className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual / Personal</SelectItem>
                        <SelectItem value="corporate">Corporate / Business</SelectItem>
                        <SelectItem value="legal">Legal Matter</SelectItem>
                        <SelectItem value="government">Government / Law Enforcement</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                      2
                    </span>
                    <div>
                      <CardTitle className="font-heading flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Contact Details
                      </CardTitle>
                      <CardDescription>How we may reach you regarding this matter</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="client_name">Full Name *</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client_email">Email</Label>
                      <Input
                        id="client_email"
                        type="email"
                        value={formData.client_email}
                        onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                        placeholder="you@example.com"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_phone">Phone</Label>
                      <Input
                        id="client_phone"
                        value={formData.client_phone}
                        onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                        placeholder="+91"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-xl border border-border bg-panel/50 p-5 text-sm text-muted-foreground space-y-2">
                <p className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Trust & confidentiality:</strong> Information submitted
                    is used solely for case assessment and communication. VFRA does not guarantee specific
                    investigation outcomes.
                  </span>
                </p>
                <p className="text-xs">
                  By submitting, you confirm that you have lawful authority to request assistance for this
                  matter and that information provided is accurate to the best of your knowledge.
                </p>
              </div>

              <Button type="submit" className="w-full btn-gold gap-2 py-6 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Case Securely"}
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
