"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NotificationsBell } from "@/components/dashboard/NotificationsBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AppHeader() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/70 backdrop-blur-2xl px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-transform hover:scale-110" />

        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join('/')}`;
              const isLast = index === segments.length - 1;
              const title = segment.charAt(0).toUpperCase() + segment.slice(1);

              return (
                <div key={href} className="flex items-center gap-1.5">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-foreground font-sans font-medium">{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                        {title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="text-muted-foreground/50" />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationsBell />
      </div>
    </header>
  );
}
