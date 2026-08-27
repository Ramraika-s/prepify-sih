"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlayCircle, Target, TrendingUp, CalendarDays, ClipboardList,
  FileText, Flame, ListChecks, AlertTriangle,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ExamCountdownCard } from "@/components/dashboard/ExamCountdownCard";

export type AttemptSummary = {
  id: string;
  testId: string | null;
  title: string;
  testType: string;
  pct: number;
  submittedAt: string;
};

export type UpcomingDpp = {
  id: string;
  title: string;
  dueDate: string | null;
  kind: "questions" | "file";
  done: boolean;
};

export type BatchTest = {
  id: string;
  title: string;
  subjectName: string | null;
  attempted: boolean;
};

export type SubjectAccuracy = { subjectId: string; subjectName: string; correct: number; total: number };
export type ChapterAccuracy = {
  chapterId: string;
  chapterName: string;
  subjectName: string;
  correct: number;
  total: number;
};
export type TypeBreakdown = { type: string; avgPct: number; count: number };
export type RecentAttempt = {
  id: string;
  title: string;
  testType: string;
  correct: number;
  total: number;
  pct: number;
  submittedAt: string;
};

export type StudentDashboardData = {
  displayName: string;
  targetExam: string | null;
  attempts: AttemptSummary[];
  instituteName: string | null;
  batchName: string | null;
  enrollmentStatus: "pending" | "active" | "rejected" | "removed" | null;
  upcomingDpps: UpcomingDpp[];
  batchTests: BatchTest[];
  totalQuestionsAnswered: number;
  totalCorrect: number;
  streakDays: number;
  subjectAccuracy: SubjectAccuracy[];
  weakChapters: ChapterAccuracy[];
  typeBreakdown: TypeBreakdown[];
  recentAttempts: RecentAttempt[];
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] as const },
  }),
};

const listItemIn: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
};

const TYPE_LABEL: Record<string, string> = {
  full: "Full syllabus",
  subject: "Subject",
  chapter: "Chapter",
  topic: "Topic",
  daily_pyq: "Daily PYQ",
  custom: "Custom",
  pyq: "PYQ",
  dpp: "DPP",
};

function StatTile({
  index,
  label,
  value,
  suffix,
  sub,
  icon,
}: {
  index: number;
  label: string;
  value: number | null;
  suffix?: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div variants={cardIn} initial="hidden" animate="show" custom={index} whileHover={{ y: -3 }}>
      <Card className="bg-card border-border hover:border-foreground/20 transition-colors h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {value === null ? "-" : <AnimatedNumber value={value} suffix={suffix ?? ""} />}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StudentDashboardView({ data }: { data: StudentDashboardData }) {
  const { attempts, upcomingDpps, batchTests, subjectAccuracy, weakChapters, typeBreakdown, recentAttempts } = data;

  const totalAttempts = attempts.length;
  const avgAccuracy = totalAttempts ? Math.round(attempts.reduce((s, a) => s + a.pct, 0) / totalAttempts) : null;
  const bestScore = totalAttempts ? Math.round(Math.max(...attempts.map((a) => a.pct))) : null;
  const chartData = [...attempts].slice(0, 10).reverse().map((a) => ({ name: a.title.slice(0, 14), pct: Math.round(a.pct) }));
  const subjectChartData = subjectAccuracy.map((s) => ({
    name: s.subjectName,
    pct: Math.round((s.correct / s.total) * 100),
    total: s.total,
  }));

  const isEnrolled = data.enrollmentStatus === "active";

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back{data.displayName ? `, ${data.displayName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-2">Here's what your real history says - no filler.</p>
      </motion.div>

      {/* Exam countdown */}
      <motion.div variants={cardIn} initial="hidden" animate="show" custom={0}>
        <ExamCountdownCard targetExam={data.targetExam} />
        <Link href="/dashboard/student/tests" className="inline-block mt-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button className="q-gradient-bg text-white border-0 hover:brightness-110">
              <PlayCircle className="mr-2 h-4 w-4" /> Start a test
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      {/* Stat tiles - real numbers only */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatTile index={1} label="Avg. accuracy" value={avgAccuracy} suffix="%" sub={totalAttempts ? `${totalAttempts} attempts` : "No tests yet"} icon={<Target className="h-4 w-4 text-emerald-500" />} />
        <StatTile index={2} label="Best score" value={bestScore} suffix="%" sub="personal best" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} />
        <StatTile index={3} label="Questions answered" value={data.totalQuestionsAnswered} sub={`${data.totalCorrect} correct`} icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} />
        <StatTile index={4} label="Day streak" value={data.streakDays} sub="consecutive practice days" icon={<Flame className="h-4 w-4 text-orange-500" />} />
        <StatTile index={5} label="Tests submitted" value={totalAttempts} sub="all time" icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />} />
      </div>

      {/* Subject accuracy + score progression */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle>Accuracy by subject</CardTitle>
              <CardDescription>From every question you've actually answered.</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
              {subjectChartData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-center px-6">
                  <p className="text-sm text-muted-foreground">Answer some questions and this fills in.</p>
                </div>
              ) : (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                      <XAxis dataKey="name" className="fill-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis className="fill-muted-foreground" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--popover-foreground)" }} />
                      <Bar dataKey="pct" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800}>
                        {subjectChartData.map((s, i) => (
                          <Cell key={i} fill={s.pct >= 70 ? "#10b981" : s.pct >= 45 ? "#2f6bff" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle>Score progression</CardTitle>
              <CardDescription>Your last {chartData.length || 0} submitted attempts.</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
              {chartData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-center px-6">
                  <p className="text-sm text-muted-foreground">No submitted tests yet.</p>
                </div>
              ) : (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                      <XAxis dataKey="name" className="fill-muted-foreground" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis className="fill-muted-foreground" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--popover-foreground)" }} />
                      <Line type="monotone" dataKey="pct" stroke="#2f6bff" strokeWidth={2} dot={{ r: 4, fill: "var(--card)", stroke: "#2f6bff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#2f6bff" }} isAnimationActive animationDuration={900} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weak chapters + type breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Weakest chapters
              </CardTitle>
              <CardDescription>Lowest accuracy, minimum 3 questions attempted.</CardDescription>
            </CardHeader>
            <CardContent>
              {weakChapters.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not enough data yet - attempt a few more tests.</p>
              ) : (
                <ul className="space-y-3">
                  {weakChapters.map((c, i) => {
                    const pct = Math.round((c.correct / c.total) * 100);
                    return (
                      <motion.li key={c.chapterId} variants={listItemIn} initial="hidden" animate="show" custom={i}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-foreground">
                            {c.chapterName}
                            <span className="text-muted-foreground"> · {c.subjectName}</span>
                          </span>
                          <span className="text-xs font-semibold text-red-500">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full bg-red-500/70"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                          />
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
              <Link href="/dashboard/student/tests" className="inline-block mt-4 text-xs font-semibold text-primary hover:underline">
                Practice these in an Improvement Test →
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle>By test type</CardTitle>
              <CardDescription>Average score, grouped by how the test was built.</CardDescription>
            </CardHeader>
            <CardContent>
              {typeBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground">No submitted tests yet.</p>
              ) : (
                <ul className="space-y-3">
                  {typeBreakdown.map((t, i) => (
                    <motion.li key={t.type} variants={listItemIn} initial="hidden" animate="show" custom={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{TYPE_LABEL[t.type] ?? t.type}</span>
                      <span className="text-xs text-muted-foreground">{t.count} test{t.count === 1 ? "" : "s"}</span>
                      <span className="text-xs font-semibold text-foreground w-10 text-right">{t.avgPct}%</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent attempts + what's next */}
      <div className="grid gap-4 lg:grid-cols-7">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="lg:col-span-4">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle>Recent attempts</CardTitle>
              <CardDescription>Your last {recentAttempts.length} submitted tests.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAttempts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {recentAttempts.map((a, i) => (
                    <motion.li
                      key={a.id}
                      variants={listItemIn}
                      initial="hidden"
                      animate="show"
                      custom={i}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {TYPE_LABEL[a.testType] ?? a.testType} · {new Date(a.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ml-3 ${a.pct >= 70 ? "text-emerald-500" : a.pct >= 45 ? "text-foreground" : "text-red-500"}`}>
                        {a.correct}/{a.total} · {a.pct}%
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }} className="lg:col-span-3">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle>What's next</CardTitle>
              <CardDescription>
                {isEnrolled ? `${data.instituteName ?? "Your institute"}${data.batchName ? ` · ${data.batchName}` : ""}` : "Tests and DPPs assigned to you"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {!isEnrolled ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    You're not enrolled with an institute yet, so there's nothing assigned to you.
                  </p>
                  <Link href="/dashboard/student/profile" className="text-sm font-semibold text-primary hover:underline">
                    Enter your institute's join code →
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> New from your institute
                    </h4>
                    {batchTests.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nothing announced yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {batchTests.slice(0, 3).map((t, i) => (
                          <motion.li key={t.id} variants={listItemIn} initial="hidden" animate="show" custom={i} className="flex items-center justify-between text-sm">
                            <span className="text-foreground truncate">{t.title}</span>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">
                              {t.attempted ? "Attempted" : t.subjectName ?? "-"}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5" /> DPP deadlines
                    </h4>
                    {upcomingDpps.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No DPPs posted yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {upcomingDpps.slice(0, 4).map((d, i) => (
                          <motion.li key={d.id} variants={listItemIn} initial="hidden" animate="show" custom={i} className="flex items-center justify-between text-sm">
                            <span className={`truncate ${d.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{d.title}</span>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2 flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {d.dueDate ?? "no deadline"}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                    <Link href="/dashboard/student/dpp" className="inline-block mt-3 text-xs font-semibold text-primary hover:underline">
                      View all DPPs →
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
