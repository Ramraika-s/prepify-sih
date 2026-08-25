"use client";

import Reveal from "@/components/ui/Reveal";

export default function ScoreAnalyticsCard() {
  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal delay={100}>
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
              PATTERN DIAGNOSTICS ENGINE
            </div>
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Turn Every Mock Test into a Precision Revision Plan
            </h3>
            <p className="text-zinc-400 font-normal leading-relaxed mb-6 text-sm md:text-base">
              Prepify doesn't just score your test—it diagnoses your decision-making. Discover which questions cost you excessive time, where unforced errors occur, and exactly which topics to revise tonight.
            </p>
            <ul className="space-y-3 text-xs md:text-sm text-zinc-300 font-mono">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Question-by-Question Time Efficiency Curve
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Negative Marking Avoidance Recommendations
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Instant Percentile & Target Cutoff Benchmarking
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 bg-black/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Accuracy Diagnostics</span>
              <span className="text-emerald-400 font-semibold">+18% Target Boost</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[84%]" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-center">
              <div>
                <div className="text-2xl font-bold text-white">84%</div>
                <div className="text-xs text-zinc-400 font-mono">Overall Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">1.2m</div>
                <div className="text-xs text-zinc-400 font-mono">Avg Time / Q</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
