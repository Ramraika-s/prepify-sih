import { supabase } from "@/lib/supabase/client";
import { buildAndStartTest } from "@/lib/test-builder";

/**
 * Builds a test sampled from the chapters (falling back to subjects) where
 * the student has gotten questions wrong before, excluding the exact
 * questions they've already seen. Not an LLM call - a weakness-targeted
 * sampler over their own answer history.
 */
export async function buildImprovementTest(userId: string): Promise<string> {
  const { data: wrongAnswers, error: wrongErr } = await supabase
    .from("answers")
    .select("question_id, test_attempts!inner(user_id)")
    .eq("is_correct", false)
    .eq("test_attempts.user_id", userId)
    .limit(200);
  if (wrongErr) throw wrongErr;

  const wrongQuestionIds = Array.from(new Set((wrongAnswers ?? []).map((a) => a.question_id)));
  if (wrongQuestionIds.length === 0) {
    throw new Error("Complete a few tests first - we build this from questions you've gotten wrong.");
  }

  const { data: seenAnswers } = await supabase
    .from("answers")
    .select("question_id, test_attempts!inner(user_id)")
    .eq("test_attempts.user_id", userId)
    .limit(1000);
  const seenQuestionIds = Array.from(new Set((seenAnswers ?? []).map((a) => a.question_id)));

  const { data: wrongQuestions } = await supabase
    .from("questions")
    .select("id, subject_id, chapter_id")
    .in("id", wrongQuestionIds);

  const chapterIds = Array.from(
    new Set((wrongQuestions ?? []).map((q) => q.chapter_id).filter((id): id is string => !!id))
  );
  const subjectIds = Array.from(new Set((wrongQuestions ?? []).map((q) => q.subject_id)));

  return buildAndStartTest({
    userId,
    title: "Improvement Test - your weak areas",
    testType: "custom",
    mode: "practice",
    durationMinutes: 20,
    questionCount: 20,
    filters: {
      chapterIds: chapterIds.length ? chapterIds : undefined,
      subjectIds: chapterIds.length ? undefined : subjectIds,
      excludeQuestionIds: seenQuestionIds.length ? seenQuestionIds : undefined,
    },
  });
}
