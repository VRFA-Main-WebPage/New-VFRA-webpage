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
    onError: (error: unknown) => {
      toast({
        title: "Error creating event",
        description: mapErrorToUserMessage(error, "create event"),
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Event Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage website events
              </p>
            </div>
          </div>

          <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Events ({filteredEvents?.length || 0})</CardTitle>
            <CardDescription>
              Manage events displayed on the public website
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
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
                      <TableCell>{evt.title}</TableCell>
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

                          <Link to={`/admin/events/${evt.id}/registrations`}>
                            <Button variant="ghost" size="sm">
                              View Registrations
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEvent(evt)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() =>
                              deleteEventMutation.mutate(evt.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminEvents;