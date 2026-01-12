import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Edit2, GripVertical, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  saveWebsiteContent, 
  defaultAboutContent,
  AboutContent 
} from "@/hooks/useWebsiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string | null;
  photo_url: string | null;
  is_active: boolean;
  sort_order: number;
}

interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  is_headquarters: boolean;
  is_active: boolean;
  sort_order: number;
}

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_PHOTO_DIMENSION = 800; // 800px

export default function AboutCMS() {
  const { toast } = useToast();
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  // Form states
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingLocation, setEditingLocation] = useState<OfficeLocation | null>(null);

  const [milestoneForm, setMilestoneForm] = useState({ year: "", title: "", description: "", is_active: true });
  const [teamForm, setTeamForm] = useState({ name: "", role: "", credentials: "", photo_url: "", is_active: true });
  const [locationForm, setLocationForm] = useState({ city: "", address: "", is_headquarters: false, is_active: true });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [contentRes, milestonesRes, teamRes, locationsRes] = await Promise.all([
        supabase.from("website_content").select("content").eq("section_key", "about").maybeSingle(),
        supabase.from("milestones").select("*").order("sort_order"),
        supabase.from("team_members").select("*").order("sort_order"),
        supabase.from("office_locations").select("*").order("sort_order"),
      ]);

      if (contentRes.data?.content) {
        setContent({ ...defaultAboutContent, ...(contentRes.data.content as unknown as AboutContent) });
      }
      if (milestonesRes.data) setMilestones(milestonesRes.data);
      if (teamRes.data) setTeamMembers(teamRes.data);
      if (locationsRes.data) setLocations(locationsRes.data);
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    const result = await saveWebsiteContent("about", content);
    if (result.success) {
      toast({ title: "Success", description: "About content saved!" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setSaving(false);
  };

  const validateAndUploadPhoto = async (file: File): Promise<string | null> => {
    // Check file size
    if (file.size > MAX_PHOTO_SIZE) {
      toast({ 
        title: "File too large", 
        description: `Maximum file size is 2MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`, 
        variant: "destructive" 
      });
      return null;
    }

    // Check dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);
        
        if (img.width > MAX_PHOTO_DIMENSION || img.height > MAX_PHOTO_DIMENSION) {
          toast({ 
            title: "Image too large", 
            description: `Maximum dimensions are ${MAX_PHOTO_DIMENSION}x${MAX_PHOTO_DIMENSION}px. Your image is ${img.width}x${img.height}px.`, 
            variant: "destructive" 
          });
          resolve(null);
          return;
        }

        // Upload
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("website-assets")
          .upload(`team/${fileName}`, file);

        if (error) {
          toast({ title: "Upload failed", description: error.message, variant: "destructive" });
          resolve(null);
          return;
        }

        const { data: urlData } = supabase.storage.from("website-assets").getPublicUrl(data.path);
        resolve(urlData.publicUrl);
      };
      img.src = objectUrl;
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await validateAndUploadPhoto(file);
    if (url) {
      setTeamForm(prev => ({ ...prev, photo_url: url }));
    }
  };

  // Milestone CRUD
  const saveMilestone = async () => {
    const data = { ...milestoneForm, sort_order: milestones.length };
    
    if (editingMilestone) {
      await supabase.from("milestones").update(data).eq("id", editingMilestone.id);
    } else {
      await supabase.from("milestones").insert(data);
    }
    
    toast({ title: "Success", description: "Milestone saved!" });
    setMilestoneDialogOpen(false);
    setEditingMilestone(null);
    setMilestoneForm({ year: "", title: "", description: "", is_active: true });
    fetchAllData();
  };

  const deleteMilestone = async (id: string) => {
    if (!confirm("Delete this milestone?")) return;
    await supabase.from("milestones").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchAllData();
  };

  // Team CRUD
  const saveTeamMember = async () => {
    const data = { 
      ...teamForm, 
      credentials: teamForm.credentials || null,
      photo_url: teamForm.photo_url || null,
      sort_order: teamMembers.length 
    };
    
    if (editingTeamMember) {
      await supabase.from("team_members").update(data).eq("id", editingTeamMember.id);
    } else {
      await supabase.from("team_members").insert(data);
    }
    
    toast({ title: "Success", description: "Team member saved!" });
    setTeamDialogOpen(false);
    setEditingTeamMember(null);
    setTeamForm({ name: "", role: "", credentials: "", photo_url: "", is_active: true });
    fetchAllData();
  };

  const deleteTeamMember = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchAllData();
  };

  // Location CRUD
  const saveLocation = async () => {
    const data = { ...locationForm, sort_order: locations.length };
    
    if (editingLocation) {
      await supabase.from("office_locations").update(data).eq("id", editingLocation.id);
    } else {
      await supabase.from("office_locations").insert(data);
    }
    
    toast({ title: "Success", description: "Location saved!" });
    setLocationDialogOpen(false);
    setEditingLocation(null);
    setLocationForm({ city: "", address: "", is_headquarters: false, is_active: true });
    fetchAllData();
  };

  const deleteLocation = async (id: string) => {
    if (!confirm("Delete this location?")) return;
    await supabase.from("office_locations").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchAllData();
  };

  const openEditMilestone = (m: Milestone) => {
    setEditingMilestone(m);
    setMilestoneForm({ year: m.year, title: m.title, description: m.description, is_active: m.is_active ?? true });
    setMilestoneDialogOpen(true);
  };

  const openEditTeamMember = (t: TeamMember) => {
    setEditingTeamMember(t);
    setTeamForm({ 
      name: t.name, 
      role: t.role, 
      credentials: t.credentials || "", 
      photo_url: t.photo_url || "", 
      is_active: t.is_active ?? true 
    });
    setTeamDialogOpen(true);
  };

  const openEditLocation = (l: OfficeLocation) => {
    setEditingLocation(l);
    setLocationForm({ 
      city: l.city, 
      address: l.address, 
      is_headquarters: l.is_headquarters ?? false, 
      is_active: l.is_active ?? true 
    });
    setLocationDialogOpen(true);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">About Page Content</h3>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Main Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div>
            <Label>Hero Title</Label>
            <Input 
              value={content.heroTitle} 
              onChange={e => setContent({...content, heroTitle: e.target.value})} 
            />
          </div>
          <div>
            <Label>Hero Description</Label>
            <Textarea 
              value={content.heroDescription} 
              onChange={e => setContent({...content, heroDescription: e.target.value})} 
              rows={2}
            />
          </div>
          <div>
            <Label>Mission Statement</Label>
            <Textarea 
              value={content.mission} 
              onChange={e => setContent({...content, mission: e.target.value})} 
              rows={3}
            />
          </div>
          <div>
            <Label>Vision Statement</Label>
            <Textarea 
              value={content.vision} 
              onChange={e => setContent({...content, vision: e.target.value})} 
              rows={3}
            />
          </div>
          <div>
            <Label>Lab Equipment (one per line)</Label>
            <Textarea 
              value={content.labEquipment.join("\n")} 
              onChange={e => setContent({
                ...content, 
                labEquipment: e.target.value.split("\n").filter(s => s.trim())
              })} 
              rows={6}
              placeholder="Cellebrite UFED for mobile device extraction&#10;EnCase Forensic workstations&#10;..."
            />
          </div>
          <Button onClick={handleSaveContent} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" /> Save About Content
          </Button>
        </TabsContent>

        {/* Journey/Milestones Tab */}
        <TabsContent value="journey" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Journey Milestones</h4>
            <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setMilestoneForm({ year: "", title: "", description: "", is_active: true }); setEditingMilestone(null); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMilestone ? "Edit Milestone" : "Add New Milestone"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Year *</Label>
                    <Input value={milestoneForm.year} onChange={e => setMilestoneForm({...milestoneForm, year: e.target.value})} placeholder="2020" />
                  </div>
                  <div>
                    <Label>Title *</Label>
                    <Input value={milestoneForm.title} onChange={e => setMilestoneForm({...milestoneForm, title: e.target.value})} />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Textarea value={milestoneForm.description} onChange={e => setMilestoneForm({...milestoneForm, description: e.target.value})} rows={3} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={milestoneForm.is_active} onCheckedChange={v => setMilestoneForm({...milestoneForm, is_active: v})} />
                    <Label>Active</Label>
                  </div>
                  <Button onClick={saveMilestone} className="w-full" disabled={!milestoneForm.year || !milestoneForm.title || !milestoneForm.description}>
                    <Save className="h-4 w-4 mr-2" /> Save Milestone
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {milestones.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No milestones yet.</p>
          ) : (
            <div className="space-y-3">
              {milestones.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary">
                      {m.year}
                    </div>
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-md">{m.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.is_active ? "default" : "secondary"}>{m.is_active ? "Active" : "Hidden"}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEditMilestone(m)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMilestone(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Team Members</h4>
              <p className="text-xs text-muted-foreground">Photos: Max 2MB, 800x800px</p>
            </div>
            <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setTeamForm({ name: "", role: "", credentials: "", photo_url: "", is_active: true }); setEditingTeamMember(null); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTeamMember ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Name *</Label>
                    <Input value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} />
                  </div>
                  <div>
                    <Label>Role *</Label>
                    <Input value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} placeholder="Chief Technology Officer" />
                  </div>
                  <div>
                    <Label>Credentials</Label>
                    <Input value={teamForm.credentials} onChange={e => setTeamForm({...teamForm, credentials: e.target.value})} placeholder="CHFI, EnCE, CFCE" />
                  </div>
                  <div>
                    <Label>Photo (Max 2MB, 800x800px)</Label>
                    <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                    {teamForm.photo_url && <img src={teamForm.photo_url} className="mt-2 h-24 w-24 object-cover rounded-full" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={teamForm.is_active} onCheckedChange={v => setTeamForm({...teamForm, is_active: v})} />
                    <Label>Active</Label>
                  </div>
                  <Button onClick={saveTeamMember} className="w-full" disabled={!teamForm.name || !teamForm.role}>
                    <Save className="h-4 w-4 mr-2" /> Save Team Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {teamMembers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No team members yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {teamMembers.map(t => (
                <div key={t.id} className="p-4 border rounded-lg text-center">
                  {t.photo_url ? (
                    <img src={t.photo_url} className="h-20 w-20 mx-auto mb-2 object-cover rounded-full" />
                  ) : (
                    <div className="h-20 w-20 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                  {t.credentials && <p className="text-xs text-primary">{t.credentials}</p>}
                  <div className="flex justify-center gap-1 mt-2">
                    <Badge variant={t.is_active ? "default" : "secondary"} className="text-xs">{t.is_active ? "Active" : "Hidden"}</Badge>
                  </div>
                  <div className="flex justify-center gap-1 mt-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditTeamMember(t)}><Edit2 className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTeamMember(t.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Office Locations</h4>
            <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setLocationForm({ city: "", address: "", is_headquarters: false, is_active: true }); setEditingLocation(null); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingLocation ? "Edit Location" : "Add New Location"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>City *</Label>
                    <Input value={locationForm.city} onChange={e => setLocationForm({...locationForm, city: e.target.value})} />
                  </div>
                  <div>
                    <Label>Full Address *</Label>
                    <Textarea value={locationForm.address} onChange={e => setLocationForm({...locationForm, address: e.target.value})} rows={2} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={locationForm.is_headquarters} onCheckedChange={v => setLocationForm({...locationForm, is_headquarters: v})} />
                      <Label>Headquarters</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={locationForm.is_active} onCheckedChange={v => setLocationForm({...locationForm, is_active: v})} />
                      <Label>Active</Label>
                    </div>
                  </div>
                  <Button onClick={saveLocation} className="w-full" disabled={!locationForm.city || !locationForm.address}>
                    <Save className="h-4 w-4 mr-2" /> Save Location
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {locations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No locations yet.</p>
          ) : (
            <div className="space-y-3">
              {locations.map(l => (
                <div key={l.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{l.city}</p>
                      {l.is_headquarters && <Badge variant="outline">HQ</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{l.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={l.is_active ? "default" : "secondary"}>{l.is_active ? "Active" : "Hidden"}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEditLocation(l)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteLocation(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
