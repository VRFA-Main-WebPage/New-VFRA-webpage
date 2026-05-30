import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Award, Download, Trash2, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { generateCertificatePDF, downloadCertificatePDF } from "@/lib/generateCertificatePDF";
import { mapErrorToUserMessage } from "@/lib/errorHandler";
interface Certificate {
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
  logo_url: string | null;
  signature_url: string | null;
  status: "draft" | "issued" | "revoked";
  created_at: string;
  additional_details: unknown;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  issued: "bg-green-500/20 text-green-400",
  revoked: "bg-red-500/20 text-red-400",
};

const Certificates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertificates((data || []) as Certificate[]);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: mapErrorToUserMessage(error, "fetch certificates"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCertificates((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Deleted",
        description: "Certificate deleted successfully.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: mapErrorToUserMessage(error, "delete certificate"),
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (cert: Certificate) => {
    try {
      toast({ title: "Generating PDF...", description: "Please wait" });
      
      const additionalDetails = cert.additional_details as { notes?: string } | null;
      
      const doc = await generateCertificatePDF({
        certificateNumber: cert.certificate_number,
        recipientName: cert.recipient_name,
        certificateType: cert.certificate_type,
        courseName: cert.course_name || undefined,
        issueDate: cert.issue_date,
        expiryDate: cert.expiry_date || undefined,
        signingAuthorityName: cert.signing_authority_name,
        signingAuthorityDesignation: cert.signing_authority_designation || undefined,
        logoUrl: cert.logo_url || undefined,
        signatureUrl: cert.signature_url || undefined,
        additionalNotes: additionalDetails?.notes,
      });

      downloadCertificatePDF(doc, `${cert.certificate_number}-${cert.recipient_name.replace(/\s+/g, "_")}.pdf`);
      
      toast({ title: "Success", description: "Certificate downloaded!" });
    } catch (error: unknown) {
      toast({ title: "Error", description: mapErrorToUserMessage(error, "generate PDF"), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Certificates</h2>
          <p className="text-muted-foreground">
            Create and manage professional certificates
          </p>
        </div>
        <Button onClick={() => navigate("/admin/certificates/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Certificates</CardTitle>
          <CardDescription>
            View and manage all generated certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-md border border-dashed">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first certificate to get started.
              </p>
              <Button onClick={() => navigate("/admin/certificates/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Certificate
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate #</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Course/Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono font-medium text-primary text-sm">
                        {cert.certificate_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cert.recipient_name}</p>
                          {cert.recipient_email && (
                            <p className="text-xs text-muted-foreground">
                              {cert.recipient_email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {cert.certificate_type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={cert.course_name || ""}>
                        {cert.course_name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[cert.status]}>
                          {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(cert.issue_date).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(cert)}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/certificates/${cert.id}`)}
                            title="View/Edit"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(cert.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;