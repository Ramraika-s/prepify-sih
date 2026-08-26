"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminCounselingLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabs = [
    { to: "/admin/counseling", label: "Colleges", exact: true },
    { to: "/admin/counseling/cutoffs", label: "Cutoffs Import", exact: false },
    { to: "/admin/counseling/events", label: "Events", exact: false },
    { to: "/admin/counseling/articles", label: "Articles", exact: false },
    { to: "/admin/counseling/reviews", label: "Reviews", exact: false },
  ] as const;

  return (
    <div className="space-y-4">
      <nav className="flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          return (
            <Link key={t.to} href={t.to}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border ${active ? "gradient-primary text-primary-foreground border-transparent" : "bg-card border-border"}`}>
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
