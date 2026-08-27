"use client";

import Reveal from "@/components/ui/Reveal";

export default function InstituteHero() {
  return (
    <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="flex flex-col items-start max-w-3xl">
          <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-6">
            B2B Institute Infrastructure
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Institutional CBT testing & performance analytics.
          </h1>

          <p className="text-base sm:text-lg font-normal text-zinc-400 leading-relaxed mb-8">
            Coaching institutes across Kota, Delhi, Hyderabad, and Patna rely on Quero to host proprietary test papers, manage multi-center student roll numbers, and deliver real-time director performance dashboards.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#b2b-demo"
              className="px-7 py-3 bg-white text-black font-semibold text-sm rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              Schedule Director Demo
            </a>
            <a
              href="#dashboard-preview"
              className="px-7 py-3 border border-zinc-700 text-zinc-300 font-medium text-sm rounded-full hover:bg-zinc-900 hover:text-white transition-colors"
            >
              Explore Director Dashboard
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
