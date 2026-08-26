"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Result = {
  title: string;
  correctCount: number;
  totalQuestions: number;
  score: number;
  submitted: boolean;
};

export default function ResultView({ attemptId }: { attemptId: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/sign-in?next=/test/${attemptId}/result`);
      return;
    }

    (async () => {
      const { data: attempt, error: attemptErr } = await supabase
        .from("test_attempts")
        .select("user_id, test_id, correct_count, total_questions, score, submitted_at")
        .eq("id", attemptId)
        .single();

      if (attemptErr || !attempt) {
        setError("This test could not be found.");
        return;
      }
      if (attempt.user_id !== user.id) {
        setError("This test does not belong to your account.");
        return;
      }

      let title = "Practice Test";
      if (attempt.test_id) {
        const { data: test } = await supabase
          .from("tests")
          .select("title")
          .eq("id", attempt.test_id)
          .single();
        if (test?.title) title = test.title;
      }

      setResult({
        title,
        correctCount: attempt.correct_count,
        totalQuestions: attempt.total_questions,
        score: attempt.score,
        submitted: !!attempt.submitted_at,
      });
    })();
  }, [attemptId, authLoading, user, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <p className="text-sm text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#1b3a5c]" size={28} />
      </div>
    );
  }

  const pct =
    result.totalQuestions > 0 ? Math.round((result.correctCount / result.totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-[#1b3a5c] via-[#2c5a8c] to-[#1b3a5c] shrink-0" />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-lg border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 text-center">
          {result.submitted ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#3f9142] mb-2">
                Submitted
              </p>
              <h1 className="text-xl font-bold mb-6">{result.title}</h1>
              <p className="text-5xl font-bold text-[#1b3a5c] mb-1">{pct}%</p>
              <p className="text-sm text-[#666] mb-6">
                {result.correctCount} correct out of {result.totalQuestions}
              </p>
              <p className="text-sm text-[#666] mb-8">Score: {result.score}</p>
            </>
          ) : (
            <p className="text-sm text-[#666] mb-8">This attempt hasn&apos;t been submitted yet.</p>
          )}
          <Link
            href="/dashboard/student/tests"
            className="inline-block rounded bg-[#1b3a5c] text-white text-sm font-semibold px-6 py-2.5 hover:brightness-110 transition-[filter]"
          >
            Back to tests
          </Link>
        </div>
      </main>
    </div>
  );
}
