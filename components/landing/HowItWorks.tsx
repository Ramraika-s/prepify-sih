"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Author or import",
    body: "Write questions from scratch or bulk-import from a spreadsheet. Every question is tagged to its exam and chapter on the way in.",
  },
  {
    n: "02",
    title: "Review & approve",
    body: "Admins move questions from submitted to approved. Nothing unapproved reaches a test.",
  },
  {
    n: "03",
    title: "Build the sections",
    body: "Assemble approved questions into timed, sectioned tests that mirror the real exam's structure - down to the marking scheme.",
  },
  {
    n: "04",
    title: "Publish & attempt",
    body: "Students attempt the test in a CBT-accurate interface. Results and section-wise analysis land the moment they submit.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(1);
  const [auto, setAuto] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: "-200px" });

  useEffect(() => {
    if (!auto || !inView) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % STEPS.length);
    }, 3200);
    return () => clearInterval(id);
  }, [auto, inView]);

  const select = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section id="how-it-works" ref={sectionRef} className="relative bg-[var(--q-bg-subtle)] px-4 py-28">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--q-content)] leading-tight"
        >
          From submitted question to published test.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="mt-5 text-[var(--q-content-muted)] leading-relaxed"
        >
          Every step is gated. A test can&rsquo;t publish until every section is full and
          every question in it has been approved, and there&rsquo;s no print step anywhere
          in between.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.15 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-4 border-t border-[var(--q-border)]">
          {STEPS.map((s, i) => (
            <button
              key={s.n}
              type="button"
              onClick={() => select(i)}
              className="relative text-left px-2 py-5"
            >
              <span className="absolute -top-px left-0 h-0.5 w-full bg-[var(--q-border)]" />
              {active === i && (
                <motion.span
                  layoutId="step-underline"
                  className="absolute -top-px left-0 h-0.5 w-full bg-[var(--q-grad-b)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <motion.span
                animate={{
                  scale: active === i ? 1.08 : 1,
                  backgroundColor: active === i ? "var(--q-grad-b)" : "var(--q-border)",
                  color: active === i ? "#fff" : "var(--q-content-subtle)",
                }}
                transition={{ duration: 0.25 }}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold mb-2"
              >
                {s.n}
              </motion.span>
              <p
                className={`text-sm font-medium transition-colors ${
                  active === i ? "text-[var(--q-content)]" : "text-[var(--q-content-subtle)]"
                }`}
              >
                {s.title}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-10 relative min-h-[7.5rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <span className="absolute -top-6 right-0 text-7xl font-bold text-[var(--q-content)]/5 select-none">
                {STEPS[active].n}
              </span>
              <h3 className="text-2xl font-semibold text-[var(--q-content)]">
                {STEPS[active].title}
              </h3>
              <p className="mt-3 max-w-xl text-[var(--q-content-muted)] leading-relaxed">
                {STEPS[active].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
