import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { Database } from "@/integrations/supabase/types";
import { 
  OfferLetterType, 
  OfferLetterContent, 
  letterTypeLabels, 
  getTemplateFields 
} from "@/lib/offerLetterTemplates";
import { generateOfferLetterPDF, downloadPDF } from "@/lib/generatePDF";

type OfferLetterInsert = Database["public"]["Tables"]["offer_letters"]["Insert"];

const formSchema = z.object({
  letterType: z.enum(["client_proposal", "employment_offer", "partnership_contract"]),
  recipientName: z.string().min(2, "Name is required"),
  recipientEmail: z.string().email("Valid email is required"),
  recipientCompany: z.string().optional(),
  recipientDesignation: z.string().optional(),
  subject: z.string().min(5, "Subject is required"),
  validFrom: z.string(),
  validUntil: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateOfferLetter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<OfferLetterContent>({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      letterType: "client_proposal",
      recipientName: "",
      recipientEmail: "",
      recipientCompany: "",
      recipientDesignation: "",
      subject: "",
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: "",
    },
  });

  const letterType = form.watch("letterType") as OfferLetterType;
  const templateFields = getTemplateFields(letterType);

  const handleContentChange = (key: keyof OfferLetterContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreviewPDF = () => {
    const data = form.getValues();
    const doc = generateOfferLetterPDF(
      data.letterType as OfferLetterType,
      data.recipientName,
      data.recipientCompany || null,
      data.recipientDesignation || null,
      data.subject,
      content,
      data.validFrom,
      data.validUntil || null
    );
    
    // Open in new window
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const onSubmit = async (data: FormData, action: "save" | "download") => {
    setIsLoading(true);

    try {
      // Save to database
      const insertData: OfferLetterInsert = {
        letter_type: data.letterType as Database["public"]["Enums"]["offer_letter_type"],
        recipient_name: data.recipientName,
        recipient_email: data.recipientEmail,
        recipient_company: data.recipientCompany || null,
        recipient_designation: data.recipientDesignation || null,
        subject: data.subject,
        content: content as unknown as Json,
        valid_from: data.validFrom,
        valid_until: data.validUntil || null,
        created_by: user?.id,
        status: "draft" as Database["public"]["Enums"]["offer_letter_status"],
      };

      const { data: savedLetter, error } = await supabase
        .from("offer_letters")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      if (action === "download") {
        const doc = generateOfferLetterPDF(
          data.letterType as OfferLetterType,
          data.recipientName,
          data.recipientCompany || null,
          data.recipientDesignation || null,
          data.subject,
          content,
          data.validFrom,
          data.validUntil || null
        );
        downloadPDF(doc, `offer-letter-${savedLetter.id}.pdf`);
      }

      toast({
        title: "Offer Letter Saved",
        description: action === "download" 
          ? "Letter saved and PDF downloaded successfully." 
          : "Letter saved as draft.",
      });

      navigate("/admin/offer-letters");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save offer letter.",
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
          onClick={() => navigate("/admin/offer-letters")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Offer Letters
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Create New Offer Letter
            </CardTitle>
            <CardDescription>
              Fill in the details to generate a professional offer letter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                {/* Letter Type */}
                <FormField
                  control={form.control}
                  name="letterType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Letter Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select letter type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(letterTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Recipient Details */}
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
                        <FormLabel>Recipient Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company / Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientDesignation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation / Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Managing Director" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input placeholder="Proposal for Forensic Investigation Services" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Validity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="validFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid From *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Until</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dynamic Content Fields */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Letter Content</h3>
                  <div className="space-y-4">
                    {templateFields.map((field) => (
                      <div key={field.key}>
                        <Label htmlFor={field.key}>{field.label}</Label>
                        {field.multiline ? (
                          <Textarea
                            id={field.key}
                            value={content[field.key] || ""}
                            onChange={(e) => handleContentChange(field.key, e.target.value)}
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            rows={4}
                            className="mt-1"
                          />
                        ) : (
                          <Input
                            id={field.key}
                            value={content[field.key] || ""}
                            onChange={(e) => handleContentChange(field.key, e.target.value)}
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviewPDF}
                    disabled={!form.formState.isValid}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Preview PDF
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.handleSubmit((data) => onSubmit(data, "save"))()}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => form.handleSubmit((data) => onSubmit(data, "download"))()}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save & Download PDF
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

export default CreateOfferLetter;
