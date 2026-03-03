import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, Calendar, LogOut, LayoutDashboard, Award, Briefcase, UserPlus, Globe, Settings, Palette, CreditCard, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeSwitcher } from "@/components/admin/ThemeSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [savingRazorpay, setSavingRazorpay] = useState(false);

  // 🔥 HOOK MUST BE INSIDE COMPONENT
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
      .upsert(
        {
          section_key: "razorpay_config",
          content: { keyId: razorpayKeyId, keySecret: razorpayKeySecret },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" }
      );

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Razorpay configuration saved!" });
    }

    setSavingRazorpay(false);
  };

  const stats = [
    { label: "Total Cases", value: dashboardStats?.totalCases ?? 0, icon: FileText },
    { label: "Active Clients", value: dashboardStats?.activeClients ?? 0, icon: Users },
    { label: "Pending Events", value: dashboardStats?.pendingEvents ?? 0, icon: Calendar },
    { label: "This Month", value: dashboardStats?.thisMonth ?? 0, icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-primary">VFRA</span> Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Vigilant Forensic Research & Analytics
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={async () => {
            await signOut();
            navigate("/admin");
          }}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            <div className="col-span-4 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-sm text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Theme */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher />
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default AdminDashboard;