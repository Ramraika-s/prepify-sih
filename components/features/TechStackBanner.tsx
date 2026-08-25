"use client";

import Reveal from "@/components/ui/Reveal";

export default function TechStackBanner() {
  const stats = [
    { label: "CBT Render Latency", value: "< 3.5ms" },
    { label: "Database Isolation", value: "Postgres RLS" },
    { label: "Supported Exams", value: "JEE / NEET / GATE" },
    { label: "Test Data", value: "Real-time" },
  ];

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal delay={100}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-b border-zinc-800">
          {stats.map((s) => (
            <div key={s.label} className="text-left">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
                {s.value}
              </div>
              <div className="text-xs font-mono text-zinc-400 uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
