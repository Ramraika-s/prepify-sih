"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

type TabType = "performance" | "audit" | "roster";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<TabType>("performance");

  return (
    <section id="dashboard-preview" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Director Command Dashboard
            </h2>
            <p className="text-zinc-400 text-sm font-normal max-w-xl">
              Real-time analytics for Directors, HODs, and Center Managers across multi-center institute branches.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-[#0D0D11] border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "performance" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Batch Performance
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "audit" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Question Error Audit
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "roster" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Center Roll Roster
            </button>
          </div>
        </div>
      </Reveal>

      {/* Dashboard Preview Shell */}
      <Reveal delay={200}>
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Bar */}
          <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">RESONANCE KOTA - MAIN CAMPUS</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">JEE MAIN FULL MOCK PAPER #8</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400">Total Enrolled:</span>
              <span className="font-bold text-white">2,480 Students</span>
            </div>
          </div>

          {/* Main Dashboard Content Area */}
          <div className="p-6 sm:p-8 space-y-6">
            {activeTab === "performance" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-black/60 border border-zinc-800 p-5 rounded-xl">
                    <div className="text-xs text-zinc-400 font-mono mb-1">Batch Average Score</div>
                    <div className="text-2xl font-bold text-white">184 / 300</div>
                    <div className="text-[11px] text-emerald-400 mt-1 font-mono">↑ +12 pts vs Mock #7</div>
                  </div>
                  <div className="bg-black/60 border border-zinc-800 p-5 rounded-xl">
                    <div className="text-xs text-zinc-400 font-mono mb-1">Top-50 Cutoff Margin</div>
                    <div className="text-2xl font-bold text-emerald-400">238 Marks</div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-mono">Target AIR &lt; 500</div>
                  </div>
                  <div className="bg-black/60 border border-zinc-800 p-5 rounded-xl">
                    <div className="text-xs text-zinc-400 font-mono mb-1">Avg Test Completion</div>
                    <div className="text-2xl font-bold text-white">2h 48m</div>
                    <div className="text-[11px] text-amber-400 mt-1 font-mono">12m Buffer Remaining</div>
                  </div>
                </div>

                <div className="bg-black/40 border border-zinc-800 p-5 rounded-xl font-mono text-xs text-zinc-300">
                  <div className="text-zinc-400 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-800">
                    Subject-wise Accuracy Breakdown (Top Batch vs Overall)
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Physics (Mechanics & Electrodynamics)</span>
                        <span className="text-emerald-400 font-bold">78% Accuracy</span>
                      </div>
                      <div className="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[78%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Chemistry (Organic Reaction Mechanisms)</span>
                        <span className="text-amber-400 font-bold">64% Accuracy</span>
                      </div>
                      <div className="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-amber-500 w-[64%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Mathematics (Calculus & Vectors)</span>
                        <span className="text-rose-400 font-bold">52% Accuracy</span>
                      </div>
                      <div className="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-rose-500 w-[52%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "audit" && (
              <div className="bg-black/40 border border-zinc-800 p-5 rounded-xl font-mono text-xs space-y-4">
                <div className="text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
                  High Error-Rate Questions (Need Faculty Revision Session)
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Q18 - Chemistry (Conformal Isomers)</div>
                      <div className="text-zinc-400 text-[11px]">74% Candidates chose Distractor B instead of C</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      HIGH ERROR RATE
                    </span>
                  </div>
                  <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Q29 - Physics (Rotational Dynamics)</div>
                      <div className="text-zinc-400 text-[11px]">58% Candidates ran out of time (&gt; 4m spent)</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      TIME SINK BOTTLE NECK
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "roster" && (
              <div className="bg-black/40 border border-zinc-800 p-5 rounded-xl font-mono text-xs space-y-3">
                <div className="text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
                  Center Branch Roll Roster (Kota Main, Delhi Janakpuri, Patna Boring Rd)
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-black/60 border border-zinc-800 rounded flex justify-between items-center text-zinc-300">
                    <span>Roll #2026-KT-0041 (Aarav Mehta)</span>
                    <span className="text-emerald-400 font-bold">Score: 268/300 (Est AIR &lt; 250)</span>
                  </div>
                  <div className="p-3 bg-black/60 border border-zinc-800 rounded flex justify-between items-center text-zinc-300">
                    <span>Roll #2026-DL-0118 (Sneha Kapoor)</span>
                    <span className="text-emerald-400 font-bold">Score: 254/300 (Est AIR &lt; 500)</span>
                  </div>
                  <div className="p-3 bg-black/60 border border-zinc-800 rounded flex justify-between items-center text-zinc-300">
                    <span>Roll #2026-PT-0089 (Rahul Verma)</span>
                    <span className="text-emerald-400 font-bold">Score: 242/300 (Est AIR &lt; 900)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
