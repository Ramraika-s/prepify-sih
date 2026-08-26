"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ArrowLeft,
  CreditCard,
  GraduationCap,
  ScrollText,
  FileText,
  MessageCircle,
  Heart,
  UserCheck,
  Building2,
} from "lucide-react";

const tabs = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
  { to: "/admin/content", label: "Content", icon: BookOpen, exact: false },
  { to: "/admin/counseling", label: "Counseling", icon: GraduationCap, exact: false },
  { to: "/admin/billing", label: "Billing", icon: CreditCard, exact: false },
  { to: "/admin/activity", label: "Activity", icon: ScrollText, exact: false },
  { to: "/admin/legal", label: "Legal Pages", icon: FileText, exact: false },
  { to: "/admin/contact", label: "Contact", icon: MessageCircle, exact: false },
  { to: "/admin/mentors", label: "Mentors", icon: UserCheck, exact: false },
  { to: "/admin/team", label: "Team", icon: Heart, exact: false },
  { to: "/admin/leads", label: "Institute Leads", icon: Building2, exact: false },
] as const;

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-bold">Prepify Admin</h1>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-5 pb-2 flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                href={t.to}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${active ? "gradient-primary text-primary-foreground border-transparent" : "bg-card border-border"}`}
              >
                <Icon size={14} /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6">
        {children}
      </main>
    </div>
  );
}
