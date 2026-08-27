import { MentorsClient } from "@/components/mentors/mentors-client";
import { Suspense } from "react";

export const metadata = {
  title: "Mentors - Quero",
};

export default function MentorsPage() {
  return (
    <Suspense fallback={<div className="text-sm font-mono text-zinc-400 text-center py-12 animate-pulse">Loading mentors...</div>}>
      <MentorsClient />
    </Suspense>
  );
}
