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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Plus, Search, ArrowLeft, Trash2, Edit } from "lucide-react";
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
import { mapErrorToUserMessage } from "@/lib/errorHandler";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

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
    is_published: false,
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

  const createEventMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("events").insert({
        ...formData,
        created_by: user?.id,
      });
      if (error) throw error;
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
      const { error } = await supabase.from("events").update(updates).eq("id", id);
      if (error) throw error;
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
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
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
      is_published: false,
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
    setIsEditDialogOpen(true);
  };

  const filteredEvents = events?.filter(
    (evt) =>
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Event Management</h1>
          <p className="text-muted-foreground">
            Manage website events
          </p>
        </div>

        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events ({filteredEvents?.length || 0})</CardTitle>
          <CardDescription>
            Manage events displayed on the public website
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredEvents?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-md border border-dashed">
              No events found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredEvents?.map((evt) => (
                    <TableRow key={evt.id}>
                      <TableCell className="font-medium max-w-[200px] truncate" title={evt.title}>{evt.title}</TableCell>
                      <TableCell>
                        {new Date(evt.event_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{evt.location || "TBD"}</TableCell>
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
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/events/${evt.id}/registrations`}>
                              View Registrations
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
                              if (window.confirm("Are you sure you want to delete this event?")) {
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? "Update event details" : "Add a new event to the website"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2 py-2 flex-grow">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(v) => setFormData({ ...formData, event_type: v })}
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
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  placeholder="e.g., 10:00 AM - 5:00 PM"
                />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Venue or Online platform"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Free or ₹X,XXX"
                />
              </div>
              <div>
                <Label>Seats Available</Label>
                <Input
                  type="number"
                  value={formData.seats_available}
                  onChange={(e) => setFormData({ ...formData, seats_available: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="publish"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="publish">Publish immediately</Label>
            </div>
            <Button
              onClick={() => {
                if (isEditDialogOpen && selectedEvent) {
                  updateEventMutation.mutate({ id: selectedEvent.id, updates: formData });
                } else {
                  createEventMutation.mutate();
                }
              }}
              className="w-full mt-4"
              disabled={!formData.title || !formData.event_date || createEventMutation.isPending || updateEventMutation.isPending}
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
    </div>
  );
};

export default AdminEvents;