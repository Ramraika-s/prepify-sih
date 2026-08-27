"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users, Plus, Loader2, Check, X, ClipboardList, FileText, UploadCloud, Copy, KeyRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { rpc } from "@/lib/supabase-rpc";
import { useInstituteRole } from "@/lib/institute";
import { FacultyAdminClient } from "@/components/institute/faculty-admin-client";

type Batch = { id: string; name: string; subject_id: string | null; created_at: string };
type Subject = { id: string; name: string };
type PendingEnrollment = {
  id: string;
  user_id: string;
  requested_at: string;
  student_name: string | null;
  student_email: string | null;
};
type QuestionRow = { id: string; question_text: string; subject_id: string };
type Dpp = { id: string; title: string; kind: string; batch_id: string; created_at: string };

export function BatchesAdminClient() {
  const { info, isLoading: roleLoading } = useInstituteRole();
  const instituteId = info?.instituteId ?? null;

  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pending, setPending] = useState<PendingEnrollment[]>([]);
  const [dpps, setDpps] = useState<Dpp[]>([]);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchSubject, setNewBatchSubject] = useState("");
  const [creatingBatch, setCreatingBatch] = useState(false);

  const [assignBatch, setAssignBatch] = useState<Record<string, string>>({});
  const [reviewing, setReviewing] = useState<string | null>(null);

  const load = async () => {
    if (!instituteId) return;
    setLoading(true);
    const [{ data: batchRows }, { data: subjectRows }, { data: dppRows }, { data: instituteRow }] = await Promise.all([
      supabase.from("institute_batches").select("id, name, subject_id, created_at").eq("institute_id", instituteId).order("created_at", { ascending: false }),
      supabase.from("subjects").select("id, name").or(`institute_id.eq.${instituteId},institute_id.is.null`).order("sort_order"),
      supabase.from("dpps").select("id, title, kind, batch_id, created_at").eq("institute_id", instituteId).order("created_at", { ascending: false }),
      supabase.from("institutes").select("join_code").eq("id", instituteId).single(),
    ]);
    setBatches(batchRows ?? []);
    setSubjects(subjectRows ?? []);
    setDpps((dppRows ?? []) as Dpp[]);
    setJoinCode(instituteRow?.join_code ?? null);

    const { data: enrollRows } = await supabase
      .from("institute_enrollments")
      .select("id, user_id, requested_at")
      .eq("institute_id", instituteId)
      .eq("status", "pending")
      .order("requested_at", { ascending: true });

    const userIds = (enrollRows ?? []).map((r) => r.user_id);
    let profileById = new Map<string, { display_name: string | null; email: string | null }>();
    if (userIds.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, email")
        .in("id", userIds);
      profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
    }

    setPending(
      (enrollRows ?? []).map((r) => ({
        id: r.id,
        user_id: r.user_id,
        requested_at: r.requested_at,
        student_name: profileById.get(r.user_id)?.display_name ?? null,
        student_email: profileById.get(r.user_id)?.email ?? null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!roleLoading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleLoading, instituteId]);

  const createBatch = async () => {
    if (!instituteId || !newBatchName.trim() || creatingBatch) return;
    setCreatingBatch(true);
    const { error } = await supabase.from("institute_batches").insert({
      institute_id: instituteId,
      name: newBatchName.trim(),
      subject_id: newBatchSubject || null,
    });
    setCreatingBatch(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewBatchName("");
    setNewBatchSubject("");
    toast.success("Batch created");
    load();
  };

  const review = async (enrollmentId: string, approve: boolean) => {
    setReviewing(enrollmentId);
    const { error } = await rpc("institute_review_enrollment", {
      _enrollment_id: enrollmentId,
      _approve: approve,
      _batch_id: approve ? assignBatch[enrollmentId] || null : null,
    });
    setReviewing(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(approve ? "Student approved" : "Request declined");
    load();
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!instituteId) {
    return <p className="text-sm text-muted-foreground">No institute role found for your account.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Join code */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-card border border-border rounded-3xl p-6 flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-foreground font-medium">Your institute's join code</p>
            <p className="text-xs text-muted-foreground">Share this with students so they can request enrollment.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg tracking-widest text-foreground bg-background border border-border rounded-lg px-4 py-2">
            {joinCode ?? "…"}
          </span>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              if (joinCode) {
                navigator.clipboard.writeText(joinCode);
                toast.success("Copied");
              }
            }}
            className="p-2.5 rounded-lg bg-accent hover:bg-accent/70 text-muted-foreground transition-colors"
            aria-label="Copy join code"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.section>

      {/* Pending enrollment requests */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06 }}
        className="bg-card border border-border rounded-3xl p-6"
      >
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-muted-foreground" /> Pending requests
          {pending.length > 0 && (
            <motion.span
              key={pending.length}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="text-xs font-mono bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full"
            >
              {pending.length}
            </motion.span>
          )}
        </h2>

        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending join requests.</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {pending.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -12, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex flex-wrap items-center gap-3 bg-background/60 border border-border rounded-2xl p-4"
                >
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-sm font-medium text-foreground">{p.student_name ?? "Unnamed student"}</p>
                    <p className="text-xs text-muted-foreground">{p.student_email}</p>
                  </div>
                  <select
                    value={assignBatch[p.id] ?? ""}
                    onChange={(e) => setAssignBatch((cur) => ({ ...cur, [p.id]: e.target.value }))}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground"
                  >
                    <option value="">No batch yet</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => review(p.id, true)}
                    disabled={reviewing === p.id}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => review(p.id, false)}
                    disabled={reviewing === p.id}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Decline
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.section>

      {/* Batches */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="bg-card border border-border rounded-3xl p-6"
      >
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-muted-foreground" /> Batches
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
            placeholder="New batch name"
            className="flex-1 min-w-[180px] bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
          />
          <select
            value={newBatchSubject}
            onChange={(e) => setNewBatchSubject(e.target.value)}
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
            onClick={createBatch}
            disabled={creatingBatch || !newBatchName.trim()}
            className="flex items-center gap-1.5 text-xs font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {creatingBatch ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Create
          </motion.button>
        </div>

        {batches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No batches yet. Create one above.</p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {batches.map((b, i) => (
                <motion.li
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between text-sm bg-background/60 border border-border rounded-xl px-4 py-2.5"
                >
                  <span className="text-foreground">{b.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {dpps.filter((d) => d.batch_id === b.id).length} DPP{dpps.filter((d) => d.batch_id === b.id).length === 1 ? "" : "s"}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.section>

      <FacultyAdminClient instituteId={instituteId} batches={batches} />

      <DppComposer instituteId={instituteId} batches={batches} onPosted={load} />
    </div>
  );
}

function DppComposer({
  instituteId,
  batches,
  onPosted,
}: {
  instituteId: string;
  batches: Batch[];
  onPosted: () => void;
}) {
  const [batchId, setBatchId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<"questions" | "file">("questions");
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [file, setFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (kind !== "questions") return;
    const timeout = setTimeout(async () => {
      let q = supabase.from("questions").select("id, question_text, subject_id").eq("status", "approved").limit(30);
      q = q.or(`institute_id.is.null,institute_id.eq.${instituteId}`);
      if (search.trim()) q = q.ilike("question_text", `%${search.trim()}%`);
      const { data } = await q;
      setQuestions((data ?? []) as QuestionRow[]);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, kind, instituteId]);

  const toggleQuestion = (id: string) => {
    setSelectedQuestionIds((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setSelectedQuestionIds(new Set());
    setFile(null);
  };

  const post = async () => {
    if (!batchId || !title.trim() || posting) return;

    if (kind === "questions" && selectedQuestionIds.size === 0) {
      toast.error("Select at least one question");
      return;
    }
    if (kind === "file" && !file) {
      toast.error("Choose a file to upload");
      return;
    }

    setPosting(true);
    try {
      if (kind === "questions") {
        const { error } = await rpc("institute_create_dpp_questions", {
          _batch_id: batchId,
          _title: title.trim(),
          _description: description.trim() || null,
          _question_ids: Array.from(selectedQuestionIds),
        });
        if (error) throw new Error(error.message);
      } else {
        const path = `${instituteId}/${batchId}/${Date.now()}-${file!.name}`;
        const { error: uploadError } = await supabase.storage.from("dpp-files").upload(path, file!);
        if (uploadError) throw uploadError;

        const { error } = await rpc("institute_create_dpp_file", {
          _batch_id: batchId,
          _title: title.trim(),
          _description: description.trim() || null,
          _file_path: path,
        });
        if (error) throw new Error(error.message);
      }
      toast.success("DPP posted to the batch");
      reset();
      onPosted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not post DPP");
    } finally {
      setPosting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.24 }}
      className="bg-card border border-border rounded-3xl p-6"
    >
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-muted-foreground" /> Post a DPP
      </h2>

      <div className="space-y-3 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground"
          >
            <option value="">Select batch…</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <div className="relative flex rounded-lg border border-border overflow-hidden">
            <motion.span
              className="absolute inset-y-0 w-1/2 bg-foreground"
              animate={{ x: kind === "questions" ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
            <button
              onClick={() => setKind("questions")}
              className={`relative z-10 flex-1 text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 transition-colors ${kind === "questions" ? "text-background" : "text-muted-foreground"}`}
            >
              <ClipboardList className="w-3.5 h-3.5" /> Questions
            </button>
            <button
              onClick={() => setKind("file")}
              className={`relative z-10 flex-1 text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 transition-colors ${kind === "file" ? "text-background" : "text-muted-foreground"}`}
            >
              <FileText className="w-3.5 h-3.5" /> File upload
            </button>
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title, e.g. Kinematics DPP #4"
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground resize-none"
        />

        {kind === "questions" ? (
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground mb-2"
            />
            <div className="max-h-56 overflow-y-auto space-y-1.5 border border-border rounded-lg p-2">
              {questions.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2 py-4 text-center">No questions found.</p>
              ) : (
                questions.map((q, i) => (
                  <motion.label
                    key={q.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="flex items-start gap-2 text-xs text-foreground/80 hover:bg-accent rounded-lg px-2 py-1.5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.has(q.id)}
                      onChange={() => toggleQuestion(q.id)}
                      className="mt-0.5"
                    />
                    <span className="line-clamp-2">{q.question_text}</span>
                  </motion.label>
                ))
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{selectedQuestionIds.size} selected</p>
          </div>
        ) : (
          <label className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-border rounded-lg px-3 py-4 cursor-pointer hover:border-foreground/30 transition-colors">
            <UploadCloud className="w-4 h-4" />
            {file ? file.name : "Choose a PDF or worksheet to upload"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={post}
          disabled={posting || !batchId || !title.trim()}
          className="flex items-center gap-2 text-sm font-semibold bg-foreground text-background px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {posting && <Loader2 className="w-4 h-4 animate-spin" />}
          Post DPP
        </motion.button>
      </div>
    </motion.section>
  );
}
