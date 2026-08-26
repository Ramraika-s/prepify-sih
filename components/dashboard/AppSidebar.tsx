"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  
  // A simple way to determine the user role from the URL for this mock MVP
  const isInstitute = pathname.startsWith("/dashboard/institute");
  const isMentor = pathname.startsWith("/dashboard/mentor");
  const isStudent = pathname.startsWith("/dashboard/student");

  const navItems = React.useMemo(() => {
    if (isInstitute) {
      return [
        { title: "Overview", url: "/dashboard/institute", icon: LayoutDashboard },
        { title: "Batches & Faculty", url: "/dashboard/institute/batches", icon: Users },
        { title: "Settings", url: "/dashboard/institute/settings", icon: Settings },
      ];
    }
    if (isMentor) {
      return [
        { title: "Workspace", url: "/dashboard/mentor", icon: LayoutDashboard },
        { title: "Students", url: "/dashboard/mentor/students", icon: Users },
        { title: "Resources", url: "/dashboard/mentor/resources", icon: BookOpen },
        { title: "Settings", url: "/dashboard/mentor/settings", icon: Settings },
      ];
    }
    if (isStudent) {
      return [
        { title: "Dashboard", url: "/dashboard/student", icon: LayoutDashboard },
        { title: "Mock Tests", url: "/dashboard/student/tests", icon: GraduationCap },
        { title: "Study Materials", url: "/dashboard/student/materials", icon: BookOpen },
        { title: "Settings", url: "/dashboard/student/settings", icon: Settings },
      ];
    }
    return [];
  }, [isInstitute, isMentor, isStudent]);

  return (
    <Sidebar className="border-r border-white/10 bg-[#0a0a0a]">
      <SidebarHeader className="h-14 flex items-center justify-center border-b border-white/10 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <div className="size-6 rounded-md bg-white text-black flex items-center justify-center font-black text-xs">P</div>
          Prepify
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== `/dashboard/${isInstitute ? "institute" : isMentor ? "mentor" : "student"}`);
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  render={<Link href={item.url} />} 
                  isActive={isActive} 
                  tooltip={item.title}
                  className="text-zinc-400 hover:text-white data-[active=true]:text-white data-[active=true]:bg-white/10"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-zinc-800 border border-zinc-700" />
          <div className="flex flex-col text-sm">
            <span className="font-medium text-zinc-200">User Profile</span>
            <span className="text-xs text-zinc-500">
              {isInstitute ? "Admin" : isMentor ? "Mentor" : "Student"}
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
