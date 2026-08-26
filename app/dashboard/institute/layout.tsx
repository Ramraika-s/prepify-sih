import Link from "next/link";
import { ReactNode } from "react";
import { SidebarNav, NavLink } from "@/components/ui/SidebarNav";

const instituteLinks: NavLink[] = [
  { href: "/dashboard/institute", label: "Overview" },
  { href: "/dashboard/institute/batches", label: "Batch Management" },
  { href: "/dashboard/institute/settings", label: "Settings & Billing" },
];

export default function InstituteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Persistent Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-3xl flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard/institute" className="text-xl font-bold tracking-tight">
            Institute Portal
          </Link>
        </div>
        <SidebarNav links={instituteLinks} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
        <div className="p-8 relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
