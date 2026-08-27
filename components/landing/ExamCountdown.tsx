"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EXAMS = [
  { id: "jee-main", label: "JEE Main", date: "2027-01-24T09:00:00+05:30" },
  { id: "cuet-ug", label: "CUET UG", date: "2027-05-15T09:00:00+05:30" },
  { id: "neet-ug", label: "NEET UG", date: "2027-05-03T14:00:00+05:30" },
  { id: "jee-adv", label: "JEE Advanced", date: "2027-05-23T09:00:00+05:30" },
];

function getRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export default function ExamCountdown() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [remaining, setRemaining] = useState(ZERO);

  useEffect(() => {
    const target = new Date(EXAMS[activeIndex].date);
    setRemaining(getRemaining(target));
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [activeIndex]);

  const exam = EXAMS[activeIndex];

  return (
    <div className="relative z-10 mt-10 w-full max-w-md rounded-2xl border border-white/12 bg-white/[0.05] backdrop-blur-md px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div className="relative flex items-center gap-1 rounded-full bg-white/5 p-1">
        {EXAMS.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="relative flex-1 rounded-full px-2 py-1.5 text-center"
          >
            {activeIndex === i && (
              <motion.span
                layoutId="exam-tab-highlight"
                className="absolute inset-0 rounded-full q-gradient-bg"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                activeIndex === i ? "text-white" : "text-white/55"
              }`}
            >
              {e.label}
            </span>
          </button>
        ))}
      </div>

      <input
        type="range"
        min={0}
        max={EXAMS.length - 1}
        step={1}
        value={activeIndex}
        onChange={(e) => setActiveIndex(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--q-grad-a)] cursor-pointer"
        aria-label="Slide to choose an exam"
      />

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {[
          { v: remaining.days, l: "days" },
          { v: remaining.hours, l: "hrs" },
          { v: remaining.minutes, l: "min" },
          { v: remaining.seconds, l: "sec" },
        ].map((u) => (
          <div key={u.l}>
            <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {String(u.v).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/40 mt-1">
              {u.l}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-white/40">
        until {exam.label} {new Date(exam.date).getFullYear()}
      </p>
    </div>
  );
}
