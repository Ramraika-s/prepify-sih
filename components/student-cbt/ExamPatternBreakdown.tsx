"use client";

import Reveal from "@/components/ui/Reveal";

export default function ExamPatternBreakdown() {
  const patterns = [
    {
      exam: "JEE Main (Paper 1)",
      conductedBy: "NTA",
      duration: "180 Minutes",
      totalMarks: "300 Marks",
      structure: "90 Questions (MCQs + Section B Numerical Input)",
      marking: "+4 Correct, -1 Incorrect (0 for unattempted)",
      calculator: "Not Allowed",
    },
    {
      exam: "NEET UG",
      conductedBy: "NTA",
      duration: "200 Minutes",
      totalMarks: "720 Marks",
      structure: "200 Questions (Physics, Chemistry, Botany, Zoology)",
      marking: "+4 Correct, -1 Incorrect (0 for unattempted)",
      calculator: "Not Allowed",
    },
    {
      exam: "GATE Computer Science",
      conductedBy: "IITs / IISc",
      duration: "180 Minutes",
      totalMarks: "100 Marks",
      structure: "65 Questions (MCQs, MSQs, NAT Numerical Answers)",
      marking: "+1/+2 MCQs (-0.33/-0.66). ZERO Negative on NATs & MSQs",
      calculator: "Official On-Screen Virtual Calculator Only",
    },
  ];

  return (
    <section id="exam-patterns" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal delay={100}>
        <div className="text-left mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Exam Patterns & Marking Scheme Matrix
          </h2>
          <p className="text-zinc-400 text-sm font-normal max-w-xl">
            Compare official test structures, negative marking rules, and calculator permissions.
          </p>
        </div>

        {/* Matrix Container */}
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Exam</th>
                  <th className="p-4 sm:p-5">Body</th>
                  <th className="p-4 sm:p-5">Duration</th>
                  <th className="p-4 sm:p-5">Total Marks</th>
                  <th className="p-4 sm:p-5">Question Breakdown</th>
                  <th className="p-4 sm:p-5">Marking Rules</th>
                  <th className="p-4 sm:p-5">Calculator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300 font-normal">
                {patterns.map((p) => (
                  <tr key={p.exam} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-white whitespace-nowrap">{p.exam}</td>
                    <td className="p-4 sm:p-5 font-mono text-zinc-400">{p.conductedBy}</td>
                    <td className="p-4 sm:p-5 whitespace-nowrap">{p.duration}</td>
                    <td className="p-4 sm:p-5 font-mono text-emerald-400 font-semibold whitespace-nowrap">{p.totalMarks}</td>
                    <td className="p-4 sm:p-5 min-w-[200px]">{p.structure}</td>
                    <td className="p-4 sm:p-5 min-w-[220px] font-mono text-[11px] text-zinc-300">{p.marking}</td>
                    <td className="p-4 sm:p-5 whitespace-nowrap font-mono text-[11px]">
                      {p.calculator.includes("Virtual") ? (
                        <span className="text-amber-300 font-bold">✓ Virtual Calculator</span>
                      ) : (
                        <span className="text-zinc-500">✕ Not Allowed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
