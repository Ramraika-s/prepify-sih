"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function CBTHero() {
  return (
    <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="flex flex-col items-start max-w-3xl">
          <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-6">
            NTA & GATE Exam Simulator
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Train in the exact interface you'll face on exam day.
          </h1>

          <p className="text-base sm:text-lg font-normal text-zinc-400 leading-relaxed mb-8">
            Eliminate exam room surprise. Prepify replicates the exact test software used by NTA and IITs for JEE Main, NEET UG, and GATE CS—complete with hardware keyboard shortcuts, color-coded question palettes, and negative marking rules.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#simulator-preview"
              className="px-7 py-3 bg-white text-black font-semibold text-sm rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              Launch Interactive Simulator
            </a>
            <a
              href="#exam-patterns"
              className="px-7 py-3 border border-zinc-700 text-zinc-300 font-medium text-sm rounded-full hover:bg-zinc-900 hover:text-white transition-colors"
            >
              View Exam Patterns & Marking Schemes
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
