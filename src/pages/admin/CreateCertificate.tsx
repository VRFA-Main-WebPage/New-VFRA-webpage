import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Award, Download, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  certificateNumber: z.string().min(3, "Certificate number is required"),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientEmail: z.string().email("Valid email required").or(z.literal("")),
  certificateType: z.string().min(1, "Certificate type is required"),
  courseName: z.string().optional(),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional(),
  signingAuthorityName: z.string().min(2, "Signing authority name is required"),
  signingAuthorityDesignation: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const certificateTypes = [
  { value: "completion", label: "Certificate of Completion" },
  { value: "achievement", label: "Certificate of Achievement" },
  { value: "participation", label: "Certificate of Participation" },
  { value: "training", label: "Training Certificate" },
  { value: "internship", label: "Internship Certificate" },
  { value: "excellence", label: "Certificate of Excellence" },
];

const CreateCertificate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateNumber: `CERT-${Date.now().toString(36).toUpperCase()}`,
      recipientName: "",
      recipientEmail: "",
      certificateType: "completion",
      courseName: "",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      signingAuthorityName: "",
      signingAuthorityDesignation: "",
      additionalNotes: "",
    },
  });

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "signature"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(e.target?.result as string);
      } else {
        setSignatureFile(file);
        setSignaturePreview(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (type: "logo" | "signature") => {
    if (type === "logo") {
      setLogoFile(null);
      setLogoPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    } else {
      setSignatureFile(null);
      setSignaturePreview(null);
      if (signatureInputRef.current) signatureInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from("certificate-assets")
      .upload(path, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("certificate-assets")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a certificate.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let logoUrl: string | null = null;
      let signatureUrl: string | null = null;

      // Upload files if selected
      if (logoFile) {
        const logoPath = `${user.id}/logos/${Date.now()}-${logoFile.name}`;
        logoUrl = await uploadFile(logoFile, logoPath);
      }

      if (signatureFile) {
        const signaturePath = `${user.id}/signatures/${Date.now()}-${signatureFile.name}`;
        signatureUrl = await uploadFile(signatureFile, signaturePath);
      }

      const { error } = await supabase.from("certificates").insert({
        certificate_number: data.certificateNumber,
        recipient_name: data.recipientName,
        recipient_email: data.recipientEmail || null,
        certificate_type: data.certificateType,
        course_name: data.courseName || null,
        issue_date: data.issueDate,
        expiry_date: data.expiryDate || null,
        signing_authority_name: data.signingAuthorityName,
        signing_authority_designation: data.signingAuthorityDesignation || null,
        logo_url: logoUrl,
        signature_url: signatureUrl,
        additional_details: data.additionalNotes ? { notes: data.additionalNotes } : {},
        status: "draft",
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Certificate Created",
        description: "Certificate saved successfully.",
      });

      navigate("/admin/certificates");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create certificate.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/certificates")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Certificates
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Create New Certificate
            </CardTitle>
            <CardDescription>
              Fill in the details to generate a professional certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Certificate Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="certificateNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="CERT-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certificateType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {certificateTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Recipient Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Recipient Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="courseName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Course / Program Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Digital Forensics Fundamentals" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Signing Authority */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Signing Authority</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="signingAuthorityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Jane Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="signingAuthorityDesignation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="Director of Training" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Branding Assets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Logo</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="max-h-24 mx-auto object-contain"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0"
                              onClick={() => clearFile("logo")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="flex flex-col items-center justify-center py-4 cursor-pointer"
                            onClick={() => logoInputRef.current?.click()}
                          >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload logo
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG up to 2MB
                            </p>
                          </div>
                        )}
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, "logo")}
                        />
                      </div>
                    </div>

                    {/* Signature Upload */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Signature Image</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        {signaturePreview ? (
                          <div className="relative">
                            <img
                              src={signaturePreview}
                              alt="Signature preview"
                              className="max-h-24 mx-auto object-contain"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0"
                              onClick={() => clearFile("signature")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="flex flex-col items-center justify-center py-4 cursor-pointer"
                            onClick={() => signatureInputRef.current?.click()}
                          >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload signature
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG up to 2MB
                            </p>
                          </div>
                        )}
                        <input
                          ref={signatureInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, "signature")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional details to include..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/certificates")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Award className="h-4 w-4 mr-2" />
                    )}
                    Create Certificate
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCertificate;