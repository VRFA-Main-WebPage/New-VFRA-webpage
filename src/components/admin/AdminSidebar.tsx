import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Ticket,
  Award,
  FileText,
  FileSignature,
  Settings,
  LogOut,
  Image as ImageIcon
} from "lucide-react";
import logo from "@/assets/vfra-logo.png";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "Operations",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Cases", url: "/admin/cases", icon: Briefcase },
      { title: "Clients", url: "/admin/clients", icon: Users },
      { title: "Events", url: "/admin/events", icon: Calendar },
    ],
  },
  {
    label: "Documents",
    items: [
      { title: "Certificates", url: "/admin/certificates", icon: Award },
      { title: "Offer Letters", url: "/admin/offer-letters", icon: FileSignature },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Blogs", url: "/admin/blogs", icon: FileText },
      { title: "Website Content", url: "/admin/content", icon: ImageIcon },
    ],
  },
];

export function AdminSidebar() {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  return (
    <Sidebar variant="inset" className="bg-card text-card-foreground border-r border-border">
      <SidebarHeader className="p-4 flex items-center justify-center">
        <Link to="/admin/dashboard" className="flex flex-col items-center gap-2">
          <img src={logo} alt="VFRA Logo" className="h-10 w-auto object-contain" />
          <span className="font-bold text-sm text-center">
            <span className="text-primary">VFRA</span> Admin
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url || location.pathname.startsWith(item.url + "/")}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />
      
      <SidebarFooter className="p-4">
        <div className="flex flex-col items-start gap-2 mb-4 px-2">
          <span className="text-sm font-medium truncate w-full">{user?.email}</span>
          <span className="text-xs text-muted-foreground">
            {isAdmin ? "Administrator" : "User"}
          </span>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
