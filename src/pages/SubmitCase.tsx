import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Shield, ArrowRight, CheckCircle, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SubmitCase = () => {
  const navigate = useNavigate();
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
        title: "Case submitted successfully!",
        description: "Save your Case ID to track the progress.",
      });
    } catch (err: any) {
      toast({
        title: "Error submitting case",
        description: err.message,
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
      <div className="min-h-screen bg-background flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="glass-card text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Case Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your case has been registered. Please save your Case ID below:
              </p>

              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-xs text-muted-foreground mb-1">Your Case ID</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-bold text-primary">{submittedCaseId}</span>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Use this ID to track your case status anytime. We'll also send updates to your email.
              </p>

              <div className="flex flex-col gap-3">
                <Link to={`/track-case`}>
                  <Button className="w-full gap-2">
                    Track Your Case
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
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
                <span className="text-sm text-primary font-medium">Submit a Case</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-glow">
                Request an Investigation
              </h1>
              <p className="text-lg text-muted-foreground">
                Submit your case details and our team will review it within 24 hours.
                All information is kept strictly confidential.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
                <CardDescription>
                  Provide as much detail as possible to help us understand your case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Case Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Brief description of your case"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your situation in detail. Include relevant dates, people involved, and any evidence you may have..."
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Case Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger id="category">
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

                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold mb-4">Your Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="client_name">Full Name *</Label>
                        <Input
                          id="client_name"
                          value={formData.client_name}
                          onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="client_email">Email Address</Label>
                        <Input
                          id="client_email"
                          type="email"
                          value={formData.client_email}
                          onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="client_phone">Phone Number</Label>
                        <Input
                          id="client_phone"
                          value={formData.client_phone}
                          onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                    <p>
                      <strong>Privacy Notice:</strong> Your information is protected and will only be used
                      for case investigation purposes. We maintain strict confidentiality as per our privacy policy.
                    </p>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Case"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SubmitCase;