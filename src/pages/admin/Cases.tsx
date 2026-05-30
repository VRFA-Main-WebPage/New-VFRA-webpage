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
import { mapErrorToUserMessage } from "@/lib/errorHandler";

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
    onError: (error: unknown) => {
      toast({ title: "Error updating case", description: mapErrorToUserMessage(error, "update case"), variant: "destructive" });
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
    onError: (error: unknown) => {
      toast({ title: "Error deleting case", description: mapErrorToUserMessage(error, "delete case"), variant: "destructive" });
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Case Management</h2>
          <p className="text-muted-foreground">Track and manage all cases.</p>
        </div>
        <Button asChild>
          <Link to="/admin/cases/create">
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
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
              <SelectTrigger className="w-full md:w-[200px]">
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
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredCases?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-md border border-dashed">
              No cases found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases?.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-mono font-medium text-primary">
                        {caseItem.case_id}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate" title={caseItem.title}>
                        {caseItem.title}
                      </TableCell>
                      <TableCell>{caseItem.client_name}</TableCell>
                      <TableCell className="capitalize">{caseItem.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[caseItem.status as CaseStatus] || ""}>
                          {caseItem.status?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(caseItem.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewCase(caseItem)} title="View Case">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditCase(caseItem)} title="Edit Status/Notes">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
                                deleteCaseMutation.mutate(caseItem.id);
                              }
                            }}
                            title="Delete Case"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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