import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  saveWebsiteContent, 
  defaultServicesSectionContent,
  ServicesSectionContent 
} from "@/hooks/useWebsiteContent";
import { supabase } from "@/integrations/supabase/client";

export default function ServicesSectionCMS() {
  const { toast } = useToast();
  const [content, setContent] = useState<ServicesSectionContent>(defaultServicesSectionContent);
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
        .eq("section_key", "services_section")
        .maybeSingle();

      if (data?.content) {
        setContent({ ...defaultServicesSectionContent, ...(data.content as unknown as ServicesSectionContent) });
      }
    } catch (error) {
      console.error("Error fetching services section content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await saveWebsiteContent("services_section", content);
    if (result.success) {
      toast({ title: "Success", description: "Services section heading saved!" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Services Section Heading</h3>
      <p className="text-sm text-muted-foreground">
        Edit the heading and description that appears above the services list. 
        Individual services are managed in the "Services" tab.
      </p>
      
      <div className="grid gap-4">
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
          <Label>Description</Label>
          <Textarea 
            value={content.description} 
            onChange={e => setContent({...content, description: e.target.value})} 
            rows={3}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" /> Save Services Section Heading
      </Button>
    </div>
  );
}
