"use client";

import { useRouter } from "next/navigation";
import { useFetch as useQuery } from "@/lib/use-fetch";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/admin-log";

export function AdminCounselingReviewsClient() {
  const router = useRouter();
  const qc = { invalidateQueries: () => router.refresh() };
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("college_reviews").select("*, colleges(name)").order("created_at", { ascending: false }).limit(200);
      return data ?? [];
    },
  });

  const verify = async ({ id, v }: { id: string; v: boolean }) => {
    try {
      const { error } = await supabase.from("college_reviews").update({ is_verified: v }).eq("id", id);
      if (error) throw error;
      toast.success("Updated"); qc.invalidateQueries(); window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove review?")) return;
    try {
      const { error } = await supabase.from("college_reviews").delete().eq("id", id);
      if (error) throw error;
      await logAdminAction("review.delete", "college_reviews", id);
      toast.success("Removed"); qc.invalidateQueries(); window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-1">
      {rows.length === 0 && <div className="text-sm text-muted-foreground">No reviews yet.</div>}
      {rows.map((r: any) => (
        <div key={r.id} className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">{r.colleges?.name ?? "—"}</div>
            <div className="flex gap-1">
              <Button size="sm" variant={r.is_verified ? "default" : "outline"} onClick={() => verify({ id: r.id, v: !r.is_verified })}>
                <BadgeCheck size={12} /> {r.is_verified ? "Verified" : "Verify"}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 size={14} /></Button>
            </div>
          </div>
          {r.review_text && <p className="text-xs mt-1 text-muted-foreground">{r.review_text}</p>}
          <div className="text-[10px] text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
