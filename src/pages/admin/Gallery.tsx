import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
  Save,
  Loader2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useWebsiteContent,
  saveWebsiteContent,
  uploadWebsiteAsset,
  defaultGalleryContent,
  GalleryContent,
  GalleryItem,
  GalleryCategory,
} from "@/hooks/useWebsiteContent";

const CATEGORIES: GalleryCategory[] = [
  "Lab Infrastructure",
  "Workshops & Training",
  "Law Enforcement",
  "Field Research",
  "Conferences",
];

export default function AdminGallery() {
  const { toast } = useToast();
  const { content, loading, refetch } = useWebsiteContent<GalleryContent>(
    "gallery",
    defaultGalleryContent
  );

  const [galleryState, setGalleryState] = useState<GalleryContent>(defaultGalleryContent);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [form, setForm] = useState<{
    title: string;
    caption: string;
    category: GalleryCategory;
    image_url: string;
    date: string;
    location: string;
    code: string;
  }>({
    title: "",
    caption: "",
    category: "Lab Infrastructure",
    image_url: "",
    date: new Date().toISOString().slice(0, 7),
    location: "VFRA Laboratory, Nagpur",
    code: "",
  });

  useEffect(() => {
    if (content) {
      setGalleryState(content);
    }
  }, [content]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadWebsiteAsset(file, "gallery");
    setUploading(false);

    if (error || !url) {
      toast({
        title: "Image upload failed",
        description: error || "Ensure you are signed in with an Admin account.",
        variant: "destructive",
      });
      return;
    }

    setForm((prev) => ({ ...prev, image_url: url }));
    toast({
      title: "Image uploaded",
      description: "Asset uploaded to Supabase website-assets/gallery.",
    });
  };

  const openAddDialog = () => {
    setEditingItem(null);
    const nextNum = (galleryState.items?.length || 0) + 1;
    setForm({
      title: "",
      caption: "",
      category: "Lab Infrastructure",
      image_url: "",
      date: new Date().toISOString().slice(0, 7),
      location: "VFRA Laboratory, Nagpur",
      code: `ARC-${String(nextNum).padStart(2, "0")}`,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      caption: item.caption,
      category: item.category,
      image_url: item.image_url,
      date: item.date,
      location: item.location || "",
      code: item.code || "",
    });
    setDialogOpen(true);
  };

  const persistGallery = async (updated: GalleryContent, successMsg: string) => {
    setSaving(true);
    const res = await saveWebsiteContent("gallery", updated);
    setSaving(false);

    if (!res.success) {
      toast({
        title: "Failed to save gallery",
        description: res.error || "Only authorized administrators can modify gallery records.",
        variant: "destructive",
      });
      return false;
    }

    setGalleryState(updated);
    refetch();
    toast({ title: "Saved", description: successMsg });
    return true;
  };

  const handleSaveItem = async () => {
    if (!form.title.trim() || !form.image_url.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please provide a title and upload or paste an image URL.",
        variant: "destructive",
      });
      return;
    }

    const currentItems = [...(galleryState.items || [])];
    if (editingItem) {
      const idx = currentItems.findIndex((i) => i.id === editingItem.id);
      if (idx !== -1) {
        currentItems[idx] = {
          ...editingItem,
          ...form,
        };
      }
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        ...form,
      };
      currentItems.unshift(newItem);
    }

    const updated: GalleryContent = {
      ...galleryState,
      items: currentItems,
    };

    const ok = await persistGallery(
      updated,
      editingItem ? "Gallery item updated." : "New image added to the forensic gallery."
    );
    if (ok) {
      setDialogOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Remove this image from the public gallery?")) return;
    const updated: GalleryContent = {
      ...galleryState,
      items: (galleryState.items || []).filter((item) => item.id !== id),
    };
    await persistGallery(updated, "Gallery item removed.");
  };

  const handleSaveHeader = async () => {
    await persistGallery(galleryState, "Gallery header updated.");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E3]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555]">
            ADMIN MODULE // FORENSIC GALLERY
          </span>
          <h1 className="font-heading text-2xl font-bold text-[#111111] mt-1">
            Gallery &amp; Media Archive Management
          </h1>
          <p className="text-sm text-[#555555]">
            Upload laboratory photos, training workshops, and institutional media. Protected by Admin RLS.
          </p>
        </div>

        <Button
          onClick={openAddDialog}
          className="bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.1em] h-11 px-5 gap-2"
        >
          <Plus className="h-4 w-4" />
          Upload Gallery Image
        </Button>
      </div>

      {/* Section Header Settings */}
      <div className="premium-card p-6 bg-white">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E5E3]">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
            GALLERY PAGE HEADER COPY
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveHeader}
            disabled={saving}
            className="border-[#111111] text-[#111111] font-mono text-xs uppercase h-9"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Header
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="font-mono text-xs uppercase">Page Heading</Label>
            <Input
              value={galleryState.heading}
              onChange={(e) =>
                setGalleryState({ ...galleryState, heading: e.target.value })
              }
              className="mt-1.5 bg-[#F7F7F5]/50"
            />
          </div>
          <div>
            <Label className="font-mono text-xs uppercase">Page Subheading</Label>
            <Input
              value={galleryState.subheading}
              onChange={(e) =>
                setGalleryState({ ...galleryState, subheading: e.target.value })
              }
              className="mt-1.5 bg-[#F7F7F5]/50"
            />
          </div>
        </div>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
        </div>
      ) : (galleryState.items || []).length === 0 ? (
        <div className="text-center py-16 bg-[#F7F7F5] border border-dashed border-[#D4D4D0] rounded-lg">
          <ImageIcon className="h-10 w-10 text-[#555555] mx-auto mb-3" />
          <p className="text-sm text-[#555555] mb-4">No images in the gallery yet.</p>
          <Button onClick={openAddDialog} className="bg-[#111111] text-white">
            Add First Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(galleryState.items || []).map((item, idx) => (
            <div
              key={item.id}
              className="premium-card overflow-hidden flex flex-col justify-between bg-white"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#F0EFEA] border-b border-[#E5E5E3] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 font-mono text-[10px] uppercase px-2 py-0.5 bg-white/90 border border-[#E5E5E3] text-[#111111]">
                    {item.category}
                  </span>
                  <span className="absolute top-3 right-3 font-mono text-[10px] px-2 py-0.5 bg-[#111111] text-white">
                    {item.code || `ARC-0${idx + 1}`}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-bold text-base text-[#111111] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed mb-4">
                    {item.caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#555555]">
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 text-[#111111]" />
                      {item.location || "VFRA Nagpur"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#111111]" />
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#E5E5E3] bg-[#F7F7F5]/60 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                  className="h-8 text-xs font-mono"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingItem ? "Edit Gallery Record" : "Upload Gallery Record"}
            </DialogTitle>
            <DialogDescription>
              Upload an image to Supabase storage or provide an image URL.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Image Upload Box */}
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase">Image Asset *</Label>
              {form.image_url && (
                <div className="aspect-[16/9] w-full rounded-md overflow-hidden border border-[#E5E5E3] bg-[#F7F7F5] mb-2">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 h-10 rounded-md bg-[#111111] text-white hover:bg-[#2A2A2A] text-xs font-mono uppercase tracking-wider shrink-0">
                  {uploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Upload File
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="Or paste image URL..."
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="font-mono text-xs uppercase">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Mobile Extraction Workstation"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-mono text-xs uppercase">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm({ ...form, category: v as GalleryCategory })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-mono text-xs uppercase">Archive Code</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="ARC-07"
                  className="mt-1 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-mono text-xs uppercase">Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="VFRA Laboratory, Nagpur"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="font-mono text-xs uppercase">Date (YYYY-MM)</Label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="2026-03"
                  className="mt-1 font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="font-mono text-xs uppercase">Technical Caption</Label>
              <Textarea
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Describe the forensic setup, workshop, or activity..."
                rows={3}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleSaveItem}
              disabled={saving || uploading}
              className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-wider"
            >
              {saving ? "Saving to Database..." : editingItem ? "Update Gallery Item" : "Publish to Gallery"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
