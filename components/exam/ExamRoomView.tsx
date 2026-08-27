"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";

type QStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

type Option = { id: string; text: string };
type Question = { id: string; text: string; subjectId: string; subjectName: string; options: Option[] };

type AttemptData = {
  testId: string | null;
  title: string;
  mode: "timed" | "practice";
  durationSeconds: number;
  startedAt: string;
};

const STATUS_STYLES: Record<QStatus, string> = {
  "not-visited": "bg-white border border-black/25 text-[#1a1a1a]",
  "not-answered": "bg-[#d9534f] text-white",
  answered: "bg-[#3f9142] text-white",
  marked: "bg-[#7b3fa0] text-white",
  "answered-marked": "bg-[#7b3fa0] text-white ring-2 ring-[#3f9142] ring-offset-1",
};

function ExamTimer({ deadline, onExpire }: { deadline: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      const r = Math.max(0, deadline - Date.now());
      setRemaining(r);
      if (r <= 0) {
        clearInterval(id);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [deadline, onExpire]);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  return (
    <span className="font-mono font-semibold tabular-nums">
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

export default function ExamRoomView({ attemptId }: { attemptId: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [candidateName, setCandidateName] = useState("Candidate");
  const [loadError, setLoadError] = useState("");

  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [selectedMap, setSelectedMap] = useState<Record<string, string | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSubjectId, setActiveSubjectId] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [feedback, setFeedback] = useState<{
    questionId: string;
    isCorrect: boolean;
    correctOptionId: string;
    explanation: string;
  } | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ---- load attempt + questions + prior answers ----
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/sign-in?next=/test/${attemptId}`);
      return;
    }

    (async () => {
      const { data: attemptRow, error: attemptErr } = await supabase
        .from("test_attempts")
        .select("user_id, test_id, duration_seconds, mode, started_at, submitted_at")
        .eq("id", attemptId)
        .single();

      if (attemptErr || !attemptRow) {
        setLoadError("This test could not be found.");
        return;
      }
      if (attemptRow.user_id !== user.id) {
        setLoadError("This test does not belong to your account.");
        return;
      }
      if (attemptRow.submitted_at) {
        router.replace(`/test/${attemptId}/result`);
        return;
      }
      if (!attemptRow.test_id) {
        setLoadError("This test has no questions attached.");
        return;
      }

      const [{ data: profile }, { data: tq }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).single(),
        supabase
          .from("test_questions")
          .select("question_id, sort_order")
          .eq("test_id", attemptRow.test_id)
          .order("sort_order", { ascending: true }),
      ]);

      if (profile?.display_name) setCandidateName(profile.display_name);

      const questionIds = (tq ?? []).map((r) => r.question_id);
      if (questionIds.length === 0) {
        setLoadError("This test has no questions attached.");
        return;
      }

      const [{ data: qRows }, { data: oRows }] = await Promise.all([
        supabase.from("questions").select("id, question_text, subject_id").in("id", questionIds),
        supabase
          .from("options")
          .select("id, option_text, sort_order, question_id")
          .in("question_id", questionIds)
          .order("sort_order", { ascending: true }),
      ]);

      const subjectIds = Array.from(new Set((qRows ?? []).map((q) => q.subject_id)));
      const { data: subjectRows } = await supabase
        .from("subjects")
        .select("id, name")
        .in("id", subjectIds);
      const subjectNameById = new Map((subjectRows ?? []).map((s) => [s.id, s.name]));

      const questionById = new Map((qRows ?? []).map((q) => [q.id, q]));
      const optionsByQuestion = new Map<string, Option[]>();
      for (const o of oRows ?? []) {
        const list = optionsByQuestion.get(o.question_id) ?? [];
        list.push({ id: o.id, text: o.option_text });
        optionsByQuestion.set(o.question_id, list);
      }

      const ordered: Question[] = questionIds
        .map((qid) => questionById.get(qid))
        .filter((q): q is NonNullable<typeof q> => !!q)
        .map((q) => ({
          id: q.id,
          text: q.question_text,
          subjectId: q.subject_id,
          subjectName: subjectNameById.get(q.subject_id) ?? "General",
          options: optionsByQuestion.get(q.id) ?? [],
        }));

      const { data: answerRows } = await supabase
        .from("answers")
        .select("question_id, selected_option_id")
        .eq("test_attempt_id", attemptId);

      const seededSelected: Record<string, string | null> = {};
      const seededVisited = new Set<string>();
      for (const a of answerRows ?? []) {
        seededSelected[a.question_id] = a.selected_option_id;
        seededVisited.add(a.question_id);
      }

      let seededMarked = new Set<string>();
      try {
        const raw = sessionStorage.getItem(`exam-marks-${attemptId}`);
        if (raw) seededMarked = new Set(JSON.parse(raw) as string[]);
      } catch {
        // sessionStorage unavailable - marks just won't persist across a refresh
      }

      setQuestions(ordered);
      setSelectedMap(seededSelected);
      setVisited(seededVisited);
      setMarked(seededMarked);
      setActiveSubjectId(ordered[0]?.subjectId ?? "");
      setAttempt({
        testId: attemptRow.test_id,
        title: "Practice Test",
        mode: attemptRow.mode,
        durationSeconds: attemptRow.duration_seconds,
        startedAt: attemptRow.started_at,
      });

      const { data: test } = await supabase
        .from("tests")
        .select("title")
        .eq("id", attemptRow.test_id)
        .single();
      if (test?.title) setAttempt((a) => (a ? { ...a, title: test.title } : a));

      setVisited((v) => {
        const first = ordered[0];
        if (!first) return v;
        const next = new Set(v);
        next.add(first.id);
        return next;
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, authLoading, user]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`exam-marks-${attemptId}`, JSON.stringify(Array.from(marked)));
    } catch {
      // ignore
    }
  }, [attemptId, marked]);

  const subjectOrder = useMemo(() => {
    const seen = new Set<string>();
    const order: { id: string; name: string }[] = [];
    for (const q of questions) {
      if (!seen.has(q.subjectId)) {
        seen.add(q.subjectId);
        order.push({ id: q.subjectId, name: q.subjectName });
      }
    }
    return order;
  }, [questions]);

  const statusOf = useCallback(
    (qid: string): QStatus => {
      const hasAnswer = !!selectedMap[qid];
      const isMarked = marked.has(qid);
      if (isMarked) return hasAnswer ? "answered-marked" : "marked";
      if (hasAnswer) return "answered";
      if (visited.has(qid)) return "not-answered";
      return "not-visited";
    },
    [selectedMap, marked, visited]
  );

  const counts = useMemo(() => {
    const c = { "not-visited": 0, "not-answered": 0, answered: 0, marked: 0, "answered-marked": 0 };
    for (const q of questions) c[statusOf(q.id)]++;
    return c;
  }, [questions, statusOf]);

  const currentQuestion = questions[currentIndex];

  const visit = useCallback((index: number) => {
    setCurrentIndex(index);
    setFeedback(null);
    setQuestions((qs) => {
      const q = qs[index];
      if (q) setVisited((v) => (v.has(q.id) ? v : new Set(v).add(q.id)));
      return qs;
    });
  }, []);

  const saveAnswer = async (questionId: string, optionId: string) => {
    const { data, error } = await supabase.rpc("submit_answer", {
      _attempt_id: attemptId,
      _question_id: questionId,
      _option_id: optionId,
    });
    if (error) {
      toast.error(error.message || "Could not save your answer.");
      return null;
    }
    return data?.[0] ?? null;
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) visit(currentIndex + 1);
  };
  const goBack = () => {
    if (currentIndex > 0) visit(currentIndex - 1);
  };

  const selectOption = (questionId: string, optionId: string) => {
    setSelectedMap((m) => ({ ...m, [questionId]: m[questionId] === optionId ? null : optionId }));
    setFeedback(null);
  };

  const handleSaveNext = async () => {
    if (!currentQuestion) return;
    const opt = selectedMap[currentQuestion.id];
    if (opt) {
      const result = await saveAnswer(currentQuestion.id, opt);
      if (result && attempt?.mode === "practice") {
        setFeedback({
          questionId: currentQuestion.id,
          isCorrect: result.is_correct,
          correctOptionId: result.correct_option_id,
          explanation: result.explanation,
        });
        return;
      }
    }
    goNext();
  };

  const handleSaveMark = async () => {
    if (!currentQuestion) return;
    const opt = selectedMap[currentQuestion.id];
    if (opt) await saveAnswer(currentQuestion.id, opt);
    setMarked((s) => new Set(s).add(currentQuestion.id));
  };

  const handleMarkNext = async () => {
    if (!currentQuestion) return;
    const opt = selectedMap[currentQuestion.id];
    if (opt) await saveAnswer(currentQuestion.id, opt);
    setMarked((s) => new Set(s).add(currentQuestion.id));
    goNext();
  };

  const handleClear = () => {
    if (!currentQuestion) return;
    setSelectedMap((m) => ({ ...m, [currentQuestion.id]: null }));
    setFeedback(null);
  };

  const finalizeAndGo = useCallback(async () => {
    const { error } = await supabase.rpc("finalize_attempt", { _attempt_id: attemptId });
    if (error) {
      toast.error(error.message || "Could not submit your test.");
      return;
    }
    try {
      sessionStorage.removeItem(`exam-marks-${attemptId}`);
    } catch {
      // ignore
    }
    router.replace(`/test/${attemptId}/result`);
  }, [attemptId, router]);

  const handleAutoSubmit = useCallback(() => {
    toast.message("Time's up - submitting your test.");
    void finalizeAndGo();
  }, [finalizeAndGo]);

  const handleSubmit = async () => {
    setSubmitting(true);
    await finalizeAndGo();
    setSubmitting(false);
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <p className="text-sm text-red-600 font-medium">{loadError}</p>
      </div>
    );
  }

  if (!attempt || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#1b3a5c]" size={28} />
      </div>
    );
  }

  const deadline = new Date(attempt.startedAt).getTime() + attempt.durationSeconds * 1000;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a1a] select-text">
      <Toaster position="top-center" />

      {/* Orange subject bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[#f39325] px-5 py-2.5 text-white">
        <span className="font-bold text-sm tracking-wide uppercase shrink-0">{attempt.title}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {subjectOrder.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveSubjectId(s.id);
                const idx = questions.findIndex((q) => q.subjectId === s.id);
                if (idx >= 0) visit(idx);
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase transition-colors ${
                activeSubjectId === s.id ? "bg-[#1b3a5c] text-white" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs flex items-center gap-2">
          <span className="opacity-90">Paper Language:</span>
          <select defaultValue="English" className="text-[#1a1a1a] rounded px-2 py-1 text-xs">
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Candidate / timer bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-black/10 bg-[#fafafa]">
        <div className="flex items-center gap-2 text-[#1b3a5c] font-bold text-base">
          <span className="w-7 h-7 rounded-full bg-[#1b3a5c] text-white flex items-center justify-center text-sm">
            P
          </span>
          Quero - CBT Practice
        </div>
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div className="w-9 h-9 rounded border border-black/20 flex items-center justify-center text-base shrink-0">
            &#128100;
          </div>
          <div className="leading-tight">
            <div>
              Candidate Name : <strong>{candidateName}</strong>
            </div>
            <div>
              Subject Name &nbsp;: <strong>{attempt.title}</strong>
            </div>
          </div>
          {attempt.mode === "timed" ? (
            <div className="flex items-center gap-1.5">
              <span>Remaining Time :</span>
              <span className="bg-[#1b3a5c] text-white rounded px-2.5 py-1">
                <ExamTimer deadline={deadline} onExpire={handleAutoSubmit} />
              </span>
            </div>
          ) : (
            <span className="bg-[#3f9142] text-white rounded px-2.5 py-1 text-xs font-semibold">
              Practice mode
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Question panel */}
        <div className="flex-1 flex flex-col p-5 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">Question {currentIndex + 1}:</h2>
            {!paletteOpen && (
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="text-xs px-2 py-1 rounded border border-black/20 hover:bg-black/5"
              >
                &lt; Show palette
              </button>
            )}
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap mb-6">{currentQuestion.text}</p>

          <div className="flex flex-col gap-3 max-w-2xl">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedMap[currentQuestion.id] === opt.id;
              const isFeedback = feedback?.questionId === currentQuestion.id;
              const isCorrectOpt = isFeedback && opt.id === feedback.correctOptionId;
              const isWrongSelected = isFeedback && isSelected && !feedback.isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isFeedback}
                  onClick={() => selectOption(currentQuestion.id, opt.id)}
                  className={`flex items-start gap-3 text-left text-sm rounded border px-4 py-3 transition-colors ${
                    isCorrectOpt
                      ? "border-[#3f9142] bg-[#3f9142]/10"
                      : isWrongSelected
                        ? "border-[#d9534f] bg-[#d9534f]/10"
                        : isSelected
                          ? "border-[#1b3a5c] bg-[#1b3a5c]/5"
                          : "border-black/15 hover:border-black/30"
                  }`}
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-semibold ${
                      isSelected ? "border-[#1b3a5c] bg-[#1b3a5c] text-white" : "border-black/30"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`mt-4 max-w-2xl rounded border px-4 py-3 text-sm ${
                feedback.isCorrect
                  ? "border-[#3f9142] bg-[#3f9142]/10 text-[#255c29]"
                  : "border-[#d9534f] bg-[#d9534f]/10 text-[#7a2a27]"
              }`}
            >
              <p className="font-semibold mb-1">{feedback.isCorrect ? "Correct!" : "Not quite."}</p>
              {feedback.explanation && <p className="leading-relaxed">{feedback.explanation}</p>}
              <button
                type="button"
                onClick={goNext}
                className="mt-3 text-xs font-semibold underline underline-offset-2"
              >
                Continue
              </button>
            </div>
          )}

          <div className="mt-auto pt-8 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleSaveNext}
              className="bg-[#3f9142] text-white text-xs font-bold px-4 py-2.5 rounded hover:brightness-105"
            >
              SAVE &amp; NEXT
            </button>
            <button
              type="button"
              onClick={handleSaveMark}
              className="bg-[#e08a1e] text-white text-xs font-bold px-4 py-2.5 rounded hover:brightness-105"
            >
              SAVE &amp; MARK FOR REVIEW
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-white text-[#1a1a1a] text-xs font-bold px-4 py-2.5 rounded border border-black/20 hover:bg-black/5"
            >
              CLEAR RESPONSE
            </button>
            <button
              type="button"
              onClick={handleMarkNext}
              className="bg-[#3b5c99] text-white text-xs font-bold px-4 py-2.5 rounded hover:brightness-105"
            >
              MARK FOR REVIEW &amp; NEXT
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
            <button
              type="button"
              onClick={goBack}
              disabled={currentIndex === 0}
              className="text-xs font-bold px-4 py-2 rounded border border-black/20 disabled:opacity-40"
            >
              &lt;&lt; BACK
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goNext}
                disabled={currentIndex === questions.length - 1}
                className="text-xs font-bold px-4 py-2 rounded border border-black/20 disabled:opacity-40"
              >
                NEXT &gt;&gt;
              </button>
              <button
                type="button"
                onClick={() => setSubmitOpen(true)}
                className="text-xs font-bold px-5 py-2 rounded bg-[#3f9142] text-white hover:brightness-105"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>

        {/* Palette */}
        {paletteOpen && (
          <aside className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-black/10 p-4 bg-[#fbfbfb]">
            <button
              type="button"
              onClick={() => setPaletteOpen(false)}
              className="mb-3 text-xs px-2 py-1 rounded border border-black/20 hover:bg-black/5"
            >
              Hide palette &gt;
            </button>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] mb-4">
              <LegendRow color="bg-white border border-black/25" label="Not Visited" count={counts["not-visited"]} />
              <LegendRow color="bg-[#d9534f]" label="Not Answered" count={counts["not-answered"]} />
              <LegendRow color="bg-[#3f9142]" label="Answered" count={counts.answered} />
              <LegendRow color="bg-[#7b3fa0]" label="Marked" count={counts.marked} />
              <LegendRow
                color="bg-[#7b3fa0] ring-2 ring-[#3f9142]"
                label="Answered & Marked"
                count={counts["answered-marked"]}
              />
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => visit(i)}
                  className={`aspect-square rounded text-[11px] font-bold flex items-center justify-center transition-transform hover:scale-105 ${
                    STATUS_STYLES[statusOf(q.id)]
                  } ${i === currentIndex ? "outline outline-2 outline-offset-1 outline-[#1a1a1a]" : ""}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>

      <AlertDialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit test?</AlertDialogTitle>
            <AlertDialogDescription>
              {counts.answered + counts["answered-marked"]} of {questions.length} questions answered,{" "}
              {counts["not-answered"]} not answered, {counts.marked + counts["answered-marked"]} marked
              for review. Once submitted, you cannot change your answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep working</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function LegendRow({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3.5 h-3.5 rounded-sm shrink-0 ${color}`} />
      <span className="text-[#333]">
        {label} ({count})
      </span>
    </div>
  );
}
