"use client";

import Reveal from "@/components/ui/Reveal";

export default function SessionRoadmap() {
  const steps = [
    {
      num: "01",
      title: "Mock Test Telemetry Audit",
      description: "Mentor inspects your past 3 CBT mock scorecards, time spent per question, and hesitation markers.",
    },
    {
      num: "02",
      title: "Attempt Order Formulation",
      description: "Define your optimal subject sequence (e.g., Chemistry 35m -> Physics 60m -> Mathematics 85m).",
    },
    {
      num: "03",
      title: "Negative Marking Protocol",
      description: "Set hard rules on when to skip 50/50 options vs when strategic risk calculation favors attempting.",
    },
    {
      num: "04",
      title: "Weekly Score Iteration",
      description: "Re-evaluate progress after 2 full-length mocks to refine time allocation before final exam day.",
    },
  ];

  return (
    <section id="session-roadmap" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal delay={100}>
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            The 4-Step Paper Strategy Roadmap
          </h2>
          <p className="text-zinc-400 text-sm font-normal max-w-xl">
            A structured framework designed to convert existing subject knowledge into maximum raw marks on exam day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <Reveal key={step.num} delay={150 + idx * 100} className="h-full">
              <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <div className="text-2xl font-extrabold font-mono text-zinc-500 mb-4">{step.num}</div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{step.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-emerald-400">
                  ✓ Measurable Mark Increase
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
