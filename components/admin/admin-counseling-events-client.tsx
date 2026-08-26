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

const TYPES = ["registration", "choice_filling", "round_1", "round_2", "mop_up", "stray_vacancy", "document_verification", "reporting"] as const;

type Ev = {
  id?: string; counseling_body: string; title: string; event_type: (typeof TYPES)[number];
  start_date: string; end_date: string | null; year: number; notes: string | null; is_active: boolean;
};

function empty(): Ev { return { counseling_body: "MCC", title: "", event_type: "registration", start_date: "", end_date: null, year: new Date().getFullYear(), notes: null, is_active: true }; }

export function AdminCounselingEventsClient() {
  const router = useRouter();
  const qc = { invalidateQueries: () => router.refresh() };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ev>(empty());
  const [saving, setSaving] = useState(false);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await supabase.from("counseling_events").select("*").order("start_date", { ascending: false });
      return (data ?? []) as Ev[];
    },
  });

  const save = async (e: Ev) => {
    setSaving(true);
    try {
      const { id, ...payload } = e;
      const { error } = id ? await supabase.from("counseling_events").update(payload).eq("id", id)
        : await supabase.from("counseling_events").insert(payload);
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
      const { error } = await supabase.from("counseling_events").delete().eq("id", id);
      if (error) throw error;
      toast.success("Deleted"); qc.invalidateQueries(); window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button onClick={() => setEditing(empty())} />}><Plus size={14} /> New event</DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing.id ? "Edit event" : "New event"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>Body</Label><Input value={editing.counseling_body} onChange={(e) => setEditing({ ...editing, counseling_body: e.target.value })} /></div>
            <div><Label>Type</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editing.event_type} onChange={(e) => setEditing({ ...editing, event_type: e.target.value as Ev["event_type"] })}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><Label>Start date</Label><Input type="date" value={editing.start_date} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} /></div>
            <div><Label>End date</Label><Input type="date" value={editing.end_date ?? ""} onChange={(e) => setEditing({ ...editing, end_date: e.target.value || null })} /></div>
            <div><Label>Year</Label><Input type="number" value={editing.year} onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })} /></div>
            <div className="col-span-2"><Label>Notes</Label><Textarea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value || null })} /></div>
            <label className="flex items-center gap-2 text-sm col-span-2"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Active</label>
          </div>
          <Button className="w-full" onClick={() => save(editing)} disabled={!editing.title || !editing.start_date || saving}>
            {saving ? <Loader2 className="animate-spin" size={14} /> : "Save"}
          </Button>
        </DialogContent>
      </Dialog>
      <div className="space-y-1">
        {rows.map((e: any) => (
          <div key={e.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <div>
              <div className="font-semibold text-sm">{e.title}</div>
              <div className="text-[11px] text-muted-foreground">{e.counseling_body} · {e.event_type} · {e.start_date}{e.end_date ? ` → ${e.end_date}` : ""} · {e.year}</div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setEditing(e); setOpen(true); }}><Pencil size={14} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(e.id!)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
