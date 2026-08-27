"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

type ExamType = "jee" | "neet" | "gate";

interface QuestionData {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctOpt: number;
  type?: "mcq" | "nat";
}

const sampleQuestions: Record<ExamType, QuestionData[]> = {
  jee: [
    {
      id: 1,
      subject: "Physics - Electrostatics",
      question: "A point charge q is placed at a distance d/2 directly above the center of a square of side d. The electric flux through the square is:",
      options: ["q / ε₀", "q / 6ε₀", "q / 4ε₀", "q / 2ε₀"],
      correctOpt: 1,
    },
    {
      id: 2,
      subject: "Chemistry - Coordination Compounds",
      question: "Which of the following complexes is expected to absorb visible light of maximum wavelength?",
      options: ["[Co(H₂O)₆]³⁺", "[Co(NH₃)₆]³⁺", "[Co(CN)₆]³⁻", "[Co(F)₆]³⁻"],
      correctOpt: 3,
    },
    {
      id: 3,
      subject: "Mathematics - Calculus",
      question: "The area bounded by the curve y = x |x|, x-axis and the ordinates x = -1 and x = 1 is:",
      options: ["1/3 sq units", "2/3 sq units", "1 sq unit", "4/3 sq units"],
      correctOpt: 1,
    },
  ],
  neet: [
    {
      id: 1,
      subject: "Biology - Human Physiology",
      question: "Which one of the following hormones is responsible for triggering ovulation in the human female?",
      options: ["FSH", "LH", "Estrogen", "Progesterone"],
      correctOpt: 1,
    },
    {
      id: 2,
      subject: "Chemistry - Biomolecules",
      question: "Which of the following vitamins is water-soluble and acts as a coenzyme in amino acid metabolism?",
      options: ["Vitamin A", "Vitamin D", "Pyridoxine (B₆)", "Vitamin K"],
      correctOpt: 2,
    },
    {
      id: 3,
      subject: "Physics - Ray Optics",
      question: "A convex lens of focal length 20 cm forms a real image twice the size of the object. The distance of the object from the lens is:",
      options: ["10 cm", "30 cm", "40 cm", "60 cm"],
      correctOpt: 1,
    },
  ],
  gate: [
    {
      id: 1,
      subject: "Algorithms - Time Complexity",
      question: "What is the worst-case time complexity of finding the median of an unsorted array of n integers using the Deterministic Selection (Median-of-Medians) algorithm?",
      options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
      correctOpt: 1,
      type: "mcq",
    },
    {
      id: 2,
      subject: "Computer Networks - Subnetting (NAT)",
      question: "Calculate the total number of usable host IP addresses in a IPv4 subnet with mask /26.",
      options: ["64", "62", "128", "254"],
      correctOpt: 1,
      type: "nat",
    },
    {
      id: 3,
      subject: "Operating Systems - Process Scheduling",
      question: "Consider 3 processes with CPU burst times 6, 8, 2 ms arriving at time 0. The average waiting time under Shortest Remaining Time First (SRTF) is:",
      options: ["3.0 ms", "4.33 ms", "5.5 ms", "7.0 ms"],
      correctOpt: 0,
      type: "mcq",
    },
  ],
};

export default function SimulatorPreview() {
  const [activeExam, setActiveExam] = useState<ExamType>("jee");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, "answered" | "not_answered" | "review" | "not_visited">>({});
  const [mobileTab, setMobileTab] = useState<"question" | "palette">("question");

  // GATE Calculator Modal State
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState("0");

  const questions = sampleQuestions[activeExam];
  const currentQ = questions[currentQIndex] || questions[0];
  const qKey = `${activeExam}-${currentQ.id}`;

  const handleSelectOption = (optIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [qKey]: optIdx }));
  };

  const handleSaveNext = () => {
    if (selectedOptions[qKey] !== undefined) {
      setQuestionStatuses((prev) => ({ ...prev, [qKey]: "answered" }));
    } else {
      setQuestionStatuses((prev) => ({ ...prev, [qKey]: "not_answered" }));
    }
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handleMarkReview = () => {
    setQuestionStatuses((prev) => ({ ...prev, [qKey]: "review" }));
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handleClearResponse = () => {
    setSelectedOptions((prev) => {
      const copy = { ...prev };
      delete copy[qKey];
      return copy;
    });
    setQuestionStatuses((prev) => ({ ...prev, [qKey]: "not_answered" }));
  };

  const handleCalcClick = (val: string) => {
    if (val === "C") {
      setCalcDisplay("0");
    } else if (calcDisplay === "0") {
      setCalcDisplay(val);
    } else {
      setCalcDisplay(calcDisplay + val);
    }
  };

  return (
    <section id="simulator-preview" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              1:1 Interactive CBT Simulator
            </h2>
            <p className="text-zinc-400 text-sm font-normal max-w-xl">
              Switch exam modes to test the authentic test center interface, question palette rules, and GATE scientific calculator.
            </p>
          </div>

          {/* Exam Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-[#0D0D11] border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => { setActiveExam("jee"); setCurrentQIndex(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeExam === "jee" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              JEE Main
            </button>
            <button
              onClick={() => { setActiveExam("neet"); setCurrentQIndex(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeExam === "neet" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              NEET UG
            </button>
            <button
              onClick={() => { setActiveExam("gate"); setCurrentQIndex(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeExam === "gate" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              GATE CS
            </button>
          </div>
        </div>
      </Reveal>

      {/* Simulator Container */}
      <Reveal delay={200}>
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between text-xs text-zinc-300 font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white uppercase">{activeExam.toUpperCase()} MOCK TEST 2026</span>
              <span className="hidden sm:inline-block text-zinc-600">|</span>
              <span className="hidden sm:inline-block text-zinc-400">{currentQ.subject}</span>
            </div>

            <div className="flex items-center gap-4">
              {activeExam === "gate" && (
                <button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded text-[11px] font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  🧮 GATE Calculator
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Time Left:</span>
                <span className="font-bold text-emerald-400">02:54:18</span>
              </div>
            </div>
          </div>

          {/* Mobile View Toggle Switcher (<768px) */}
          <div className="md:hidden flex border-b border-zinc-800 bg-black/40 text-xs">
            <button
              onClick={() => setMobileTab("question")}
              className={`flex-1 py-2.5 font-medium text-center ${
                mobileTab === "question" ? "bg-zinc-800 text-white border-b-2 border-white" : "text-zinc-400"
              }`}
            >
              Question View
            </button>
            <button
              onClick={() => setMobileTab("palette")}
              className={`flex-1 py-2.5 font-medium text-center ${
                mobileTab === "palette" ? "bg-zinc-800 text-white border-b-2 border-white" : "text-zinc-400"
              }`}
            >
              Question Palette ({questions.length})
            </button>
          </div>

          {/* Main Simulator Workspace (Split View) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
            {/* Left Column: Question Workspace */}
            <div className={`md:col-span-8 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between ${
              mobileTab === "palette" ? "hidden md:flex" : "flex"
            }`}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
                  <span className="text-sm font-bold text-white">
                    Question {currentQIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded">
                    Marking: {activeExam === "gate" && currentQ.type === "nat" ? "+2 / 0 (NAT)" : "+4 / -1"}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-zinc-200 font-normal leading-relaxed mb-6">
                  {currentQ.question}
                </p>

                {/* MCQ Options */}
                <div className="space-y-3 mb-8">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOptions[qKey] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm transition-all border flex items-center justify-between ${
                          isSelected
                            ? "bg-zinc-800 border-white text-white font-medium shadow-sm"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-6 w-6 rounded-full border text-xs font-semibold flex items-center justify-center ${
                            isSelected ? "bg-white text-black border-white" : "border-zinc-700 text-zinc-400"
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveNext}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Save & Next
                  </button>
                  <button
                    onClick={handleMarkReview}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Mark for Review & Next
                  </button>
                </div>
                <button
                  onClick={handleClearResponse}
                  className="px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  Clear Response
                </button>
              </div>
            </div>

            {/* Right Column: Question Palette Sidebar */}
            <div className={`md:col-span-4 p-6 bg-black/40 flex flex-col justify-between ${
              mobileTab === "question" ? "hidden md:flex" : "flex"
            }`}>
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4 pb-3 border-b border-zinc-800">
                  Question Palette
                </div>

                <div className="grid grid-cols-5 gap-2 mb-6">
                  {questions.map((q, idx) => {
                    const key = `${activeExam}-${q.id}`;
                    const status = questionStatuses[key] || "not_visited";
                    const isCurrent = idx === currentQIndex;

                    let statusClass = "bg-zinc-800 border-zinc-700 text-zinc-400";
                    if (status === "answered") statusClass = "bg-emerald-600 border-emerald-500 text-white";
                    if (status === "not_answered") statusClass = "bg-rose-600 border-rose-500 text-white";
                    if (status === "review") statusClass = "bg-amber-600 border-amber-500 text-white";

                    return (
                      <button
                        key={q.id}
                        onClick={() => { setCurrentQIndex(idx); setMobileTab("question"); }}
                        className={`h-9 rounded font-bold text-xs flex items-center justify-center border transition-all ${statusClass} ${
                          isCurrent ? "ring-2 ring-white" : ""
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Legend & Network Buffer Indicator */}
              <div className="space-y-4 pt-4 border-t border-zinc-800 text-[11px] text-zinc-400">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-rose-600" />
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-amber-600" />
                    <span>Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-xs bg-zinc-800 border border-zinc-700" />
                    <span>Not Visited</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-[10px] text-zinc-300 font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Session Progress Auto-Saved to IndexedDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* GATE Scientific Calculator Modal Teaser */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="text-xs font-mono font-bold text-white">GATE VIRTUAL CALCULATOR</div>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-3 mb-4 text-right font-mono text-xl text-emerald-400 overflow-x-auto">
              {calcDisplay}
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              {["sin", "cos", "tan", "C"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="p-3 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors"
                >
                  {btn}
                </button>
              ))}
              {["7", "8", "9", "/"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="p-3 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors"
                >
                  {btn}
                </button>
              ))}
              {["4", "5", "6", "*"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="p-3 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors"
                >
                  {btn}
                </button>
              ))}
              {["1", "2", "3", "-"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="p-3 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors"
                >
                  {btn}
                </button>
              ))}
              {["0", ".", "=", "+"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="p-3 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
