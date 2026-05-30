import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export function AdminLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col w-full min-w-0">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6 lg:hidden">
            <SidebarTrigger />
            <span className="font-semibold text-sm">VFRA Admin</span>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children || <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
