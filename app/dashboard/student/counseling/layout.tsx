import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CounselingHeader } from "@/components/counseling/counseling-header";
import { CounselingDisclaimer } from "@/components/counseling-disclaimer";

export default async function CounselingLayout({ children }: { children: React.ReactNode }) {
  // Goal check temporarily disabled as per requirements
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <CounselingHeader />
      <main className="mx-auto max-w-lg px-5 py-4 space-y-4">
        <CounselingDisclaimer />
        {children}
      </main>
    </div>
  );
}
