"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-zinc-400 hover:text-white" />
        
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
                      <BreadcrumbPage className="text-zinc-200">{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="text-zinc-500 hover:text-zinc-300">
                        {title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="text-zinc-600" />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
