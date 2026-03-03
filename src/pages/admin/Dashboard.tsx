import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Users, FileText, Calendar, LogOut, LayoutDashboard, Award, Briefcase, UserPlus, Globe, Settings, Palette, CreditCard, Eye, EyeOff, Save, Loader2 } from "lucide-react";import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeSwitcher } from "@/components/admin/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";



const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Razorpay config state
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [savingRazorpay, setSavingRazorpay] = useState(false);

  useEffect(() => {
    fetchRazorpayConfig();
  }, []);

  const fetchRazorpayConfig = async () => {
    const { data } = await supabase
      .from("website_content")
      .select("content")
      .eq("section_key", "razorpay_config")
      .maybeSingle();
    
    if (data?.content) {
      const config = data.content as { keyId?: string; keySecret?: string };
      setRazorpayKeyId(config.keyId || "");
      setRazorpayKeySecret(config.keySecret || "");
    }
  };

  const saveRazorpayConfig = async () => {
    setSavingRazorpay(true);
    const { error } = await supabase
      .from("website_content")
      .upsert({
        section_key: "razorpay_config",
        content: { keyId: razorpayKeyId, keySecret: razorpayKeySecret },
        updated_at: new Date().toISOString(),
      }, { onConflict: "section_key" });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Razorpay configuration saved!" });
    }
    setSavingRazorpay(false);
  };

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
  queryKey: ["dashboard-stats"],
  queryFn: async () => {
    const firstDay = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString();

    const totalCasesRes = await supabase
      .from("cases")
      .select("id", { count: "exact", head: true });

    const activeClientsRes = await supabase
      .from("clients")
      .select("id", { count: "exact", head: true });

    const pendingEventsRes = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("is_published", false);

    const thisMonthRes = await supabase
      .from("cases")
      .select("id", { count: "exact", head: true })
      .gte("created_at", firstDay);

    return {
      totalCases: totalCasesRes.count ?? 0,
      activeClients: activeClientsRes.count ?? 0,
      pendingEvents: pendingEventsRes.count ?? 0,
      thisMonth: thisMonthRes.count ?? 0,
    };
  },
});

const stats = [
  { label: "Total Cases", value: dashboardStats?.totalCases ?? 0, icon: FileText, color: "text-primary" },
  { label: "Active Clients", value: dashboardStats?.activeClients ?? 0, icon: Users, color: "text-accent" },
  { label: "Pending Events", value: dashboardStats?.pendingEvents ?? 0, icon: Calendar, color: "text-yellow-500" },
  { label: "This Month", value: dashboardStats?.thisMonth ?? 0, icon: LayoutDashboard, color: "text-green-500" },
];

  const quickActions = [
    { 
      label: "Offer Letters", 
      icon: FileText, 
      path: "/admin/offer-letters",
      enabled: true 
    },
    { 
      label: "Certificates", 
      icon: Award, 
      path: "/admin/certificates",
      enabled: true 
    },
    { 
      label: "Cases", 
      icon: Briefcase, 
      path: "/admin/cases",
      enabled: true 
    },
    { 
      label: "Clients", 
      icon: UserPlus, 
      path: "/admin/clients",
      enabled: true 
    },
    { 
      label: "Events", 
      icon: Calendar, 
      path: "/admin/events",
      enabled: true 
    },
    { 
      label: "Website Content", 
      icon: Settings, 
      path: "/admin/content",
      enabled: true 
    },
    { 
      label: "View Website", 
      icon: Globe, 
      path: "/",
      enabled: true,
      external: true 
    },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                <span className="text-primary">VFRA</span> Admin
              </h1>
              <p className="text-sm text-muted-foreground">Vigilant Forensic Research & Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Administrator" : "User"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={async () => {
              await signOut();
              navigate("/admin");
            }}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your forensic operations.
          </p>
        </div>

        {/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {statsLoading ? (
    <div className="col-span-4 flex justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  ) : (
    stats.map((stat) => (
      <Card key={stat.label}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </CardTitle>
          <stat.icon className={`h-5 w-5 ${stat.color}`} />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-foreground">
            {stat.value}
          </p>
        </CardContent>
      </Card>
    ))
  )}
</div>
    

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => handleQuickAction(action)}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Settings
            </CardTitle>
            <CardDescription>
              Customize the website appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher />
          </CardContent>
        </Card>

        {/* Razorpay Configuration */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Gateway (Razorpay)
            </CardTitle>
            <CardDescription>
              Configure Razorpay keys for event payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
                <Input 
                  id="razorpay-key"
                  value={razorpayKeyId}
                  onChange={e => setRazorpayKeyId(e.target.value)}
                  placeholder="rzp_live_xxxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="razorpay-secret">Razorpay Key Secret</Label>
                <div className="relative">
                  <Input 
                    id="razorpay-secret"
                    type={showSecret ? "text" : "password"}
                    value={razorpayKeySecret}
                    onChange={e => setRazorpayKeySecret(e.target.value)}
                    placeholder="••••••••••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API keys from the <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">Razorpay Dashboard</a>
            </p>
            <Button onClick={saveRazorpayConfig} disabled={savingRazorpay}>
              <Save className="h-4 w-4 mr-2" /> Save Razorpay Configuration
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;