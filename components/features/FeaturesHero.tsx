"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function FeaturesHero() {
  const [questionStates, setQuestionStates] = useState<Record<number, "answered" | "not_answered" | "review" | "not_visited">>({
    1: "answered",
    2: "answered",
    3: "not_answered",
    4: "review",
    5: "not_visited",
  });

  const [activeQuestion, setActiveQuestion] = useState(3);

  const cycleStatus = (qNum: number) => {
    const statusCycle: Array<"answered" | "not_answered" | "review" | "not_visited"> = [
      "answered",
      "not_answered",
      "review",
      "not_visited",
    ];
    const current = questionStates[qNum];
    const nextIdx = (statusCycle.indexOf(current) + 1) % statusCycle.length;
    setQuestionStates((prev) => ({ ...prev, [qNum]: statusCycle[nextIdx] }));
    setActiveQuestion(qNum);
  };

  const getStatusColor = (status: "answered" | "not_answered" | "review" | "not_visited") => {
    switch (status) {
      case "answered":
        return "bg-emerald-600 border-emerald-500 text-white";
      case "not_answered":
        return "bg-rose-600 border-rose-500 text-white";
      case "review":
        return "bg-amber-600 border-amber-500 text-white";
      case "not_visited":
        return "bg-zinc-800 border-zinc-700 text-zinc-400";
    }
  };

  const counts = {
    answered: Object.values(questionStates).filter((s) => s === "answered").length,
    not_answered: Object.values(questionStates).filter((s) => s === "not_answered").length,
    review: Object.values(questionStates).filter((s) => s === "review").length,
    not_visited: Object.values(questionStates).filter((s) => s === "not_visited").length,
  };

  return (
    <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Editorial Copy Column */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <Reveal delay={100}>
            <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-6">
              Platform Architecture
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Built for the realities of Computer-Based Tests.
            </h1>

            <p className="text-base sm:text-lg font-normal text-zinc-400 leading-relaxed mb-8 max-w-2xl">
              Standard mock test portals only record right or wrong answers. Prepify replicates actual test center software and measures how you spend your time under exam hall pressure.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/student-cbt"
                className="px-7 py-3 bg-white text-black font-semibold text-sm rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
              >
                Open CBT Simulator
              </Link>
              <Link
                href="/institutes"
                className="px-7 py-3 border border-zinc-700 text-zinc-300 font-medium text-sm rounded-full hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Institute Solutions
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right Interactive CBT Interface Mockup */}
        <div className="lg:col-span-5">
          <Reveal delay={250}>
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6 text-xs text-zinc-400 font-mono">
                <span>EXAM: JEE MAIN 2026 (INTERACTIVE)</span>
                <span className="text-white font-bold animate-pulse">02:45:12</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-medium">Question {activeQuestion} Palette State:</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Click to toggle status</span>
                </div>

                {/* Interactive Palette Grid */}
                <div className="grid grid-cols-5 gap-2.5">
                  {[1, 2, 3, 4, 5].map((qNum) => {
                    const status = questionStates[qNum];
                    const isActive = activeQuestion === qNum;
                    return (
                      <button
                        key={qNum}
                        onClick={() => cycleStatus(qNum)}
                        className={`h-10 rounded font-bold text-xs flex items-center justify-center border transition-all transform hover:scale-105 active:scale-95 ${getStatusColor(
                          status
                        )} ${isActive ? "ring-2 ring-white" : ""}`}
                        title={`Question ${qNum}: ${status.replace("_", " ").toUpperCase()} (Click to toggle)`}
                      >
                        {qNum}
                      </button>
                    );
                  })}
                </div>

                {/* Real-time Status Counters */}
                <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" />
                    <span>Answered ({counts.answered})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-rose-600" />
                    <span>Not Answered ({counts.not_answered})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-amber-600" />
                    <span>Marked for Review ({counts.review})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-zinc-800 border border-zinc-700" />
                    <span>Not Visited ({counts.not_visited})</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
