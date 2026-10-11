import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Upload,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useWebsiteContent,
  saveWebsiteContent,
  uploadWebsiteAsset,
  defaultEventsExtendedContent,
  EventsExtendedContent,
  PastEventItem,
} from "@/hooks/useWebsiteContent";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  mode: string;
  price: string;
  seats_available: number;
  is_published: boolean;
}

const AdminEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { content: extendedContent, loading: extendedLoading } =
    useWebsiteContent<EventsExtendedContent>(
      "events_extended",
      defaultEventsExtendedContent
    );

  const [extState, setExtState] = useState<EventsExtendedContent>(
    defaultEventsExtendedContent
  );

  useEffect(() => {
    if (!extendedLoading && extendedContent) {
      setExtState({
        mediaByEventId: extendedContent.mediaByEventId || {},
        pastEvents:
          extendedContent.pastEvents || defaultEventsExtendedContent.pastEvents,
      });
    }
  }, [extendedContent, extendedLoading]);

  const [activeTab, setActiveTab] = useState<"scheduled" | "archive">(
    "scheduled"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "workshop",
    event_date: "",
    event_time: "",
    location: "",
    mode: "offline",
    price: "Free",
    seats_available: 50,
    is_published: true,
  });

  const [extraMetaForm, setExtraMetaForm] = useState({
    banner_url: "",
    registration_url: "",
  });

  // Past Archive Modal State
  const [isPastDialogOpen, setIsPastDialogOpen] = useState(false);
  const [editingPastItem, setEditingPastItem] = useState<PastEventItem | null>(
    null
  );
  const [savingPast, setSavingPast] = useState(false);
  const [pastForm, setPastForm] = useState({
    title: "",
    date: new Date().getFullYear().toString(),
    participants: "",
    location: "",
    summary: "",
    banner_url: "",
  });

  const { data: events, isLoading } = useQuery<EventItem[]>({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data as EventItem[];
    },
  });

  const persistExtendedContent = async (next: EventsExtendedContent) => {
    setExtState(next);
    await saveWebsiteContent("events_extended", next, user?.id);
  };

  const createEventMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .insert({
          ...formData,
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;

      if (
        data?.id &&
        (extraMetaForm.banner_url.trim() ||
          extraMetaForm.registration_url.trim())
      ) {
        const nextExt: EventsExtendedContent = {
          ...extState,
          mediaByEventId: {
            ...extState.mediaByEventId,
            [data.id]: {
              banner_url: extraMetaForm.banner_url.trim() || undefined,
              registration_url:
                extraMetaForm.registration_url.trim() || undefined,
            },
          },
        };
        await persistExtendedContent(nextExt);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event created successfully" });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error("Event save error:", error);
      toast({
        title: "Error creating event",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id);
      if (error) throw error;

      const nextExt: EventsExtendedContent = {
        ...extState,
        mediaByEventId: {
          ...extState.mediaByEventId,
          [id]: {
            banner_url: extraMetaForm.banner_url.trim() || undefined,
            registration_url:
              extraMetaForm.registration_url.trim() || undefined,
          },
        },
      };
      await persistExtendedContent(nextExt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event updated successfully" });
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Event update error:", error);
      toast({
        title: "Error updating event",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event deleted successfully" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({
      id,
      is_published,
    }: {
      id: string;
      is_published: boolean;
    }) => {
      const { error } = await supabase
        .from("events")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_type: "workshop",
      event_date: "",
      event_time: "",
      location: "",
      mode: "offline",
      price: "Free",
      seats_available: 50,
      is_published: true,
    });
    setExtraMetaForm({
      banner_url: "",
      registration_url: "",
    });
  };

  const handleEditEvent = (evt: EventItem) => {
    setSelectedEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description || "",
      event_type: evt.event_type,
      event_date: evt.event_date,
      event_time: evt.event_time || "",
      location: evt.location || "",
      mode: evt.mode,
      price: evt.price,
      seats_available: evt.seats_available,
      is_published: evt.is_published,
    });
    const meta = extState.mediaByEventId?.[evt.id] || {};
    setExtraMetaForm({
      banner_url: meta.banner_url || "",
      registration_url: meta.registration_url || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleBannerUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "scheduled" | "past"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingBanner(true);
    const { url, error } = await uploadWebsiteAsset(file, "events");
    setUploadingBanner(false);

    if (error || !url) {
      toast({
        title: "Upload Failed",
        description: error || "Could not upload banner image.",
        variant: "destructive",
      });
      return;
    }

    if (target === "scheduled") {
      setExtraMetaForm((prev) => ({ ...prev, banner_url: url }));
    } else {
      setPastForm((prev) => ({ ...prev, banner_url: url }));
    }
    toast({ title: "Banner Uploaded", description: "Event image is ready." });
  };

  // Past Archive Handlers
  const openCreatePastModal = () => {
    setEditingPastItem(null);
    setPastForm({
      title: "",
      date: new Date().getFullYear().toString(),
      participants: "",
      location: "",
      summary: "",
      banner_url: "",
    });
    setIsPastDialogOpen(true);
  };

  const openEditPastModal = (item: PastEventItem) => {
    setEditingPastItem(item);
    setPastForm({
      title: item.title,
      date: item.date,
      participants: item.participants,
      location: item.location,
      summary: item.summary || "",
      banner_url: item.banner_url || "",
    });
    setIsPastDialogOpen(true);
  };

  const handleSavePastEvent = async () => {
    if (!pastForm.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title for the past event.",
        variant: "destructive",
      });
      return;
    }

    setSavingPast(true);
    let nextPast = [...(extState.pastEvents || [])];

    if (editingPastItem) {
      nextPast = nextPast.map((p) =>
        p.id === editingPastItem.id
          ? {
              ...p,
              title: pastForm.title.trim(),
              date: pastForm.date.trim(),
              participants: pastForm.participants.trim(),
              location: pastForm.location.trim(),
              summary: pastForm.summary.trim() || undefined,
              banner_url: pastForm.banner_url.trim() || undefined,
            }
          : p
      );
    } else {
      nextPast.unshift({
        id: `past-${Date.now()}`,
        title: pastForm.title.trim(),
        date: pastForm.date.trim(),
        participants: pastForm.participants.trim(),
        location: pastForm.location.trim(),
        summary: pastForm.summary.trim() || undefined,
        banner_url: pastForm.banner_url.trim() || undefined,
      });
    }

    const nextExt: EventsExtendedContent = {
      ...extState,
      pastEvents: nextPast,
    };

    const { error } = await saveWebsiteContent(
      "events_extended",
      nextExt,
      user?.id
    );
    setSavingPast(false);

    if (error) {
      toast({
        title: "Save Failed",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setExtState(nextExt);
    setIsPastDialogOpen(false);
    toast({ title: "Archive Updated" });
  };

  const handleDeletePastEvent = async (id: string) => {
    if (!window.confirm("Remove this entry from the Past Archive?")) return;
    const nextExt: EventsExtendedContent = {
      ...extState,
      pastEvents: (extState.pastEvents || []).filter((p) => p.id !== id),
    };
    const { error } = await saveWebsiteContent(
      "events_extended",
      nextExt,
      user?.id
    );
    if (!error) {
      setExtState(nextExt);
      toast({ title: "Archive Entry Removed" });
    }
  };

  const filteredEvents = events?.filter(
    (evt) =>
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground block mb-1">
            PUBLIC MODULE / UPCOMING EVENTS & ARCHIVE
          </span>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Events & Programmes Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage upcoming workshops, event banners, registrations,
            and past programme archives.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" asChild>
            <Link to="/events" target="_blank" className="gap-1.5">
              Public Page
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
          {activeTab === "scheduled" ? (
            <Button
              onClick={() => {
                resetForm();
                setIsCreateDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Upcoming Event
            </Button>
          ) : (
            <Button onClick={openCreatePastModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Archive Record
            </Button>
          )}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-[0.12em] transition-all ${
            activeTab === "scheduled"
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Scheduled & Upcoming Events ({events?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("archive")}
          className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-[0.12em] transition-all ${
            activeTab === "archive"
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Past Programme Archive ({extState.pastEvents?.length || 0})
        </button>
      </div>

      {activeTab === "scheduled" ? (
        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                All Scheduled Events ({filteredEvents?.length || 0})
              </CardTitle>
              <CardDescription>
                Toggle publish status, upload event banners, or inspect
                participant registrations
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title or venue..."
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-muted/50 rounded animate-pulse"
                    />
                  ))}
              </div>
            ) : filteredEvents?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-md border border-dashed border-border">
                No events found. Click "Add Upcoming Event" to schedule one.
              </div>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>Title & Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location / Mode</TableHead>
                      <TableHead>Fee & Seats</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredEvents?.map((evt) => {
                      const banner =
                        extState.mediaByEventId?.[evt.id]?.banner_url;
                      return (
                        <TableRow key={evt.id}>
                          <TableCell>
                            {banner ? (
                              <img
                                src={banner}
                                alt={evt.title}
                                className="w-14 h-10 object-cover rounded border border-border"
                              />
                            ) : (
                              <div className="w-14 h-10 rounded border border-dashed border-border bg-secondary flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="h-4 w-4" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div
                              className="font-medium max-w-[220px] truncate text-foreground"
                              title={evt.title}
                            >
                              {evt.title}
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                              {evt.event_type}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {new Date(evt.event_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            <div>{evt.location || "TBD"}</div>
                            <span className="font-mono text-[10px] uppercase text-muted-foreground">
                              {evt.mode}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <div>{evt.price || "Free"}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {evt.seats_available} seats
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={evt.is_published}
                              onCheckedChange={(checked) =>
                                togglePublishMutation.mutate({
                                  id: evt.id,
                                  is_published: checked,
                                })
                              }
                            />
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  to={`/admin/events/${evt.id}/registrations`}
                                >
                                  Registrations
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditEvent(evt)}
                                title="Edit Event"
                              >
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this event?"
                                    )
                                  ) {
                                    deleteEventMutation.mutate(evt.id);
                                  }
                                }}
                                title="Delete Event"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Past Programme Archive Tab */
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">
              Past Programme Archive ({extState.pastEvents?.length || 0})
            </CardTitle>
            <CardDescription>
              Historical workshops, institutional training sessions, and
              concluded seminars displayed in the Past Archive tab
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-5">
              {(extState.pastEvents || []).map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-xl overflow-hidden bg-card flex flex-col justify-between"
                >
                  <div>
                    {item.banner_url && (
                      <div className="aspect-[16/9] bg-secondary border-b border-border overflow-hidden">
                        <img
                          src={item.banner_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-2">
                        <span>{item.date}</span>
                        <span>{item.participants}</span>
                      </div>
                      <h4 className="font-semibold text-foreground text-base mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.location}
                      </p>
                      {item.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-border bg-secondary/30 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditPastModal(item)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeletePastEvent(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Scheduled Event Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "Edit Event" : "Create New Upcoming Event"}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? "Update event details and banner media"
                : "Schedule a new workshop, training, or seminar on the public calendar"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2 py-2 flex-grow">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Event title"
              />
            </div>

            {/* Event Banner Upload */}
            <div className="space-y-2">
              <Label>Event Banner Image (Optional)</Label>
              {extraMetaForm.banner_url && (
                <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-border bg-secondary">
                  <img
                    src={extraMetaForm.banner_url}
                    alt="Event banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary hover:bg-border/60 text-xs font-medium transition-colors shrink-0">
                  {uploadingBanner ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {uploadingBanner ? "Uploading..." : "Upload Banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBannerUpload(e, "scheduled")}
                    className="hidden"
                    disabled={uploadingBanner}
                  />
                </label>
                <Input
                  value={extraMetaForm.banner_url}
                  onChange={(e) =>
                    setExtraMetaForm({
                      ...extraMetaForm,
                      banner_url: e.target.value,
                    })
                  }
                  placeholder="Or paste image URL..."
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Event description, syllabus highlights, and target audience..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, event_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mode</Label>
                <Select
                  value={formData.mode}
                  onValueChange={(v) => setFormData({ ...formData, mode: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  value={formData.event_time}
                  onChange={(e) =>
                    setFormData({ ...formData, event_time: e.target.value })
                  }
                  placeholder="e.g., 10:00 AM - 5:00 PM"
                />
              </div>
            </div>
            <div>
              <Label>Location / Platform</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Venue in Nagpur or Online platform"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Free or ₹X,XXX"
                />
              </div>
              <div>
                <Label>Seats Available</Label>
                <Input
                  type="number"
                  value={formData.seats_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seats_available: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>External Brochure / Registration Link (Optional)</Label>
              <Input
                value={extraMetaForm.registration_url}
                onChange={(e) =>
                  setExtraMetaForm({
                    ...extraMetaForm,
                    registration_url: e.target.value,
                  })
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch
                id="publish"
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_published: checked })
                }
              />
              <Label htmlFor="publish">Publish immediately on website</Label>
            </div>
            <Button
              onClick={() => {
                if (isEditDialogOpen && selectedEvent) {
                  updateEventMutation.mutate({
                    id: selectedEvent.id,
                    updates: formData,
                  });
                } else {
                  createEventMutation.mutate();
                }
              }}
              className="w-full mt-4"
              disabled={
                !formData.title ||
                !formData.event_date ||
                createEventMutation.isPending ||
                updateEventMutation.isPending
              }
            >
              {createEventMutation.isPending || updateEventMutation.isPending
                ? "Saving..."
                : isEditDialogOpen
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Past Event Archive Dialog */}
      <Dialog open={isPastDialogOpen} onOpenChange={setIsPastDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPastItem
                ? "Edit Past Archive Record"
                : "Add Past Archive Record"}
            </DialogTitle>
            <DialogDescription>
              Record a concluded workshop, seminar, or training programme.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Programme Title *</Label>
              <Input
                value={pastForm.title}
                onChange={(e) =>
                  setPastForm({ ...pastForm, title: e.target.value })
                }
                placeholder="e.g., Dark Web Investigation Workshop"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Year / Date</Label>
                <Input
                  value={pastForm.date}
                  onChange={(e) =>
                    setPastForm({ ...pastForm, date: e.target.value })
                  }
                  placeholder="e.g., 2026"
                />
              </div>
              <div>
                <Label>Participants</Label>
                <Input
                  value={pastForm.participants}
                  onChange={(e) =>
                    setPastForm({ ...pastForm, participants: e.target.value })
                  }
                  placeholder="e.g., 200+ Students"
                />
              </div>
            </div>
            <div>
              <Label>Institution / Location</Label>
              <Input
                value={pastForm.location}
                onChange={(e) =>
                  setPastForm({ ...pastForm, location: e.target.value })
                }
                placeholder="e.g., Ramdeobaba College, Nagpur"
              />
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea
                rows={2}
                value={pastForm.summary}
                onChange={(e) =>
                  setPastForm({ ...pastForm, summary: e.target.value })
                }
                placeholder="Brief highlights of the session..."
              />
            </div>
            <div className="space-y-2">
              <Label>Event Photo (Optional)</Label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary hover:bg-border/60 text-xs font-medium shrink-0">
                  {uploadingBanner ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBannerUpload(e, "past")}
                    className="hidden"
                    disabled={uploadingBanner}
                  />
                </label>
                <Input
                  value={pastForm.banner_url}
                  onChange={(e) =>
                    setPastForm({ ...pastForm, banner_url: e.target.value })
                  }
                  placeholder="Or image URL..."
                  className="text-xs"
                />
              </div>
            </div>
            <Button
              onClick={handleSavePastEvent}
              className="w-full"
              disabled={savingPast}
            >
              {savingPast ? "Saving..." : "Save Archive Record"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;