import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, Calendar, LogOut, LayoutDashboard, Award, Briefcase, UserPlus, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const stats = [
    { label: "Total Cases", value: "156", icon: FileText, color: "text-primary" },
    { label: "Active Clients", value: "48", icon: Users, color: "text-accent" },
    { label: "Pending Events", value: "12", icon: Calendar, color: "text-yellow-500" },
    { label: "This Month", value: "23", icon: LayoutDashboard, color: "text-green-500" },
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
                Forensi<span className="text-primary">X</span> Admin
              </h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Administrator" : "User"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
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
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
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
      </main>
    </div>
  );
};

export default AdminDashboard;