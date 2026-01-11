import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, FileText, Download, Send, Trash2, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { letterTypeLabels, OfferLetterType, OfferLetterContent } from "@/lib/offerLetterTemplates";
import { generateOfferLetterPDF, downloadPDF } from "@/lib/generatePDF";

interface OfferLetter {
  id: string;
  letter_type: OfferLetterType;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  recipient_name: string;
  recipient_email: string;
  recipient_company: string | null;
  recipient_designation: string | null;
  subject: string;
  content: OfferLetterContent;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  sent_at: string | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/20 text-blue-400",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-red-500/20 text-red-400",
  expired: "bg-yellow-500/20 text-yellow-400",
};

const OfferLetters = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [letters, setLetters] = useState<OfferLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const { data, error } = await supabase
        .from("offer_letters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Type assertion for the data
      const typedData = (data || []).map(letter => ({
        ...letter,
        letter_type: letter.letter_type as OfferLetterType,
        status: letter.status as OfferLetter["status"],
        content: letter.content as OfferLetterContent,
      }));
      
      setLetters(typedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch offer letters.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (letter: OfferLetter) => {
    const doc = generateOfferLetterPDF(
      letter.letter_type,
      letter.recipient_name,
      letter.recipient_company,
      letter.recipient_designation,
      letter.subject,
      letter.content,
      letter.valid_from,
      letter.valid_until
    );
    downloadPDF(doc, `offer-letter-${letter.id}.pdf`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer letter?")) return;

    try {
      const { error } = await supabase
        .from("offer_letters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLetters((prev) => prev.filter((l) => l.id !== id));
      toast({
        title: "Deleted",
        description: "Offer letter deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer letter.",
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
                <FileText className="h-6 w-6 text-primary" />
                Offer Letters
              </CardTitle>
              <CardDescription>
                Manage and generate professional offer letters
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/admin/offer-letters/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : letters.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Offer Letters Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first offer letter to get started.
                </p>
                <Button onClick={() => navigate("/admin/offer-letters/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offer Letter
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {letters.map((letter) => (
                      <TableRow key={letter.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {letterTypeLabels[letter.letter_type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{letter.recipient_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {letter.recipient_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {letter.subject}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[letter.status]}>
                            {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(letter.created_at).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(letter)}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(letter.id)}
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

export default OfferLetters;
