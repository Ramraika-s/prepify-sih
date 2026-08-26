import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppHeader } from "@/components/dashboard/AppHeader";

export const metadata: Metadata = {
  title: "Dashboard | Prepify",
  description: "Your personalized Prepify dashboard and analytics portal.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col bg-black text-white">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
