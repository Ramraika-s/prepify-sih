import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // Cache for 60 seconds

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: rows = [] } = await supabase
    .from("counseling_articles")
    .select("id, title, slug, summary, category")
    .eq("is_published", true)
    .order("sort_order")
    .order("title");

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Learning Resources</h2>
      <div className="space-y-2">
        {!rows || rows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            No articles published yet.
          </div>
        ) : (
          rows.map((a) => (
            <Link key={a.id} href={`/counseling/resources/${a.slug}`} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary/40">
              <div className="h-9 w-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><BookOpen size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{a.title}</div>
                {a.summary && <div className="text-xs text-muted-foreground line-clamp-2">{a.summary}</div>}
                {a.category && <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">{a.category}</div>}
              </div>
              <ChevronRight size={16} className="text-muted-foreground mt-1" />
            </Link>
          ))
        )}
      </div>
    </>
  );
}
