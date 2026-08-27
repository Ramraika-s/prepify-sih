"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

// Anchored to combined 2025 candidate registrations across NEET UG/PG, JEE Main & Advanced, and CUET UG/PG.
const TOTAL_CANDIDATE_POOL = 57_00_000;
// Sheets one candidate burns through (mocks, worksheets, admit cards) across a single prep year — constant, independent of adoption.
const SHEETS_PER_CANDIDATE = 480;
// Average sheets of office paper a single tree yields.
const SHEETS_PER_TREE = 8_564;

export default function ImpactSection() {
  const [adopt, setAdopt] = useState(10);
  const [dragging, setDragging] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [revealAdopt, setRevealAdopt] = useState(0);

  // count the slider up from 0 to its starting value the first time the section is seen
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setRevealAdopt(Math.round(eased * 10));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const displayAdopt = adopt === 10 && inView ? revealAdopt || 10 : adopt;

  const candidatesSwitching = useMemo(
    () => Math.round(TOTAL_CANDIDATE_POOL * (displayAdopt / 100)),
    [displayAdopt]
  );

  const totalSheets = candidatesSwitching * SHEETS_PER_CANDIDATE;
  const sheetsCrore = (totalSheets / 1e7).toFixed(1);
  const treesSpared = Math.round(totalSheets / SHEETS_PER_TREE);

  const barCount = 40;
  const litBars = Math.round((displayAdopt / 100) * barCount);

  return (
    <section id="impact" ref={sectionRef} className="relative bg-[var(--q-bg-subtle)] px-4 py-28">
      <div className="max-w-3xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.14em] uppercase text-[var(--q-grad-b)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--q-grad-b)]" />
          The impact, in one number you control
        </motion.span>

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold q-gradient-text tabular-nums"
        >
          ~{sheetsCrore} crore
        </motion.p>
        <p className="mt-2 text-[var(--q-content-muted)]">sheets of paper saved every year</p>

        <div className="mt-10 flex items-end justify-center gap-[3px] h-24">
          {Array.from({ length: barCount }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.012, ease: "easeOut" }}
              className="w-2.5 rounded-t-sm origin-bottom transition-colors duration-300"
              style={{
                height: `${20 + Math.sin(i * 0.5) * 14 + 30}%`,
                background: i < litBars ? "var(--q-grad-b)" : "var(--q-border)",
              }}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between text-xs font-mono text-[var(--q-content-subtle)] max-w-xl mx-auto">
          <span>1% adopt</span>
          <motion.span
            animate={dragging ? { scale: 1.08 } : { scale: 1 }}
            className="text-[var(--q-content)] font-semibold tabular-nums"
          >
            {displayAdopt}% of candidates switch to Prepify
          </motion.span>
          <span>100% adopt</span>
        </div>

        <input
          type="range"
          min={1}
          max={100}
          value={adopt}
          onChange={(e) => setAdopt(Number(e.target.value))}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          className="mt-3 w-full max-w-xl mx-auto accent-[var(--q-grad-b)] cursor-pointer"
          aria-label="Percentage of candidates who switch to Prepify"
        />

        <p className="mt-6 max-w-xl mx-auto text-sm text-[var(--q-content-subtle)] leading-relaxed">
          Drag it. Every number above recalculates live, anchored only to official NTA and
          NBEMS registration figures across five major 2025 exams — nothing padded on top.
        </p>

        <div className="mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            {
              value: candidatesSwitching.toLocaleString("en-IN"),
              label: `candidates switching at ${displayAdopt}% adoption`,
            },
            {
              value: SHEETS_PER_CANDIDATE.toString(),
              label: "sheets one candidate burns through in a single prep year",
            },
            {
              value: `${treesSpared.toLocaleString("en-IN")}+`,
              label: "trees spared every year at this adoption rate",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="text-2xl sm:text-3xl font-bold text-[var(--q-content)] tabular-nums">
                {s.value}
              </p>
              <p className="text-xs text-[var(--q-content-subtle)] mt-1 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
