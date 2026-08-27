"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const SIDES = [
  {
    id: "institutes",
    eyebrow: "For institutes",
    title: "Run every branch from one dashboard.",
    body: "Group admins see every branch. Branch staff only see their own, so nobody stumbles into another centre's roster by accident.",
    href: "/institutes",
    cta: "Explore institute tools",
    points: [
      "Faculty write and submit questions, then admins approve them before they're usable",
      "Generate full or custom sectioned tests across every branch in minutes",
      "Students join with a code, and you decide who gets let in",
      "A shared question bank across branches, plus a free universal bank",
    ],
  },
  {
    id: "students",
    eyebrow: "For students",
    title: "One join code away from real practice.",
    body: "Enter your institute's code, wait for approval, and you're attempting tests built the way NEET, JEE, CUET and every major exam actually run.",
    href: "/student-cbt",
    cta: "See the CBT simulator",
    points: [
      "Full-length tests, sectioned and timed to match your exam's real pattern",
      "AI-generated retests built from your own mistakes and weak topics",
      "No repeated questions within a test, enforced by the system rather than promised",
      "The exact NTA-style exam interface, so exam day isn't the first time you've seen it",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="w-4 h-4 shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="var(--q-grad-b)" />
      <path
        d="M6 10.2l2.4 2.4L14 7"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TwoSides() {
  return (
    <section id="institutes" className="relative bg-[var(--q-bg)] px-4 py-28">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.14em] uppercase text-[var(--q-grad-b)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--q-grad-b)]" />
          Two sides, one platform
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--q-content)] leading-tight"
        >
          Built for the people who run the classroom, and the ones sitting in it.
        </motion.h2>
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {SIDES.map((col, i) => (
          <motion.div
            key={col.id}
            id={col.id}
            initial={{ opacity: 0, x: i === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
            className="flex flex-col rounded-2xl border border-[var(--q-border)] p-8 transition-shadow hover:shadow-[0_20px_45px_rgba(15,20,35,0.1)]"
          >
            <span className="text-xs font-mono font-semibold tracking-[0.14em] uppercase text-[var(--q-content-subtle)]">
              {col.eyebrow}
            </span>
            <h3 className="mt-3 text-2xl font-semibold text-[var(--q-content)]">{col.title}</h3>
            <p className="mt-3 text-[var(--q-content-muted)] leading-relaxed">{col.body}</p>

            <ul className="mt-6 space-y-3.5">
              {col.points.map((p, pi) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.15 + pi * 0.06 }}
                  className="flex items-start gap-2.5 text-sm text-[var(--q-content-muted)] leading-relaxed text-left"
                >
                  <CheckIcon />
                  {p}
                </motion.li>
              ))}
            </ul>

            <Link
              href={col.href}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--q-grad-b)] hover:underline underline-offset-4"
            >
              {col.cta}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
