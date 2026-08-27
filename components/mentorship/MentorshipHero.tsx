"use client";

import Reveal from "@/components/ui/Reveal";

export default function MentorshipHero() {
  return (
    <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="flex flex-col items-start max-w-3xl">
          <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-6">
            Expert Ranker Mentorship Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            1-on-1 strategy guidance from top AIR rankers.
          </h1>

          <p className="text-base sm:text-lg font-normal text-zinc-400 leading-relaxed mb-8">
            Coaching institutes teach you concepts. Quero mentors teach you how to attempt the paper under 3-hour pressure-helping you build negative marking protocols, subject time allocations, and exam-room anxiety control.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#mentor-grid"
              className="px-7 py-3 bg-white text-black font-semibold text-sm rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              Browse Active Mentors
            </a>
            <a
              href="#session-roadmap"
              className="px-7 py-3 border border-zinc-700 text-zinc-300 font-medium text-sm rounded-full hover:bg-zinc-900 hover:text-white transition-colors"
            >
              View 4-Step Strategy Roadmap
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
