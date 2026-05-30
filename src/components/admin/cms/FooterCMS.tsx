import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  saveWebsiteContent, 
  defaultFooterContent,
  defaultContactContent,
  FooterContent,
  ContactContent 
} from "@/hooks/useWebsiteContent";
import { supabase } from "@/integrations/supabase/client";

export default function FooterCMS() {
  const { toast } = useToast();
  const [footerContent, setFooterContent] = useState<FooterContent>(defaultFooterContent);
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContactContent);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await supabase
        .from("website_content")
        .select("*");

      if (data) {
        data.forEach((item) => {
          if (item.section_key === "footer" && item.content) {
            setFooterContent({ ...defaultFooterContent, ...(item.content as unknown as FooterContent) });
          } else if (item.section_key === "contact" && item.content) {
            setContactContent({ ...defaultContactContent, ...(item.content as unknown as ContactContent) });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching footer content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    const [footerResult, contactResult] = await Promise.all([
      saveWebsiteContent("footer", footerContent),
      saveWebsiteContent("contact", contactContent)
    ]);

    if (footerResult.success && contactResult.success) {
      toast({ title: "Success", description: "Footer & Contact info saved!" });
    } else {
      toast({ title: "Error", description: footerResult.error || contactResult.error, variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Footer & Contact Content</h3>
      
      <div className="grid gap-6">
        {/* Contact Information */}
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input 
                value={contactContent.phone} 
                onChange={e => setContactContent({...contactContent, phone: e.target.value})} 
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={contactContent.email} 
                onChange={e => setContactContent({...contactContent, email: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Address Line 1</Label>
              <Input 
                value={contactContent.address} 
                onChange={e => setContactContent({...contactContent, address: e.target.value})} 
              />
            </div>
            <div>
              <Label>Address Line 2</Label>
              <Input 
                value={contactContent.addressLine2} 
                onChange={e => setContactContent({...contactContent, addressLine2: e.target.value})} 
              />
            </div>
            <div>
              <Label>Address Line 3</Label>
              <Input 
                value={contactContent.addressLine3} 
                onChange={e => setContactContent({...contactContent, addressLine3: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <Label>Working Hours</Label>
            <Input 
              value={contactContent.workingHours} 
              onChange={e => setContactContent({...contactContent, workingHours: e.target.value})} 
            />
          </div>
        </div>

        {/* Footer Content */}
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Footer Content</h4>
          <div>
            <Label>Tagline</Label>
            <Textarea 
              value={footerContent.tagline} 
              onChange={e => setFooterContent({...footerContent, tagline: e.target.value})} 
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>GSTIN</Label>
              <Input 
                value={footerContent.gstin} 
                onChange={e => setFooterContent({...footerContent, gstin: e.target.value})} 
              />
            </div>
            <div>
              <Label>CIN</Label>
              <Input 
                value={footerContent.cin} 
                onChange={e => setFooterContent({...footerContent, cin: e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Social Links</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>LinkedIn URL</Label>
              <Input 
                value={footerContent.linkedin} 
                onChange={e => setFooterContent({...footerContent, linkedin: e.target.value})} 
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <Label>Twitter URL</Label>
              <Input 
                value={footerContent.twitter} 
                onChange={e => setFooterContent({...footerContent, twitter: e.target.value})} 
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <Input 
                value={footerContent.github} 
                onChange={e => setFooterContent({...footerContent, github: e.target.value})} 
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" /> Save Footer & Contact
      </Button>
    </div>
  );
}
