"use client";

import { motion } from "framer-motion";

const CARDS = [
  { exam: "NEET UG", subjects: "Physics, Chemistry, Botany, Zoology", rotate: -6, accent: "#2f6bff" },
  { exam: "JEE Main & Advanced", subjects: "Physics, Chemistry, Maths", rotate: -2, accent: "#7c3aed" },
  { exam: "CUET UG / PG", subjects: "Domain, language & general test papers", rotate: 2, accent: "#0ea5a5" },
  { exam: "NEET PG & State CETs", subjects: "Every major computer-based entrance test", rotate: 6, accent: "#dc6803" },
];

export default function QuestionBank() {
  return (
    <section className="relative bg-[var(--q-bg)] px-4 py-28 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--q-content) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.14em] uppercase text-[var(--q-grad-b)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--q-grad-b)]" />
          Question bank
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--q-content)] leading-tight">
          Every exam&rsquo;s own syllabus.
          <br />
          Every PYQ, free forever.
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-[var(--q-content-muted)] leading-relaxed">
          Official previous year papers, sourced straight from NTA and NBEMS, are free for
          every student, forever. Each exam&rsquo;s taxonomy is mapped to its current syllabus
          too, so nobody wastes time on chapters that have already been dropped.
        </p>
      </div>

      <div className="relative mt-20 flex flex-wrap items-stretch justify-center gap-6 max-w-5xl mx-auto">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.exam}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: c.rotate }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -10, rotate: 0, scale: 1.02 }}
            className="group relative w-56 flex flex-col rounded-2xl border border-[var(--q-border)] bg-[var(--q-bg-subtle)] shadow-[0_20px_45px_rgba(15,20,35,0.12)] hover:shadow-[0_28px_60px_rgba(15,20,35,0.18)] p-5 transition-shadow"
          >
            <div
              className="absolute top-0 left-5 right-5 h-1 rounded-b-full opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: c.accent }}
              aria-hidden="true"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[var(--q-content-subtle)]">
                Admit card
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: c.accent }}
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-3 text-lg font-semibold text-[var(--q-content)] leading-snug min-h-[3.25rem]">
              {c.exam}
            </h3>
            <p className="mt-1.5 text-xs text-[var(--q-content-muted)] leading-relaxed flex-1">
              {c.subjects}
            </p>

            <div className="mt-6 flex items-center justify-between gap-2">
              <div
                className="h-6 flex-1 rounded-sm"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, var(--q-content) 0 2px, transparent 2px 5px)",
                }}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
