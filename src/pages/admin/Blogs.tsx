import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Plus, ArrowLeft, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mapErrorToUserMessage } from "@/lib/errorHandler";

const AdminBlogs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    thumbnail_url: "",
    seo_title: "",
    seo_description: "",
    status: "draft"
  };

  const [form, setForm] = useState(initialForm);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      if (editingId) {
        const { error } = await supabase.from("blogs").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blogs").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({ title: editingId ? "Blog updated" : "Blog created" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      toast({ title: "Error saving blog", description: error.message || error.toString(), variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({ title: "Blog deleted" });
    },
    onError: (error: any) => {
      console.error(error);
      toast({ title: "Error deleting blog", description: error.message || error.toString(), variant: "destructive" });
    },
  });

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "",
      author: blog.author || "",
      thumbnail_url: blog.thumbnail_url || "",
      seo_title: blog.seo_title || "",
      seo_description: blog.seo_description || "",
      status: blog.status || "draft"
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.slug || !form.content) {
      toast({ title: "Validation Error", description: "Title, slug, and content are required.", variant: "destructive" });
      return;
    }
    
    // Auto-set published_at when publishing for the first time
    const payload = { ...form } as any;
    if (form.status === 'published' && (!editingId || !blogs?.find(b => b.id === editingId)?.published_at)) {
      payload.published_at = new Date().toISOString();
    }
    
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Blog Management</h2>
          <p className="text-muted-foreground">Manage articles and insights</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts ({blogs?.length || 0})</CardTitle>
          <CardDescription>Create, edit, or delete blog content</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          ) : blogs?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-md border border-dashed">
              No blogs found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs?.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium max-w-[200px] truncate" title={b.title}>{b.title}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={b.slug}>{b.slug}</TableCell>
                      <TableCell>
                        <Badge variant={b.status === "published" ? "default" : "secondary"}>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{b.category || "-"}</TableCell>
                      <TableCell>{new Date(b.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(b)} title="Edit Blog">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              if(confirm("Delete this blog?")) deleteMutation.mutate(b.id);
                            }}
                            title="Delete Blog"
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Article title" />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="e.g. new-cyber-threats" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Investigation" />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="Author name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url: e.target.value})} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Short summary" />
            </div>

            <div className="space-y-2">
              <Label>Content (HTML/Text) *</Label>
              <Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Full article content..." className="min-h-[200px]" />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input value={form.seo_title} onChange={e => setForm({...form, seo_title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Input value={form.seo_description} onChange={e => setForm({...form, seo_description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={handleSave} className="w-full mt-4" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Blog"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogs;
