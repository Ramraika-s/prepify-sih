"use client";

const EXAMS = ["NEET UG", "JEE Main & Advanced", "CUET UG", "CUET PG", "NEET PG", "State CETs"];

export default function ExamTicker() {
  const doubled = [...EXAMS, ...EXAMS];

  return (
    <div className="relative flex items-stretch bg-[var(--q-cream)] border-y border-[var(--q-border)] overflow-hidden">
      <div className="shrink-0 flex items-center px-6 py-4 border-r border-[var(--q-border)] bg-[var(--q-bg)]">
        <span className="text-[11px] font-mono font-semibold tracking-[0.14em] uppercase text-[var(--q-content-subtle)] whitespace-nowrap">
          Built for India&rsquo;s biggest exams
        </span>
      </div>

      <div className="group relative flex-1 overflow-hidden py-4">
        <div className="flex w-max q-animate-marquee group-hover:[animation-play-state:paused]">
          {doubled.map((exam, i) => (
            <span key={i} className="flex items-center gap-8 px-5">
              <span className="text-sm font-medium text-[var(--q-content-muted)] whitespace-nowrap">
                {exam}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--q-content-subtle)]" aria-hidden="true" />
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--q-cream)] to-transparent" />
      </div>
    </div>
  );
}
