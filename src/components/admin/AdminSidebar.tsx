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
  Award,
  FileText,
  FileSignature,
  LogOut,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  UserPlus,
} from "lucide-react";
import logo from "@/assets/vfra-logo.webp";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "Operations",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Cases", url: "/admin/cases", icon: Briefcase },
      { title: "Clients", url: "/admin/clients", icon: Users },
    ],
  },
  {
    label: "Public Modules",
    items: [
      { title: "Upcoming Events", url: "/admin/events", icon: Calendar },
      { title: "Forensic Gallery", url: "/admin/gallery", icon: ImageIcon },
      { title: "Blogs & Insights", url: "/admin/blogs", icon: FileText },
      { title: "Careers & JDs", url: "/admin/careers", icon: UserPlus },
      { title: "Website CMS", url: "/admin/content", icon: Sliders },
    ],
  },
  {
    label: "Documents",
    items: [
      { title: "Certificates", url: "/admin/certificates", icon: Award },
      { title: "Offer Letters", url: "/admin/offer-letters", icon: FileSignature },
    ],
  },
];

export function AdminSidebar() {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  return (
    <Sidebar variant="inset" className="bg-[#F7F7F5] text-[#111111] border-r border-[#E5E5E3]">
      <SidebarHeader className="p-4">
        <Link to="/admin/dashboard" className="flex items-center gap-3 px-1">
          <div className="h-9 w-9 rounded-md border border-[#E5E5E3] bg-white p-1 flex items-center justify-center shrink-0">
            <img src={logo} alt="VFRA Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-sm tracking-tight text-[#111111]">
              VFRA Admin
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#555555] mt-1">
              Control Console
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-[#E5E5E3]" />

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555]">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === item.url ||
                        location.pathname.startsWith(item.url + "/")
                      }
                    >
                      <Link to={item.url} className="font-medium text-[13px]">
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

      <SidebarSeparator className="bg-[#E5E5E3]" />

      <SidebarFooter className="p-4 space-y-3">
        <Link
          to="/"
          className="flex items-center justify-between px-2.5 py-2 rounded-md border border-[#E5E5E3] bg-white text-xs font-medium text-[#111111] hover:bg-[#F0EFEA] transition-colors"
        >
          <span>View Live Website</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#555555]" />
        </Link>
        <div className="flex flex-col items-start gap-0.5 px-1">
          <span className="text-xs font-medium text-[#111111] truncate w-full">
            {user?.email}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#555555]">
            {isAdmin ? "Role: Administrator" : "Role: Authenticated"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start border-[#D4D4D0] bg-white hover:bg-[#F0EFEA] text-[#111111] text-xs"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
