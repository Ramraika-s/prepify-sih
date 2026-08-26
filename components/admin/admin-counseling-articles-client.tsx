"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch as useQuery } from "@/lib/use-fetch";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

type A = { id?: string; title: string; slug: string; summary: string | null; content: string; category: string | null; sort_order: number; is_published: boolean };
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function empty(): A { return { title: "", slug: "", summary: "", content: "", category: "", sort_order: 0, is_published: true }; }

export function AdminCounselingArticlesClient() {
  const router = useRouter();
  const qc = { invalidateQueries: () => router.refresh() };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<A>(empty());
  const [saving, setSaving] = useState(false);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data } = await supabase.from("counseling_articles").select("*").order("sort_order").order("title");
      return (data ?? []) as A[];
    },
  });

  const save = async (a: A) => {
    setSaving(true);
    try {
      const payload = { ...a, slug: a.slug || slugify(a.title) };
      const { id, ...rest } = payload;
      const { error } = id ? await supabase.from("counseling_articles").update(rest).eq("id", id)
        : await supabase.from("counseling_articles").insert(rest);
      if (error) throw error;
      toast.success("Saved"); setOpen(false); qc.invalidateQueries(); window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      const { error } = await supabase.from("counseling_articles").delete().eq("id", id);
      if (error) throw error;
      toast.success("Deleted"); qc.invalidateQueries(); window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button onClick={() => setEditing(empty())} />}><Plus size={14} /> New article</DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing.id ? "Edit article" : "New article"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
            <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
            <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
            <div className="col-span-2"><Label>Summary</Label><Input value={editing.summary ?? ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
            <div className="col-span-2"><Label>Content (plain text / markdown-ish)</Label><Textarea rows={10} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
            <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} /> Published</label>
          </div>
          <Button className="w-full" onClick={() => save(editing)} disabled={!editing.title || !editing.content || saving}>
            {saving ? <Loader2 className="animate-spin" size={14} /> : "Save"}
          </Button>
        </DialogContent>
      </Dialog>
      <div className="space-y-1">
        {rows.map((a: any) => (
          <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <div>
              <div className="font-semibold text-sm">{a.title}</div>
              <div className="text-[11px] text-muted-foreground">/{a.slug}{a.category ? ` · ${a.category}` : ""}{!a.is_published ? " · draft" : ""}</div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setEditing(a); setOpen(true); }}><Pencil size={14} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(a.id!)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
