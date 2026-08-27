"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BookOpen, Building2, Layers, Sparkles, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useInstituteContextForStudent } from "@/lib/institute-student";
import { buildImprovementTest } from "@/lib/improvement-test";

export function TestsHubClient() {
  const { user } = useAuth();
  const router = useRouter();
  const { enrollment, isLoading } = useInstituteContextForStudent();
  const [buildingImprovement, setBuildingImprovement] = useState(false);

  const isEnrolled = enrollment?.status === "active";

  const startImprovementTest = async () => {
    if (!user || buildingImprovement) return;
    setBuildingImprovement(true);
    try {
      const attemptId = await buildImprovementTest(user.id);
      router.push(`/test/${attemptId}/instructions`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not build your improvement test");
    } finally {
      setBuildingImprovement(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mock Tests</h1>
        <p className="text-muted-foreground mt-2">Pick where your questions come from, then build your test.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SourceCard
          index={0}
          icon={<BookOpen className="w-5 h-5" />}
          title="PYQ Library"
          description="Official previous-year questions across every supported exam."
          href="/dashboard/student/tests/new?source=pyq"
        />

        <SourceCard
          index={1}
          icon={<Building2 className="w-5 h-5" />}
          title="Institution Question Bank"
          description="Questions and DPPs from your enrolled institute - faculty-authored, not something you browse ahead of time."
          href="/dashboard/student/tests/new?source=institute"
          locked={!isLoading && !isEnrolled}
          lockedReason="Enroll with your institute's join code to unlock this."
        />

        <SourceCard
          index={2}
          icon={<Layers className="w-5 h-5" />}
          title="PYQ + Institution Combined"
          description="Mix both pools into one test."
          href="/dashboard/student/tests/new?source=both"
          locked={!isLoading && !isEnrolled}
          lockedReason="Enroll with your institute's join code to unlock this."
        />

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 3 * 0.08 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={startImprovementTest}
          disabled={buildingImprovement}
          className="group text-left rounded-2xl border border-border bg-gradient-to-br from-card to-background p-5 hover:border-primary/50 hover:shadow-[0_12px_30px_rgba(47,107,255,0.12)] transition-[border-color,box-shadow] disabled:opacity-60"
        >
          <motion.div
            className="w-10 h-10 rounded-xl q-gradient-bg text-white flex items-center justify-center mb-3"
            animate={buildingImprovement ? {} : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {buildingImprovement ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          </motion.div>
          <h3 className="font-semibold text-foreground flex items-center gap-1.5">
            Improvement Test
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-built from the chapters where you've made mistakes before.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 group-hover:gap-2 transition-all">
            {buildingImprovement ? "Building…" : "Start now"} <ArrowRight className="w-3 h-3" />
          </span>
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-2">
        <Link href="/dashboard/student/pyq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Just want to browse? Open the PYQ Library →
        </Link>
      </motion.div>
    </div>
  );
}

function SourceCard({
  index,
  icon,
  title,
  description,
  href,
  locked,
  lockedReason,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  locked?: boolean;
  lockedReason?: string;
}) {
  if (locked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className="rounded-2xl border border-dashed border-border bg-card/50 p-5 opacity-70"
      >
        <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mb-3">
          <Lock className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{lockedReason ?? description}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className="group block rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-[0_12px_30px_rgba(47,107,255,0.1)] transition-[border-color,box-shadow]"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 group-hover:gap-2 transition-all">
          Build a test <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    </motion.div>
  );
}
