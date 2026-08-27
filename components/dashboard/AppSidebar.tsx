"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  Compass,
  FileQuestion,
  ShieldAlert,
  User,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { signOutAndRedirect } from "@/app/actions/auth";

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

  const isInstitute = pathname.startsWith("/dashboard/institute");
  const isMentor = pathname.startsWith("/dashboard/mentor");
  const isStudent = pathname.startsWith("/dashboard/student");
  const isAdmin = pathname.startsWith("/dashboard/admin");

  const roleBase = isInstitute ? "institute" : isMentor ? "mentor" : isAdmin ? "admin" : "student";

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
        { title: "DPP Practice", url: "/dashboard/student/dpp", icon: ClipboardList },
        { title: "PYQ Library", url: "/dashboard/student/pyq", icon: FileQuestion },
      ];
    }
    if (isAdmin) {
      return [
        { title: "Admin Home", url: "/dashboard/admin", icon: ShieldAlert },
        { title: "Users", url: "/dashboard/admin/users", icon: Users },
        { title: "Content", url: "/dashboard/admin/content", icon: BookOpen },
        { title: "Mentors", url: "/dashboard/admin/mentors", icon: GraduationCap },
        { title: "Leads", url: "/dashboard/admin/leads", icon: Compass },
      ];
    }
    return [];
  }, [isInstitute, isMentor, isStudent, isAdmin]);

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="h-14 flex items-center justify-center border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg font-heading tracking-tight text-sidebar-foreground group">
          <motion.div
            className="size-6 rounded-md q-gradient-bg flex items-center justify-center font-black text-xs text-white"
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Q
          </motion.div>
          Quero
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item, i) => {
            const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== `/dashboard/${roleBase}`);

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.title}
                    className="relative text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors duration-200 hover:translate-x-1 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent font-sans overflow-hidden"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-glow"
                        className="absolute inset-0 q-gradient-bg opacity-[0.08]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <motion.span whileHover={{ scale: 1.15 }} className="relative z-10 inline-flex">
                      <item.icon className="mr-2 h-4 w-4" />
                    </motion.span>
                    <span className="relative z-10">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-1">
        <motion.div whileHover={{ x: 2 }}>
          <Link
            href={`/dashboard/${roleBase}/profile`}
            className="flex items-center gap-3 hover:bg-sidebar-accent p-2 -mx-2 rounded-xl transition-colors"
          >
            <div className="size-8 rounded-full bg-sidebar-accent border border-sidebar-border overflow-hidden flex items-center justify-center text-sidebar-foreground/60">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium font-sans text-sidebar-foreground">Profile</span>
              <span className="text-xs font-mono text-sidebar-foreground/50 capitalize">{roleBase}</span>
            </div>
          </Link>
        </motion.div>
        <form action={signOutAndRedirect}>
          <motion.button
            type="submit"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 text-sidebar-foreground/60 hover:text-red-500 hover:bg-red-500/10 p-2 -mx-2 rounded-xl transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 ml-1" />
            Log out
          </motion.button>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
