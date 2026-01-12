import { useState, useEffect } from "react";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  saveWebsiteContent, 
  defaultTrustContent,
  TrustContent 
} from "@/hooks/useWebsiteContent";
import { supabase } from "@/integrations/supabase/client";

const iconOptions = [
  "Scale", "Building2", "Briefcase", "GraduationCap", "Shield", "Users", "Award", "Globe"
];

export default function TrustSectionCMS() {
  const { toast } = useToast();
  const [content, setContent] = useState<TrustContent>(defaultTrustContent);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await supabase
        .from("website_content")
        .select("content")
        .eq("section_key", "trust")
        .maybeSingle();

      if (data?.content) {
        setContent({ ...defaultTrustContent, ...(data.content as unknown as TrustContent) });
      }
    } catch (error) {
      console.error("Error fetching trust content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await saveWebsiteContent("trust", content);
    if (result.success) {
      toast({ title: "Success", description: "Trust section saved!" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setSaving(false);
  };

  const updateClientType = (index: number, field: "icon" | "label" | "description", value: string) => {
    const newClientTypes = [...content.clientTypes];
    newClientTypes[index] = { ...newClientTypes[index], [field]: value };
    setContent({ ...content, clientTypes: newClientTypes });
  };

  const addClientType = () => {
    setContent({
      ...content,
      clientTypes: [...content.clientTypes, { icon: "Shield", label: "", description: "" }]
    });
  };

  const removeClientType = (index: number) => {
    setContent({
      ...content,
      clientTypes: content.clientTypes.filter((_, i) => i !== index)
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Trust Section Content</h3>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Badge Text</Label>
            <Input 
              value={content.badge} 
              onChange={e => setContent({...content, badge: e.target.value})} 
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input 
              value={content.heading} 
              onChange={e => setContent({...content, heading: e.target.value})} 
            />
          </div>
          <div>
            <Label>Highlight Word</Label>
            <Input 
              value={content.highlightWord} 
              onChange={e => setContent({...content, highlightWord: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea 
            value={content.description} 
            onChange={e => setContent({...content, description: e.target.value})} 
            rows={3}
          />
        </div>

        <div>
          <Label>Certifications (comma-separated)</Label>
          <Input 
            value={content.certifications.join(", ")} 
            onChange={e => setContent({
              ...content, 
              certifications: e.target.value.split(",").map(s => s.trim()).filter(s => s)
            })} 
            placeholder="ISO 27001 Certified, NABL Accredited Lab, ..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Client Types</Label>
            <Button variant="outline" size="sm" onClick={addClientType}>
              <Plus className="h-4 w-4 mr-1" /> Add Client Type
            </Button>
          </div>
          <div className="space-y-3">
            {content.clientTypes.map((client, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <Select 
                  value={client.icon} 
                  onValueChange={v => updateClientType(index, "icon", v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  value={client.label} 
                  onChange={e => updateClientType(index, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input 
                  value={client.description} 
                  onChange={e => updateClientType(index, "description", e.target.value)}
                  placeholder="Description"
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeClientType(index)}
                  disabled={content.clientTypes.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" /> Save Trust Section
      </Button>
    </div>
  );
}
