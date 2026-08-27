"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ClipboardList, FileText, Lock, Loader2, CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { rpc } from "@/lib/supabase-rpc";
import { useAuth } from "@/lib/auth";

type Enrollment = {
  enrollment_id: string;
  institute_id: string;
  institute_name: string;
  batch_id: string | null;
  batch_name: string | null;
  status: "pending" | "active" | "rejected" | "removed";
};

type Dpp = {
  id: string;
  title: string;
  description: string | null;
  kind: "questions" | "file";
  test_id: string | null;
  file_path: string | null;
  due_date: string | null;
  created_at: string;
};

export function DppClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [enrollment, setEnrollment] = useState<Enrollment | null | undefined>(undefined);
  const [dpps, setDpps] = useState<Dpp[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/sign-in?next=/dashboard/student/dpp");
      return;
    }

    (async () => {
      const { data } = await rpc<Enrollment[]>("my_institute_enrollment");
      const enr = data?.[0] ?? null;
      setEnrollment(enr);

      if (enr?.status === "active" && enr.batch_id) {
        const { data: dppRows } = await supabase
          .from("dpps")
          .select("id, title, description, kind, test_id, file_path, due_date, created_at")
          .eq("batch_id", enr.batch_id)
          .order("created_at", { ascending: false });
        setDpps((dppRows ?? []) as Dpp[]);

        const testIds = (dppRows ?? []).map((d) => d.test_id).filter((id): id is string => !!id);
        if (testIds.length) {
          const { data: attempts } = await supabase
            .from("test_attempts")
            .select("test_id, submitted_at")
            .eq("user_id", user.id)
            .in("test_id", testIds)
            .not("submitted_at", "is", null);
          setCompleted(new Set((attempts ?? []).map((a) => a.test_id!)));
        }
      }
      setLoading(false);
    })();
  }, [authLoading, user, router]);

  const startQuestionsDpp = async (dpp: Dpp) => {
    if (!user || !dpp.test_id || starting) return;
    setStarting(dpp.id);
    try {
      const { data: existing } = await supabase
        .from("test_attempts")
        .select("id, submitted_at")
        .eq("test_id", dpp.test_id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing && !existing.submitted_at) {
        router.push(`/test/${existing.id}/instructions`);
        return;
      }

      const { data: testRow } = await supabase
        .from("tests")
        .select("question_count, duration_seconds, subject_id")
        .eq("id", dpp.test_id)
        .single();

      const { data: attempt, error } = await supabase
        .from("test_attempts")
        .insert({
          user_id: user.id,
          test_id: dpp.test_id,
          subject_id: testRow?.subject_id ?? null,
          test_type: "dpp",
          mode: "practice",
          duration_seconds: testRow?.duration_seconds ?? 0,
          total_questions: testRow?.question_count ?? 0,
        })
        .select()
        .single();

      if (error || !attempt) throw error ?? new Error("Could not start this DPP");
      router.push(`/test/${attempt.id}/instructions`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start this DPP");
    } finally {
      setStarting(null);
    }
  };

  const openFileDpp = async (dpp: Dpp) => {
    if (!dpp.file_path) return;
    const { data, error } = await supabase.storage
      .from("dpp-files")
      .createSignedUrl(dpp.file_path, 60);
    if (error || !data?.signedUrl) {
      toast.error("Could not open this file");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!enrollment || enrollment.status !== "active") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto text-center py-20"
      >
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        </motion.div>
        <h1 className="text-xl font-semibold text-foreground mb-2">DPP Practice is institute-only</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Daily Practice Problems are posted by your institute for your batch. Enroll with your
          institute's join code from your profile to unlock them.
        </p>
        <motion.a
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          href="/dashboard/student/profile"
          className="inline-block bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-colors"
        >
          Go to Profile
        </motion.a>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-muted-foreground" />
          DPP Practice
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {enrollment.institute_name}
          {enrollment.batch_name ? ` · ${enrollment.batch_name}` : ""}
        </p>
      </div>

      {dpps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-3xl p-10 text-center text-sm text-muted-foreground"
        >
          No DPPs posted for your batch yet.
        </motion.div>
      ) : (
        <div className="space-y-3">
          {dpps.map((dpp, i) => {
            const isDone = dpp.test_id ? completed.has(dpp.test_id) : false;
            return (
              <motion.div
                key={dpp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -2 }}
                className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-primary/40 hover:shadow-[0_10px_26px_rgba(47,107,255,0.1)] transition-[border-color,box-shadow]"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    {dpp.kind === "file" ? (
                      <FileText className="w-4 h-4 text-foreground/70" />
                    ) : (
                      <ClipboardList className="w-4 h-4 text-foreground/70" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{dpp.title}</p>
                    {dpp.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{dpp.description}</p>
                    )}
                    {dpp.due_date && (
                      <p className="text-[10px] text-muted-foreground mt-1">Due {dpp.due_date}</p>
                    )}
                  </div>
                </div>

                {dpp.kind === "file" ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => openFileDpp(dpp)}
                    className="shrink-0 text-xs font-semibold bg-accent hover:bg-accent/70 text-foreground px-4 py-2 rounded-lg transition-colors"
                  >
                    View file
                  </motion.button>
                ) : isDone ? (
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </motion.span>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => startQuestionsDpp(dpp)}
                    disabled={starting === dpp.id}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    {starting === dpp.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    Practice
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
