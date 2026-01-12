import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, Image, Plus, Trash2, GripVertical, Home, Phone, Briefcase, FileText, Users, Handshake, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  saveWebsiteContent, 
  defaultHeroContent, 
  defaultCTAContent, 
  defaultCaseSectionContent,
  HeroContent,
  CTAContent,
  CaseSectionContent
} from "@/hooks/useWebsiteContent";
import { Json } from "@/integrations/supabase/types";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string | null;
  features: string[];
  href: string | null;
  is_active: boolean;
  sort_order: number;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  organization: string | null;
  rating: number;
  is_active: boolean;
  sort_order: number;
}

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  sort_order: number;
}

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  outcome: string | null;
  impact: string | null;
  services: string[];
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

const iconOptions = [
  "Shield", "Smartphone", "Monitor", "Cloud", "Network", "Search",
  "ShieldAlert", "FileText", "GraduationCap", "HardDrive", "Lock", "Eye"
];

const categoryOptions = [
  "Corporate", "Banking", "Government", "Legal", "Healthcare", "Technology"
];

export default function ContentManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Page content states
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [ctaContent, setCTAContent] = useState<CTAContent>(defaultCTAContent);
  const [caseSectionContent, setCaseSectionContent] = useState<CaseSectionContent>(defaultCaseSectionContent);
  const [savingContent, setSavingContent] = useState(false);
  
  // Dialog states
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [caseStudyDialogOpen, setCaseStudyDialogOpen] = useState(false);
  
  // Edit states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);

  // Form states
  const [serviceForm, setServiceForm] = useState({
    title: "", description: "", icon: "Shield", image_url: "", features: "", href: "", is_active: true
  });
  const [testimonialForm, setTestimonialForm] = useState({
    quote: "", author: "", organization: "", rating: 5, is_active: true
  });
  const [partnerForm, setPartnerForm] = useState({
    name: "", logo_url: "", website_url: "", is_active: true
  });
  const [caseStudyForm, setCaseStudyForm] = useState({
    title: "", client: "", category: "Corporate", description: "", outcome: "", impact: "", services: "", image_url: "", is_active: true, is_featured: false
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [servicesRes, testimonialsRes, partnersRes, caseStudiesRes, contentRes] = await Promise.all([
        supabase.from("services").select("*").order("sort_order"),
        supabase.from("testimonials").select("*").order("sort_order"),
        supabase.from("partners").select("*").order("sort_order"),
        supabase.from("case_studies").select("*").order("sort_order"),
        supabase.from("website_content").select("*"),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (partnersRes.data) setPartners(partnersRes.data);
      if (caseStudiesRes.data) setCaseStudies(caseStudiesRes.data);
      
      // Load page content
      if (contentRes.data) {
        contentRes.data.forEach((item) => {
          if (item.section_key === "hero" && item.content) {
            setHeroContent({ ...defaultHeroContent, ...(item.content as unknown as HeroContent) });
          } else if (item.section_key === "cta" && item.content) {
            setCTAContent({ ...defaultCTAContent, ...(item.content as unknown as CTAContent) });
          } else if (item.section_key === "case_section" && item.content) {
            setCaseSectionContent({ ...defaultCaseSectionContent, ...(item.content as unknown as CaseSectionContent) });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("website-assets")
      .upload(`${folder}/${fileName}`, file);

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }

    const { data: urlData } = supabase.storage.from("website-assets").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setForm: React.Dispatch<React.SetStateAction<any>>,
    field: string,
    folder: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, folder);
    if (url) {
      setForm((prev: any) => ({ ...prev, [field]: url }));
    }
  };

  // Save page content
  const handleSaveHero = async () => {
    setSavingContent(true);
    const result = await saveWebsiteContent("hero", heroContent);
    if (result.success) {
      toast({ title: "Success", description: "Hero section saved!" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setSavingContent(false);
  };

  const handleSaveCTA = async () => {
    setSavingContent(true);
    const result = await saveWebsiteContent("cta", ctaContent);
    if (result.success) {
      toast({ title: "Success", description: "CTA section saved!" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setSavingContent(false);
  };

  const handleSaveCaseSection = async () => {
    setSavingContent(true);
    const result = await saveWebsiteContent("case_section", caseSectionContent);
    if (result.success) {
      toast({ title: "Success", description: "Case section saved!" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setSavingContent(false);
  };

  // Service CRUD
  const saveService = async () => {
    const serviceData = {
      title: serviceForm.title,
      description: serviceForm.description,
      icon: serviceForm.icon,
      image_url: serviceForm.image_url || null,
      features: serviceForm.features.split("\n").filter(f => f.trim()),
      href: serviceForm.href || null,
      is_active: serviceForm.is_active,
      sort_order: services.length,
    };

    if (editingService) {
      const { error } = await supabase.from("services").update(serviceData).eq("id", editingService.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("services").insert(serviceData);
      if (error) throw error;
    }

    toast({ title: "Success", description: "Service saved successfully" });
    setServiceDialogOpen(false);
    setEditingService(null);
    resetServiceForm();
    fetchAllData();
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Service deleted successfully" });
      fetchAllData();
    }
  };

  const resetServiceForm = () => {
    setServiceForm({ title: "", description: "", icon: "Shield", image_url: "", features: "", href: "", is_active: true });
  };

  // Testimonial CRUD
  const saveTestimonial = async () => {
    const data = {
      quote: testimonialForm.quote,
      author: testimonialForm.author,
      organization: testimonialForm.organization || null,
      rating: testimonialForm.rating,
      is_active: testimonialForm.is_active,
      sort_order: testimonials.length,
    };

    if (editingTestimonial) {
      const { error } = await supabase.from("testimonials").update(data).eq("id", editingTestimonial.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("testimonials").insert(data);
      if (error) throw error;
    }

    toast({ title: "Success", description: "Testimonial saved successfully" });
    setTestimonialDialogOpen(false);
    setEditingTestimonial(null);
    setTestimonialForm({ quote: "", author: "", organization: "", rating: 5, is_active: true });
    fetchAllData();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchAllData();
  };

  // Partner CRUD
  const savePartner = async () => {
    const data = {
      name: partnerForm.name,
      logo_url: partnerForm.logo_url || null,
      website_url: partnerForm.website_url || null,
      is_active: partnerForm.is_active,
      sort_order: partners.length,
    };

    if (editingPartner) {
      await supabase.from("partners").update(data).eq("id", editingPartner.id);
    } else {
      await supabase.from("partners").insert(data);
    }

    toast({ title: "Success", description: "Partner saved successfully" });
    setPartnerDialogOpen(false);
    setEditingPartner(null);
    setPartnerForm({ name: "", logo_url: "", website_url: "", is_active: true });
    fetchAllData();
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    await supabase.from("partners").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchAllData();
  };

  // Case Study CRUD
  const saveCaseStudy = async () => {
    const data = {
      title: caseStudyForm.title,
      client: caseStudyForm.client,
      category: caseStudyForm.category,
      description: caseStudyForm.description,
      outcome: caseStudyForm.outcome || null,
      impact: caseStudyForm.impact || null,
      services: caseStudyForm.services.split(",").map(s => s.trim()).filter(s => s),
      image_url: caseStudyForm.image_url || null,
      is_active: caseStudyForm.is_active,
      is_featured: caseStudyForm.is_featured,
      sort_order: caseStudies.length,
    };

    if (editingCaseStudy) {
      await supabase.from("case_studies").update(data).eq("id", editingCaseStudy.id);
    } else {
      await supabase.from("case_studies").insert(data);
    }

    toast({ title: "Success", description: "Case study saved successfully" });
    setCaseStudyDialogOpen(false);
    setEditingCaseStudy(null);
    setCaseStudyForm({ title: "", client: "", category: "Corporate", description: "", outcome: "", impact: "", services: "", image_url: "", is_active: true, is_featured: false });
    fetchAllData();
  };

  const deleteCaseStudy = async (id: string) => {
    if (!confirm("Delete this case study?")) return;
    await supabase.from("case_studies").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchAllData();
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      icon: service.icon || "Shield",
      image_url: service.image_url || "",
      features: (service.features || []).join("\n"),
      href: service.href || "",
      is_active: service.is_active ?? true,
    });
    setServiceDialogOpen(true);
  };

  const openEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      quote: t.quote,
      author: t.author,
      organization: t.organization || "",
      rating: t.rating ?? 5,
      is_active: t.is_active ?? true,
    });
    setTestimonialDialogOpen(true);
  };

  const openEditPartner = (p: Partner) => {
    setEditingPartner(p);
    setPartnerForm({
      name: p.name,
      logo_url: p.logo_url || "",
      website_url: p.website_url || "",
      is_active: p.is_active ?? true,
    });
    setPartnerDialogOpen(true);
  };

  const openEditCaseStudy = (c: CaseStudy) => {
    setEditingCaseStudy(c);
    setCaseStudyForm({
      title: c.title,
      client: c.client,
      category: c.category,
      description: c.description,
      outcome: c.outcome || "",
      impact: c.impact || "",
      services: (c.services || []).join(", "),
      image_url: c.image_url || "",
      is_active: c.is_active ?? true,
      is_featured: c.is_featured ?? false,
    });
    setCaseStudyDialogOpen(true);
  };

  // Update hero stat
  const updateHeroStat = (index: number, field: "value" | "label", value: string) => {
    const newStats = [...heroContent.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setHeroContent({ ...heroContent, stats: newStats });
  };

  // Update case section step
  const updateCaseStep = (index: number, field: "title" | "description", value: string) => {
    const newSteps = [...caseSectionContent.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setCaseSectionContent({ ...caseSectionContent, steps: newSteps });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Website Content Management</CardTitle>
            <CardDescription>Manage all website content including page sections, services, testimonials, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="hero">
              <TabsList className="grid w-full grid-cols-7 mb-4">
                <TabsTrigger value="hero" className="flex items-center gap-1 text-xs">
                  <Home className="h-3 w-3" />
                  Hero
                </TabsTrigger>
                <TabsTrigger value="cta" className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3" />
                  CTA
                </TabsTrigger>
                <TabsTrigger value="case" className="flex items-center gap-1 text-xs">
                  <FileText className="h-3 w-3" />
                  Case
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-1 text-xs">
                  <Briefcase className="h-3 w-3" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="partners" className="flex items-center gap-1 text-xs">
                  <Handshake className="h-3 w-3" />
                  Partners
                </TabsTrigger>
                <TabsTrigger value="casestudies" className="flex items-center gap-1 text-xs">
                  <BookOpen className="h-3 w-3" />
                  Studies
                </TabsTrigger>
              </TabsList>

              {/* Hero Section Tab */}
              <TabsContent value="hero" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Hero Section Content</h3>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label>Company Full Name</Label>
                      <Input 
                        value={heroContent.companyFullName} 
                        onChange={e => setHeroContent({...heroContent, companyFullName: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Label>Badge Text</Label>
                      <Input 
                        value={heroContent.badge} 
                        onChange={e => setHeroContent({...heroContent, badge: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Heading Line 1</Label>
                        <Input 
                          value={heroContent.headingLine1} 
                          onChange={e => setHeroContent({...heroContent, headingLine1: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Heading Line 2 (Highlighted)</Label>
                        <Input 
                          value={heroContent.headingLine2} 
                          onChange={e => setHeroContent({...heroContent, headingLine2: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        value={heroContent.description} 
                        onChange={e => setHeroContent({...heroContent, description: e.target.value})} 
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Primary Button Text</Label>
                        <Input 
                          value={heroContent.primaryButtonText} 
                          onChange={e => setHeroContent({...heroContent, primaryButtonText: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Secondary Button Text</Label>
                        <Input 
                          value={heroContent.secondaryButtonText} 
                          onChange={e => setHeroContent({...heroContent, secondaryButtonText: e.target.value})} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Statistics</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {heroContent.stats.map((stat, index) => (
                          <div key={index} className="space-y-2 p-3 border rounded-lg">
                            <Input 
                              value={stat.value} 
                              onChange={e => updateHeroStat(index, "value", e.target.value)}
                              placeholder="Value (e.g., 500+)"
                            />
                            <Input 
                              value={stat.label} 
                              onChange={e => updateHeroStat(index, "label", e.target.value)}
                              placeholder="Label"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveHero} disabled={savingContent} className="w-full">
                    <Save className="h-4 w-4 mr-2" /> Save Hero Section
                  </Button>
                </div>
              </TabsContent>

              {/* CTA Section Tab */}
              <TabsContent value="cta" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Call-to-Action Section Content</h3>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label>Badge Text</Label>
                      <Input 
                        value={ctaContent.badge} 
                        onChange={e => setCTAContent({...ctaContent, badge: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Heading</Label>
                        <Input 
                          value={ctaContent.heading} 
                          onChange={e => setCTAContent({...ctaContent, heading: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Highlight Word</Label>
                        <Input 
                          value={ctaContent.highlightWord} 
                          onChange={e => setCTAContent({...ctaContent, highlightWord: e.target.value})} 
                          placeholder="Word to highlight from heading"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        value={ctaContent.description} 
                        onChange={e => setCTAContent({...ctaContent, description: e.target.value})} 
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Primary Button Text</Label>
                      <Input 
                        value={ctaContent.primaryButtonText} 
                        onChange={e => setCTAContent({...ctaContent, primaryButtonText: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Phone Number</Label>
                        <Input 
                          value={ctaContent.phoneNumber} 
                          onChange={e => setCTAContent({...ctaContent, phoneNumber: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Emergency Phone</Label>
                        <Input 
                          value={ctaContent.emergencyPhone} 
                          onChange={e => setCTAContent({...ctaContent, emergencyPhone: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Emergency Email</Label>
                        <Input 
                          value={ctaContent.emergencyEmail} 
                          onChange={e => setCTAContent({...ctaContent, emergencyEmail: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveCTA} disabled={savingContent} className="w-full">
                    <Save className="h-4 w-4 mr-2" /> Save CTA Section
                  </Button>
                </div>
              </TabsContent>

              {/* Case Section Tab */}
              <TabsContent value="case" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Case Submission Section Content</h3>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label>Badge Text</Label>
                      <Input 
                        value={caseSectionContent.badge} 
                        onChange={e => setCaseSectionContent({...caseSectionContent, badge: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Heading</Label>
                        <Input 
                          value={caseSectionContent.heading} 
                          onChange={e => setCaseSectionContent({...caseSectionContent, heading: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Highlight Word</Label>
                        <Input 
                          value={caseSectionContent.highlightWord} 
                          onChange={e => setCaseSectionContent({...caseSectionContent, highlightWord: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        value={caseSectionContent.description} 
                        onChange={e => setCaseSectionContent({...caseSectionContent, description: e.target.value})} 
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Process Steps</Label>
                      <div className="space-y-4">
                        {caseSectionContent.steps.map((step, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-primary font-bold">Step {index + 1}</span>
                            </div>
                            <Input 
                              value={step.title} 
                              onChange={e => updateCaseStep(index, "title", e.target.value)}
                              placeholder="Step Title"
                            />
                            <Input 
                              value={step.description} 
                              onChange={e => updateCaseStep(index, "description", e.target.value)}
                              placeholder="Step Description"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Trust Badges (comma-separated)</Label>
                      <Input 
                        value={caseSectionContent.trustBadges.join(", ")} 
                        onChange={e => setCaseSectionContent({
                          ...caseSectionContent, 
                          trustBadges: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                        })} 
                        placeholder="Confidential & Secure, 24-Hour Response, ..."
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveCaseSection} disabled={savingContent} className="w-full">
                    <Save className="h-4 w-4 mr-2" /> Save Case Section
                  </Button>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Manage Services</h3>
                  <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetServiceForm(); setEditingService(null); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Title *</Label>
                            <Input value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} />
                          </div>
                          <div>
                            <Label>Icon</Label>
                            <Select value={serviceForm.icon} onValueChange={v => setServiceForm({...serviceForm, icon: v})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {iconOptions.map(icon => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Description *</Label>
                          <Textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />
                        </div>
                        <div>
                          <Label>Features (one per line)</Label>
                          <Textarea value={serviceForm.features} onChange={e => setServiceForm({...serviceForm, features: e.target.value})} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" rows={4} />
                        </div>
                        <div>
                          <Label>Link URL</Label>
                          <Input value={serviceForm.href} onChange={e => setServiceForm({...serviceForm, href: e.target.value})} placeholder="/services/..." />
                        </div>
                        <div>
                          <Label>Image</Label>
                          <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, setServiceForm, "image_url", "services")} />
                          {serviceForm.image_url && <img src={serviceForm.image_url} className="mt-2 h-24 object-cover rounded" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={serviceForm.is_active} onCheckedChange={v => setServiceForm({...serviceForm, is_active: v})} />
                          <Label>Active</Label>
                        </div>
                        <Button onClick={saveService} className="w-full">
                          <Save className="h-4 w-4 mr-2" /> Save Service
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {loading ? (
                  <p>Loading...</p>
                ) : services.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No services yet. Add your first service above.</p>
                ) : (
                  <div className="space-y-3">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          {service.image_url && <img src={service.image_url} className="h-12 w-12 object-cover rounded" />}
                          <div>
                            <p className="font-medium">{service.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-md">{service.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={service.is_active ? "default" : "secondary"}>
                            {service.is_active ? "Active" : "Hidden"}
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={() => openEditService(service)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Manage Testimonials</h3>
                  <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setTestimonialForm({ quote: "", author: "", organization: "", rating: 5, is_active: true }); setEditingTestimonial(null); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Testimonial
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Quote *</Label>
                          <Textarea value={testimonialForm.quote} onChange={e => setTestimonialForm({...testimonialForm, quote: e.target.value})} rows={4} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Author *</Label>
                            <Input value={testimonialForm.author} onChange={e => setTestimonialForm({...testimonialForm, author: e.target.value})} />
                          </div>
                          <div>
                            <Label>Organization</Label>
                            <Input value={testimonialForm.organization} onChange={e => setTestimonialForm({...testimonialForm, organization: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <Label>Rating (1-5)</Label>
                          <Select value={String(testimonialForm.rating)} onValueChange={v => setTestimonialForm({...testimonialForm, rating: parseInt(v)})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5].map(r => <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={testimonialForm.is_active} onCheckedChange={v => setTestimonialForm({...testimonialForm, is_active: v})} />
                          <Label>Active</Label>
                        </div>
                        <Button onClick={saveTestimonial} className="w-full">
                          <Save className="h-4 w-4 mr-2" /> Save Testimonial
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {testimonials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No testimonials yet.</p>
                ) : (
                  <div className="space-y-3">
                    {testimonials.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">"{t.quote.substring(0, 60)}..."</p>
                          <p className="text-sm text-muted-foreground">— {t.author}, {t.organization}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={t.is_active ? "default" : "secondary"}>{t.is_active ? "Active" : "Hidden"}</Badge>
                          <Button variant="ghost" size="icon" onClick={() => openEditTestimonial(t)}><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteTestimonial(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Partners Tab */}
              <TabsContent value="partners" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Manage Partners</h3>
                  <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setPartnerForm({ name: "", logo_url: "", website_url: "", is_active: true }); setEditingPartner(null); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Partner
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingPartner ? "Edit Partner" : "Add New Partner"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Partner Name *</Label>
                          <Input value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} />
                        </div>
                        <div>
                          <Label>Logo</Label>
                          <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, setPartnerForm, "logo_url", "partners")} />
                          {partnerForm.logo_url && <img src={partnerForm.logo_url} className="mt-2 h-16 object-contain" />}
                        </div>
                        <div>
                          <Label>Website URL</Label>
                          <Input value={partnerForm.website_url} onChange={e => setPartnerForm({...partnerForm, website_url: e.target.value})} placeholder="https://..." />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={partnerForm.is_active} onCheckedChange={v => setPartnerForm({...partnerForm, is_active: v})} />
                          <Label>Active</Label>
                        </div>
                        <Button onClick={savePartner} className="w-full">
                          <Save className="h-4 w-4 mr-2" /> Save Partner
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {partners.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No partners yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {partners.map(p => (
                      <div key={p.id} className="p-4 border rounded-lg text-center">
                        {p.logo_url ? (
                          <img src={p.logo_url} className="h-12 mx-auto mb-2 object-contain" />
                        ) : (
                          <div className="h-12 bg-muted rounded flex items-center justify-center mb-2">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <p className="font-medium text-sm">{p.name}</p>
                        <div className="flex justify-center gap-1 mt-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditPartner(p)}><Edit2 className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deletePartner(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Case Studies Tab */}
              <TabsContent value="casestudies" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Manage Case Studies</h3>
                  <Dialog open={caseStudyDialogOpen} onOpenChange={setCaseStudyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setCaseStudyForm({ title: "", client: "", category: "Corporate", description: "", outcome: "", impact: "", services: "", image_url: "", is_active: true, is_featured: false }); setEditingCaseStudy(null); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Case Study
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingCaseStudy ? "Edit Case Study" : "Add New Case Study"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Title *</Label>
                            <Input value={caseStudyForm.title} onChange={e => setCaseStudyForm({...caseStudyForm, title: e.target.value})} />
                          </div>
                          <div>
                            <Label>Client *</Label>
                            <Input value={caseStudyForm.client} onChange={e => setCaseStudyForm({...caseStudyForm, client: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={caseStudyForm.category} onValueChange={v => setCaseStudyForm({...caseStudyForm, category: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Description *</Label>
                          <Textarea value={caseStudyForm.description} onChange={e => setCaseStudyForm({...caseStudyForm, description: e.target.value})} rows={3} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Outcome</Label>
                            <Textarea value={caseStudyForm.outcome} onChange={e => setCaseStudyForm({...caseStudyForm, outcome: e.target.value})} rows={2} />
                          </div>
                          <div>
                            <Label>Impact</Label>
                            <Textarea value={caseStudyForm.impact} onChange={e => setCaseStudyForm({...caseStudyForm, impact: e.target.value})} rows={2} />
                          </div>
                        </div>
                        <div>
                          <Label>Services (comma-separated)</Label>
                          <Input value={caseStudyForm.services} onChange={e => setCaseStudyForm({...caseStudyForm, services: e.target.value})} placeholder="Digital Forensics, Incident Response" />
                        </div>
                        <div>
                          <Label>Image</Label>
                          <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, setCaseStudyForm, "image_url", "case-studies")} />
                          {caseStudyForm.image_url && <img src={caseStudyForm.image_url} className="mt-2 h-24 object-cover rounded" />}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Switch checked={caseStudyForm.is_active} onCheckedChange={v => setCaseStudyForm({...caseStudyForm, is_active: v})} />
                            <Label>Active</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={caseStudyForm.is_featured} onCheckedChange={v => setCaseStudyForm({...caseStudyForm, is_featured: v})} />
                            <Label>Featured</Label>
                          </div>
                        </div>
                        <Button onClick={saveCaseStudy} className="w-full">
                          <Save className="h-4 w-4 mr-2" /> Save Case Study
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {caseStudies.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No case studies yet.</p>
                ) : (
                  <div className="space-y-3">
                    {caseStudies.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {c.image_url && <img src={c.image_url} className="h-12 w-16 object-cover rounded" />}
                          <div>
                            <p className="font-medium">{c.title}</p>
                            <p className="text-sm text-muted-foreground">{c.client} • {c.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {c.is_featured && <Badge variant="outline">Featured</Badge>}
                          <Badge variant={c.is_active ? "default" : "secondary"}>{c.is_active ? "Active" : "Hidden"}</Badge>
                          <Button variant="ghost" size="icon" onClick={() => openEditCaseStudy(c)}><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCaseStudy(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
