"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { parseTargetExam } from "@/lib/exam-calendar";

type Remaining = { d: number; h: number; m: number; s: number };

function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block w-[1ch] overflow-hidden text-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 14, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, "0").split("").map(Number);
  return (
    <div className="flex flex-col items-center">
      <div className="flex text-3xl sm:text-4xl font-bold text-foreground tabular-nums font-mono">
        {digits.map((d, i) => (
          <Digit key={i} value={d} />
        ))}
      </div>
      <span className="mt-1 text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
    </div>
  );
}

export function ExamCountdownCard({ targetExam }: { targetExam: string | null }) {
  const parsed = useMemo(() => parseTargetExam(targetExam), [targetExam]);
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    if (!parsed) {
      setRemaining(null);
      return;
    }
    const tick = () => {
      const diff = Math.max(0, parsed.date.getTime() - Date.now());
      setRemaining({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [parsed]);

  if (!parsed) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between rounded-2xl border border-border bg-card px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">No target exam set</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pick one in your profile to see a countdown.</p>
          </div>
        </div>
        <Link
          href="/dashboard/student/profile"
          className="shrink-0 text-sm font-semibold text-primary hover:underline"
        >
          Set target exam →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">Countdown to</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{parsed.label}</p>
        </div>

        {remaining && (
          <div className="flex items-center gap-3 sm:gap-4">
            <Unit value={remaining.d} label="days" />
            <span className="text-muted-foreground/40 text-xl font-mono -mt-4">:</span>
            <Unit value={remaining.h} label="hrs" />
            <span className="text-muted-foreground/40 text-xl font-mono -mt-4">:</span>
            <Unit value={remaining.m} label="min" />
            <span className="text-muted-foreground/40 text-xl font-mono -mt-4">:</span>
            <Unit value={remaining.s} label="sec" />
          </div>
        )}
      </div>

      <Link
        href="/dashboard/student/profile"
        className="inline-block mt-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Change target exam →
      </Link>
    </div>
  );
}
