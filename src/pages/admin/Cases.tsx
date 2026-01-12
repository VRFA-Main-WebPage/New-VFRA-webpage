import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, Plus, Search, ArrowLeft, Trash2, Edit, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CaseStatus = "submitted" | "under_review" | "in_progress" | "on_hold" | "resolved" | "closed";

const statusColors: Record<CaseStatus, string> = {
  submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  under_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  on_hold: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  resolved: "bg-green-500/20 text-green-400 border-green-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

const AdminCases = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ status: "", notes: "", assigned_to: "" });

  const { data: cases, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateCaseMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("cases").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({ title: "Case updated successfully" });
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error updating case", description: error.message, variant: "destructive" });
    },
  });

  const deleteCaseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({ title: "Case deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting case", description: error.message, variant: "destructive" });
    },
  });

  const filteredCases = cases?.filter((c) => {
    const matchesSearch =
      c.case_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewCase = (caseItem: any) => {
    setSelectedCase(caseItem);
    setIsViewDialogOpen(true);
  };

  const handleEditCase = (caseItem: any) => {
    setSelectedCase(caseItem);
    setEditForm({
      status: caseItem.status || "",
      notes: caseItem.notes || "",
      assigned_to: caseItem.assigned_to || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCase = () => {
    if (selectedCase) {
      updateCaseMutation.mutate({
        id: selectedCase.id,
        updates: editForm,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Case Management
              </h1>
              <p className="text-sm text-muted-foreground">Track and manage all cases</p>
            </div>
          </div>

          <Link to="/admin/cases/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Case ID, title, or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Cases ({filteredCases?.length || 0})</CardTitle>
            <CardDescription>Manage case status, view details, and track progress</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading cases...</div>
            ) : filteredCases?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No cases found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases?.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell className="font-mono text-primary">{caseItem.case_id}</TableCell>
                        <TableCell className="font-medium">{caseItem.title}</TableCell>
                        <TableCell>{caseItem.client_name}</TableCell>
                        <TableCell className="capitalize">{caseItem.category}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[caseItem.status as CaseStatus] || ""}>
                            {caseItem.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{caseItem.priority}</TableCell>
                        <TableCell>{new Date(caseItem.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewCase(caseItem)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditCase(caseItem)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => deleteCaseMutation.mutate(caseItem.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </main>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
            <DialogDescription>Case ID: {selectedCase?.case_id}</DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-medium">{selectedCase.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={statusColors[selectedCase.status as CaseStatus] || ""}>
                    {selectedCase.status?.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Client Name</Label>
                  <p>{selectedCase.client_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Client Email</Label>
                  <p>{selectedCase.client_email || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="capitalize">{selectedCase.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <p className="capitalize">{selectedCase.priority}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p>{selectedCase.assigned_to || "Unassigned"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p>{new Date(selectedCase.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedCase.description || "No description provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Notes</Label>
                <p className="text-sm">{selectedCase.notes || "No notes"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Case</DialogTitle>
            <DialogDescription>Update status and notes for case {selectedCase?.case_id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assigned To</Label>
              <Input
                value={editForm.assigned_to}
                onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                placeholder="Investigator name"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add investigation notes..."
                rows={4}
              />
            </div>
            <Button onClick={handleUpdateCase} className="w-full" disabled={updateCaseMutation.isPending}>
              {updateCaseMutation.isPending ? "Updating..." : "Update Case"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCases;