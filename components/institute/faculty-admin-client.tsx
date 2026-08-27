"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Plus, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { rpc } from "@/lib/supabase-rpc";

type FacultyRow = {
  role_id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  assigned_subject_id: string | null;
  subject_name: string | null;
  questions_contributed: number;
  questions_approved: number;
};

type Batch = { id: string; name: string };
type Subject = { id: string; name: string };

export function FacultyAdminClient({ instituteId, batches }: { instituteId: string; batches: Batch[] }) {
  const [faculty, setFaculty] = useState<FacultyRow[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batchByFaculty, setBatchByFaculty] = useState<Record<string, Set<string>>>({});
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: facultyData, error }, { data: subjectRows }, { data: assignRows }] = await Promise.all([
      rpc<FacultyRow[]>("institute_faculty_list", { _institute_id: instituteId }),
      supabase.from("subjects").select("id, name").or(`institute_id.eq.${instituteId},institute_id.is.null`).order("sort_order"),
      batches.length
        ? supabase.from("institute_batch_faculty").select("batch_id, user_id").in("batch_id", batches.map((b) => b.id))
        : Promise.resolve({ data: [] as { batch_id: string; user_id: string }[] }),
    ]);
    if (error) toast.error(error.message);
    setFaculty(facultyData ?? []);
    setSubjects(subjectRows ?? []);

    const map: Record<string, Set<string>> = {};
    for (const row of assignRows ?? []) {
      if (!map[row.user_id]) map[row.user_id] = new Set();
      map[row.user_id].add(row.batch_id);
    }
    setBatchByFaculty(map);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instituteId, batches.length]);

  const addFaculty = async () => {
    if (!email.trim() || adding) return;
    setAdding(true);
    const { data, error } = await rpc<{ ok: boolean; reason?: string }>("institute_add_faculty", {
      _institute_id: instituteId,
      _email: email.trim(),
      _subject_id: subjectId || null,
    });
    setAdding(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data?.ok) {
      toast.error(
        data?.reason === "no_account"
          ? "No Quero account exists with that email yet"
          : "Could not add faculty"
      );
      return;
    }
    toast.success("Faculty added");
    setEmail("");
    setSubjectId("");
    load();
  };

  const removeFaculty = async (roleId: string) => {
    const { error } = await rpc("institute_remove_faculty", { _role_id: roleId });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Removed");
    load();
  };

  const toggleBatch = async (userId: string, batchId: string, assign: boolean) => {
    setBatchByFaculty((cur) => {
      const next = { ...cur };
      const set = new Set(next[userId] ?? []);
      if (assign) set.add(batchId);
      else set.delete(batchId);
      next[userId] = set;
      return next;
    });
    const { error } = await rpc("institute_assign_batch_faculty", {
      _batch_id: batchId,
      _user_id: userId,
      _assign: assign,
    });
    if (error) {
      toast.error(error.message);
      load();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.18 }}
      className="bg-card border border-border rounded-3xl p-6"
    >
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-muted-foreground" /> Faculty
      </h2>

      <div className="flex flex-wrap gap-2 mb-5">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Faculty's account email"
          className="flex-1 min-w-[200px] bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
        />
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
        >
          <option value="">No subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={addFaculty}
          disabled={adding || !email.trim()}
          className="flex items-center gap-1.5 text-xs font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add
        </motion.button>
      </div>
      <p className="text-[11px] text-muted-foreground -mt-3 mb-5">
        They need an existing Quero account with this email - sign-up isn't created from here.
      </p>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : faculty.length === 0 ? (
        <p className="text-sm text-muted-foreground">No faculty added yet.</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {faculty.map((f, i) => (
              <motion.div
                key={f.role_id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-background/50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.display_name ?? "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">{f.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {f.subject_name ?? "No subject"} · {f.questions_approved}/{f.questions_contributed} questions approved
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFaculty(f.role_id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                    aria-label="Remove faculty"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {batches.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {batches.map((b) => {
                      const active = batchByFaculty[f.user_id]?.has(b.id) ?? false;
                      return (
                        <motion.button
                          key={b.id}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          animate={{
                            backgroundColor: active ? "var(--primary)" : "transparent",
                            color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                          }}
                          transition={{ duration: 0.2 }}
                          onClick={() => toggleBatch(f.user_id, b.id, !active)}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                            active ? "border-transparent" : "border-border hover:border-foreground/30"
                          }`}
                        >
                          {b.name}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}
