import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  StudentDashboardView,
  type AttemptSummary,
  type BatchTest,
  type ChapterAccuracy,
  type RecentAttempt,
  type SubjectAccuracy,
  type TypeBreakdown,
  type UpcomingDpp,
} from "@/components/dashboard/StudentDashboardView";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const targetExam = (user.user_metadata?.target_exam as string) ?? null;
  const displayName = (user.user_metadata?.full_name as string) ?? "";

  const [{ data: allAttempts }, { data: enrollmentRows }] = await Promise.all([
    supabase
      .from("test_attempts")
      .select("id, test_id, test_type, mode, subject_id, correct_count, total_questions, started_at, submitted_at")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(150),
    supabase.rpc("my_institute_enrollment"),
  ]);

  const enrollment = enrollmentRows?.[0] ?? null;
  const submittedAttempts = (allAttempts ?? []).filter((a) => a.submitted_at);

  // --- test titles for submitted attempts + recent-attempts table ---
  const attemptTestIds = Array.from(
    new Set(submittedAttempts.map((a) => a.test_id).filter((id): id is string => !!id))
  );
  const { data: attemptTestRows } = attemptTestIds.length
    ? await supabase.from("tests").select("id, title").in("id", attemptTestIds)
    : { data: [] as { id: string; title: string }[] };
  const titleById = new Map((attemptTestRows ?? []).map((t) => [t.id, t.title]));
  const completedTestIds = new Set((allAttempts ?? []).map((a) => a.test_id).filter((id): id is string => !!id));

  const attempts: AttemptSummary[] = submittedAttempts.map((a) => ({
    id: a.id,
    testId: a.test_id,
    title: a.test_id ? titleById.get(a.test_id) ?? "Test" : "Test",
    testType: a.test_type,
    pct: a.total_questions > 0 ? (a.correct_count / a.total_questions) * 100 : 0,
    submittedAt: a.submitted_at as string,
  }));

  const recentAttempts: RecentAttempt[] = submittedAttempts.slice(0, 8).map((a) => ({
    id: a.id,
    title: a.test_id ? titleById.get(a.test_id) ?? "Test" : "Test",
    testType: a.test_type,
    correct: a.correct_count,
    total: a.total_questions,
    pct: a.total_questions > 0 ? Math.round((a.correct_count / a.total_questions) * 100) : 0,
    submittedAt: a.submitted_at as string,
  }));

  // --- breakdown by test type (mock/dpp/pyq/etc) ---
  const typeGroups = new Map<string, { sum: number; count: number }>();
  for (const a of submittedAttempts) {
    if (a.total_questions <= 0) continue;
    const g = typeGroups.get(a.test_type) ?? { sum: 0, count: 0 };
    g.sum += (a.correct_count / a.total_questions) * 100;
    g.count += 1;
    typeGroups.set(a.test_type, g);
  }
  const typeBreakdown: TypeBreakdown[] = Array.from(typeGroups.entries()).map(([type, g]) => ({
    type,
    avgPct: Math.round(g.sum / g.count),
    count: g.count,
  }));

  // --- streak: consecutive days (ending today or yesterday) with a submitted attempt ---
  const attemptDates = new Set(
    submittedAttempts.map((a) => new Date(a.submitted_at as string).toDateString())
  );
  let streakDays = 0;
  {
    const cursor = new Date();
    // allow the streak to still count if today has no attempt yet, starting from yesterday
    if (!attemptDates.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    while (attemptDates.has(cursor.toDateString())) {
      streakDays += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // --- subject & chapter accuracy from real answer history ---
  const attemptIds = (allAttempts ?? []).map((a) => a.id);
  const { data: answerRows } = attemptIds.length
    ? await supabase.from("answers").select("question_id, is_correct").in("test_attempt_id", attemptIds).limit(4000)
    : { data: [] as { question_id: string; is_correct: boolean | null }[] };

  const answeredQuestionIds = Array.from(new Set((answerRows ?? []).map((a) => a.question_id)));
  const { data: answeredQuestions } = answeredQuestionIds.length
    ? await supabase.from("questions").select("id, subject_id, chapter_id").in("id", answeredQuestionIds)
    : { data: [] as { id: string; subject_id: string; chapter_id: string | null }[] };
  const questionMeta = new Map((answeredQuestions ?? []).map((q) => [q.id, q]));

  const subjIds = Array.from(new Set((answeredQuestions ?? []).map((q) => q.subject_id)));
  const chapIds = Array.from(
    new Set((answeredQuestions ?? []).map((q) => q.chapter_id).filter((id): id is string => !!id))
  );
  const [{ data: subjectRows }, { data: chapterRows }] = await Promise.all([
    subjIds.length
      ? supabase.from("subjects").select("id, name").in("id", subjIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    chapIds.length
      ? supabase.from("chapters").select("id, name, subject_id").in("id", chapIds)
      : Promise.resolve({ data: [] as { id: string; name: string; subject_id: string }[] }),
  ]);
  const subjectNameById = new Map((subjectRows ?? []).map((s) => [s.id, s.name]));
  const chapterNameById = new Map((chapterRows ?? []).map((c) => [c.id, c.name]));

  const subjectTally = new Map<string, { correct: number; total: number }>();
  const chapterTally = new Map<string, { correct: number; total: number; subjectId: string }>();

  for (const ans of answerRows ?? []) {
    const q = questionMeta.get(ans.question_id);
    if (!q) continue;
    const sTally = subjectTally.get(q.subject_id) ?? { correct: 0, total: 0 };
    sTally.total += 1;
    if (ans.is_correct) sTally.correct += 1;
    subjectTally.set(q.subject_id, sTally);

    if (q.chapter_id) {
      const cTally = chapterTally.get(q.chapter_id) ?? { correct: 0, total: 0, subjectId: q.subject_id };
      cTally.total += 1;
      if (ans.is_correct) cTally.correct += 1;
      chapterTally.set(q.chapter_id, cTally);
    }
  }

  const subjectAccuracy: SubjectAccuracy[] = Array.from(subjectTally.entries())
    .map(([subjectId, t]) => ({
      subjectId,
      subjectName: subjectNameById.get(subjectId) ?? "Unknown",
      correct: t.correct,
      total: t.total,
    }))
    .sort((a, b) => b.total - a.total);

  const weakChapters: ChapterAccuracy[] = Array.from(chapterTally.entries())
    .map(([chapterId, t]) => ({
      chapterId,
      chapterName: chapterNameById.get(chapterId) ?? "Unknown",
      subjectName: subjectNameById.get(t.subjectId) ?? "",
      correct: t.correct,
      total: t.total,
    }))
    .filter((c) => c.total >= 3)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 5);

  const totalQuestionsAnswered = (answerRows ?? []).length;
  const totalCorrect = (answerRows ?? []).filter((a) => a.is_correct).length;

  // --- institute batch content ---
  let upcomingDpps: UpcomingDpp[] = [];
  let batchTests: BatchTest[] = [];
  let instituteName: string | null = null;
  let batchName: string | null = null;

  if (enrollment?.status === "active" && enrollment.batch_id) {
    instituteName = enrollment.institute_name;
    batchName = enrollment.batch_name;

    const [{ data: dppRows }, { data: testRows }] = await Promise.all([
      supabase
        .from("dpps")
        .select("id, title, due_date, kind, test_id")
        .eq("batch_id", enrollment.batch_id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("tests")
        .select("id, title, subject_id")
        .eq("batch_id", enrollment.batch_id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    upcomingDpps = (dppRows ?? []).map((d) => ({
      id: d.id,
      title: d.title,
      dueDate: d.due_date,
      kind: d.kind as "questions" | "file",
      done: d.test_id ? completedTestIds.has(d.test_id) : false,
    }));

    const batchSubjectIds = Array.from(
      new Set((testRows ?? []).map((t) => t.subject_id).filter((id): id is string => !!id))
    );
    const { data: batchSubjectRows } = batchSubjectIds.length
      ? await supabase.from("subjects").select("id, name").in("id", batchSubjectIds)
      : { data: [] as { id: string; name: string }[] };
    const batchSubjectNameById = new Map((batchSubjectRows ?? []).map((s) => [s.id, s.name]));

    batchTests = (testRows ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      subjectName: t.subject_id ? batchSubjectNameById.get(t.subject_id) ?? null : null,
      attempted: completedTestIds.has(t.id),
    }));
  }

  return (
    <StudentDashboardView
      data={{
        displayName,
        targetExam,
        attempts,
        instituteName,
        batchName,
        enrollmentStatus: enrollment?.status ?? null,
        upcomingDpps,
        batchTests,
        totalQuestionsAnswered,
        totalCorrect,
        streakDays,
        subjectAccuracy,
        weakChapters,
        typeBreakdown,
        recentAttempts,
      }}
    />
  );
}
