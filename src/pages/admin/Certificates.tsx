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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch certificates.",
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete certificate.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Certificates
              </CardTitle>
              <CardDescription>
                Create and manage professional certificates
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/admin/certificates/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12">
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
              <div className="overflow-x-auto">
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
                        <TableCell className="font-mono text-sm">
                          {cert.certificate_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{cert.recipient_name}</p>
                            {cert.recipient_email && (
                              <p className="text-sm text-muted-foreground">
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
                        <TableCell className="max-w-[150px] truncate">
                          {cert.course_name || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[cert.status]}>
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
                              onClick={() => navigate(`/admin/certificates/${cert.id}`)}
                              title="View/Edit"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(cert.id)}
                                title="Delete"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default Certificates;