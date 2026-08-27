"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { rpc } from "@/lib/supabase-rpc";

type Enrollment = {
  enrollment_id: string;
  institute_id: string;
  institute_name: string;
  batch_id: string | null;
  batch_name: string | null;
  status: "pending" | "active" | "rejected" | "removed";
  requested_at: string;
};

export function InstituteEnrollmentCard() {
  const [enrollment, setEnrollment] = useState<Enrollment | null | undefined>(undefined);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const { data, error } = await rpc<Enrollment[]>("my_institute_enrollment");
    if (error) return;
    setEnrollment(data?.[0] ?? null);
  };

  useEffect(() => {
    load();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    const { error } = await rpc("join_institute_by_code", { _code: code.trim() });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setCode("");
    await load();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
    >
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
        <Building2 className="w-5 h-5 text-muted-foreground" />
        Institute Enrollment
      </h2>

      <AnimatePresence mode="wait">
        {enrollment === undefined ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 className="w-4 h-4 animate-spin" /> Checking your enrollment…
          </motion.div>
        ) : !enrollment || enrollment.status === "rejected" || enrollment.status === "removed" ? (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md space-y-3"
          >
            {enrollment?.status === "rejected" && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Your last request to join{" "}
                <strong>{enrollment.institute_name}</strong> was declined. You can try another code.
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Got a join code from your coaching institute? Enter it here to request enrollment. An
              institute admin will review it before you're added to a batch.
            </p>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB12CD34"
                maxLength={16}
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting || !code.trim()}
                className="bg-foreground text-background px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-50 shrink-0 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Join
              </motion.button>
            </form>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
                {error}
              </motion.p>
            )}
          </motion.div>
        ) : enrollment.status === "pending" ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 max-w-md"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            </motion.div>
            <div>
              <p className="text-sm text-foreground font-medium">
                Pending approval at {enrollment.institute_name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                An institute admin needs to approve your request and assign you to a batch. You'll be
                notified once that happens.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 300, damping: 24 }}
            className="flex items-start gap-3 max-w-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">
                Enrolled at {enrollment.institute_name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {enrollment.batch_name
                  ? `Batch: ${enrollment.batch_name}`
                  : "Waiting for your admin to assign you to a batch."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
