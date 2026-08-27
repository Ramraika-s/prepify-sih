"use client";

import Reveal from "@/components/ui/Reveal";

export default function CBTFeaturesBento() {
  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Student Performance Architecture
          </h2>
          <p className="text-zinc-400 text-sm font-normal max-w-xl">
            Tools designed to stop negative marking bleed, estimate rank cutoffs, and ensure test resilience.
          </p>
        </div>
      </Reveal>

      {/* Responsive Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Bento Card: Negative Marking Shield */}
        <div className="md:col-span-2 lg:col-span-2">
          <Reveal delay={150} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  SCORE PROTECTION
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Negative Marking Audit & Prevention Shield
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xl">
                  In JEE and NEET, losing 1 mark to a wrong answer can drop rank by 2,000 positions. Quero isolates questions where blind guessing cost marks versus questions where strategic skipping saved your score.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800 text-xs font-mono">
                <div className="bg-black/50 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-rose-400 font-bold mb-1">-12 Marks Lost</div>
                  <div className="text-zinc-400 text-[11px]">3 Unnecessary guesses in Organic Chem</div>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-emerald-400 font-bold mb-1">+16 Marks Saved</div>
                  <div className="text-zinc-400 text-[11px]">4 Strategic skips in Physics Mechanics</div>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-white font-bold mb-1">Optimum Risk %</div>
                  <div className="text-zinc-400 text-[11px]">Only attempt when 2 options eliminated</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bento Card 2: AIR Estimator */}
        <div>
          <Reveal delay={250} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  RANK PREDICTION
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  AIR & Percentile Estimator
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Benchmarks raw mock scores against past 5-year NTA percentile shift curves and difficulty normalization formulas.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-black/60 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                <span>Estimated Percentile</span>
                <span className="text-emerald-400 font-bold">99.42 %tile</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bento Card 3: Offline Resilience Buffer */}
        <div>
          <Reveal delay={300} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  SESSION RESILIENCE
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Offline Progress Auto-Save Buffer
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Internet disconnects or power outages during a mock session will never wipe your responses. Everything is mirrored locally in IndexedDB.
                </p>
              </div>

              {/* Explicit Visual Offline Status Badge */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Working Offline - Progress Saved</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Wide Horizontal Bento Card */}
        <div className="md:col-span-2 lg:col-span-2">
          <Reveal delay={350}>
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  TARGETED WEAKNESS REMEDIATION
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Automated Error Log & Micro-Quizzes
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
                  Incorrectly answered questions are automatically compiled into a personalized revision queue with step-by-step video solutions.
                </p>
              </div>
              <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-lg transition-all whitespace-nowrap">
                Explore Error Log
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
