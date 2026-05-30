import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Users, FileText, Calendar, LayoutDashboard, Award, Briefcase, Globe, Settings, Loader2, Plus, ArrowRight, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();


  const { data: dashboardStats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        totalCases, pendingCases, inProgressCases, closedCases,
        publishedEvents, certificates, eventRegistrations
      ] = await Promise.all([
        supabase.from("cases").select("id", { count: "exact", head: true }),
        supabase.from("cases").select("id", { count: "exact", head: true }).eq("status", "submitted"),
        supabase.from("cases").select("id", { count: "exact", head: true }).in("status", ["in_progress", "under_review"]),
        supabase.from("cases").select("id", { count: "exact", head: true }).in("status", ["closed", "resolved"]),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("event_registrations").select("id", { count: "exact", head: true }),
      ]);

      const { data: recentCases } = await supabase
        .from("cases")
        .select("id, case_id, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: recentRegistrations } = await supabase
        .from("event_registrations")
        .select("id, name, created_at, events(title)")
        .order("created_at", { ascending: false })
        .limit(5);

      return {
        stats: {
          totalCases: totalCases.count ?? 0,
          pendingCases: pendingCases.count ?? 0,
          inProgressCases: inProgressCases.count ?? 0,
          closedCases: closedCases.count ?? 0,
          publishedEvents: publishedEvents.count ?? 0,
          certificates: certificates.count ?? 0,
          eventRegistrations: eventRegistrations.count ?? 0,
        },
        recentCases: recentCases || [],
        recentRegistrations: recentRegistrations || []
      };
    },
  });

  const statsCards = [
    { label: "Total Cases", value: dashboardStats?.stats.totalCases ?? 0, icon: Briefcase, color: "text-blue-500" },
    { label: "Pending Cases", value: dashboardStats?.stats.pendingCases ?? 0, icon: FileText, color: "text-yellow-500" },
    { label: "In Progress Cases", value: dashboardStats?.stats.inProgressCases ?? 0, icon: LayoutDashboard, color: "text-purple-500" },
    { label: "Closed Cases", value: dashboardStats?.stats.closedCases ?? 0, icon: Shield, color: "text-green-500" },
    { label: "Published Events", value: dashboardStats?.stats.publishedEvents ?? 0, icon: Calendar, color: "text-orange-500" },
    { label: "Certificates Issued", value: dashboardStats?.stats.certificates ?? 0, icon: Award, color: "text-amber-500" },
    { label: "Event Registrations", value: dashboardStats?.stats.eventRegistrations ?? 0, icon: Users, color: "text-indigo-500" },
  ];

  const quickActions = [
    { label: "View Cases", icon: Briefcase, path: "/admin/cases" },
    { label: "Create Event", icon: Calendar, path: "/admin/events" },
    { label: "Issue Certificate", icon: Award, path: "/admin/certificates/create" },
    { label: "Manage Content", icon: Settings, path: "/admin/content" },
    { label: "View Website", icon: Globe, path: "/", external: true },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your operations and recent activity.</p>
      </div>

      {statsError ? (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="py-6 flex justify-center text-destructive">
            Failed to load dashboard statistics.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            Array(7).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-4 w-4 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-12 bg-muted rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Latest submitted case inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : dashboardStats?.recentCases?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No recent cases</div>
            ) : (
              <div className="space-y-4">
                {dashboardStats?.recentCases.map(c => (
                  <div key={c.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{c.title || c.case_id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                      {c.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
                <Button variant="link" className="w-full text-xs" asChild>
                  <Link to="/admin/cases">View all cases <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Event Registrations</CardTitle>
            <CardDescription>Latest signups for your events</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : dashboardStats?.recentRegistrations?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No recent registrations</div>
            ) : (
              <div className="space-y-4">
                {dashboardStats?.recentRegistrations.map(r => (
                  <div key={r.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.events?.title || "Unknown Event"}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
                <Button variant="link" className="w-full text-xs" asChild>
                  <Link to="/admin/events">View all events <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              asChild
            >
              {action.external ? (
                 <a href={action.path} target="_blank" rel="noopener noreferrer">
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs text-center">{action.label}</span>
                </a>
              ) : (
                <Link to={action.path}>
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs text-center">{action.label}</span>
                </Link>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

export default AdminDashboard;