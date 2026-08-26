"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function CounselingHeader() {
  const pathname = usePathname();
  const isRoot = pathname === "/dashboard/student/counseling" || pathname === "/dashboard/student/counseling/";

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-lg flex items-center gap-3 px-5 py-3.5">
        <Link href={isRoot ? "/dashboard/student" : "/dashboard/student/counseling"} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-base font-bold leading-tight">Counseling Guide</h1>
          <p className="text-[10px] text-muted-foreground">NEET UG · Educational guidance</p>
        </div>
      </div>
    </header>
  );
}
