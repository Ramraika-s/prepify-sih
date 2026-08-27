"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";

type AttemptInfo = {
  title: string;
  durationSeconds: number;
  totalQuestions: number;
  mode: "timed" | "practice";
  alreadySubmitted: boolean;
};

const SYMBOL_LEGEND: { swatch: React.ReactNode; label: string }[] = [
  {
    swatch: <span className="inline-block w-6 h-6 rounded-sm border border-black/30 bg-white" />,
    label: "You have not visited the question yet.",
  },
  {
    swatch: <span className="inline-block w-6 h-6 rounded-sm bg-[#d9534f]" />,
    label: "You have not answered the question.",
  },
  {
    swatch: <span className="inline-block w-6 h-6 rounded-sm bg-[#3f9142]" />,
    label: "You have answered the question.",
  },
  {
    swatch: (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7b3fa0] text-white text-[11px] font-bold">
        ?
      </span>
    ),
    label: "You have NOT answered the question, but marked the question for review.",
  },
  {
    swatch: (
      <span className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7b3fa0] text-white">
        <svg viewBox="0 0 20 20" className="absolute -bottom-1 -right-1 w-3.5 h-3.5" aria-hidden="true">
          <circle cx="10" cy="10" r="10" fill="#3f9142" />
          <path d="M5.5 10.3l2.6 2.6L14.5 6.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    ),
    label: 'The question(s) "Answered and Marked for Review" will be considered for evaluation.',
  },
];

export default function InstructionsView({ attemptId }: { attemptId: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [info, setInfo] = useState<AttemptInfo | null>(null);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/sign-in?next=/test/${attemptId}/instructions`);
      return;
    }

    (async () => {
      const { data: attempt, error: attemptErr } = await supabase
        .from("test_attempts")
        .select("user_id, duration_seconds, total_questions, mode, submitted_at, test_id")
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

      setInfo({
        title,
        durationSeconds: attempt.duration_seconds,
        totalQuestions: attempt.total_questions,
        mode: attempt.mode,
        alreadySubmitted: !!attempt.submitted_at,
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

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#1b3a5c]" size={28} />
      </div>
    );
  }

  if (info.alreadySubmitted) {
    router.replace(`/test/${attemptId}/result`);
    return null;
  }

  const durationMinutes = Math.round(info.durationSeconds / 60);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-[#1b3a5c] via-[#2c5a8c] to-[#1b3a5c] shrink-0" />

      <div className="flex items-start justify-between px-6 py-4 border-b border-black/10">
        <h1 className="text-lg font-bold tracking-wide">GENERAL INSTRUCTIONS</h1>
        <div className="text-right">
          <label className="text-[11px] text-[#333] block mb-1">Choose Your Default Language</label>
          <select
            defaultValue="English"
            className="text-xs rounded border border-black/20 px-2.5 py-1.5 bg-white"
          >
            <option>English</option>
          </select>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 text-[13px] leading-relaxed">
        <p className="text-center font-bold text-base mb-6">Please read the instructions carefully</p>

        <h2 className="font-bold underline mb-2">General Instructions:</h2>
        <ol className="list-decimal pl-5 space-y-2.5 mb-6">
          <li>
            Total duration of <strong>{info.title}</strong> is <strong>{durationMinutes} min</strong>
            {info.mode === "practice" && " (practice mode - you may take as long as you like)"}.
          </li>
          {info.mode === "timed" && (
            <li>
              The clock will be set at the server. The countdown timer at the top of the screen will
              display the remaining time available for you to complete the examination. When the timer
              reaches zero, the examination will end by itself. You will not be required to end or
              submit your examination.
            </li>
          )}
          <li>
            The Question Palette displayed on the right side of the screen will show the status of each
            question using one of the following symbols:
            <div className="mt-3 space-y-2.5">
              {SYMBOL_LEGEND.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.swatch}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </li>
          <li>
            You can click on the <strong>&gt;</strong> arrow which appears to the left of the question
            palette to collapse the question palette, thereby maximizing the question window. To view
            the question palette again, you can click on <strong>&lt;</strong> which appears on the
            right side of the question window.
          </li>
          <li>
            You can click on your <strong>Profile</strong> image on the top right corner of your screen
            to change the language of the exam during the exam.
          </li>
        </ol>

        <h2 className="font-bold underline mb-2">Navigating to a Question:</h2>
        <ol start={5} className="list-decimal pl-5 space-y-2 mb-6">
          <li>
            To answer a question, do the following:
            <ol className="list-[lower-alpha] pl-5 mt-2 space-y-1.5">
              <li>
                Click on the question number in the Question Palette to go to that numbered question
                directly. Note that using this option does <strong>NOT</strong> save your answer to the
                current question.
              </li>
              <li>
                Click on <strong>Save &amp; Next</strong> to save your answer for the current question
                and then go to the next question.
              </li>
              <li>
                Click on <strong>Mark for Review &amp; Next</strong> to save your answer for the current
                question, mark it for review, and then go to the next question.
              </li>
            </ol>
          </li>
        </ol>

        <h2 className="font-bold underline mb-2">Answering a Question:</h2>
        <ol start={6} className="list-decimal pl-5 space-y-1.5 mb-6">
          <li>
            Procedure for answering a multiple choice type question:
            <ol className="list-[lower-alpha] pl-5 mt-2 space-y-1.5">
              <li>To select your answer, click on the button of one of the options.</li>
              <li>
                To deselect your chosen answer, click on the button of the chosen option again or click
                on the <strong>Clear Response</strong> button.
              </li>
              <li>To change your chosen answer, click on the button of another option.</li>
              <li>
                To save your answer, you <strong>MUST</strong> click on the Save &amp; Next button.
              </li>
            </ol>
          </li>
        </ol>

        <h2 className="font-bold underline mb-2">Navigating through sections:</h2>
        <ol start={7} className="list-decimal pl-5 space-y-1.5 mb-8">
          <li>
            Sections in this question paper are displayed at the top of the screen. Questions in a
            section can be viewed by clicking on the section name. The section you are currently viewing
            is highlighted.
          </li>
          <li>
            You can shuffle between sections and questions at any time during the examination as per
            your convenience.
          </li>
        </ol>

        <p className="mb-6">
          Please note all questions will appear in your default language. This language can be changed
          for a particular question later on.
        </p>

        <label className="flex items-start gap-2.5 text-sm cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#3f9142] cursor-pointer"
          />
          <span>
            I have read and understood the instructions. All computer hardware allotted to me are in
            proper working condition. I declare that I am not in possession of / not wearing / not
            carrying any prohibited gadget like mobile phone, bluetooth devices etc. / any prohibited
            material with me into the Examination Hall. I agree that in case of not adhering to the
            instructions, I shall be liable to be debarred from this Test and/or to disciplinary action,
            which may include ban from future Tests / Examinations.
          </span>
        </label>

        <div className="flex justify-center">
          <button
            type="button"
            disabled={!agreed}
            onClick={() => router.push(`/test/${attemptId}`)}
            className="border-2 border-[#3f9142] text-[#3f9142] font-bold text-sm rounded px-10 py-2 hover:bg-[#3f9142] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#3f9142]"
          >
            PROCEED
          </button>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#666] py-4 border-t border-black/10">
        © All Rights Reserved - Quero
      </footer>
    </div>
  );
}
