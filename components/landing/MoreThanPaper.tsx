"use client";

import { motion } from "framer-motion";

type CardStyle = "ghost" | "dark" | "blue";

const CARDS: { n: string; title: string; body: string; style: CardStyle }[] = [
  {
    n: "01",
    title: "AI/LLM-powered analytics",
    body: "Every question a student opens, reopens, lingers on, or skips gets logged. Faculty get an AI-generated read on where a student is actually struggling, not just their final score.",
    style: "ghost",
  },
  {
    n: "03",
    title: "Strict proctored mode",
    body: "Tab-switch detection, fullscreen enforcement, and attempt monitoring bring real exam-hall discipline to every online mock test.",
    style: "dark",
  },
  {
    n: "05",
    title: "Offline-first design",
    body: "Built to keep working through patchy connectivity and sync once a connection returns, a real constraint for institutes outside major cities.",
    style: "blue",
  },
  {
    n: "02",
    title: "Mistake-based, AI-generated retests",
    body: "Instead of handing out a generic mock, Quero can build a fresh test from a student's own past mistakes and weak topics, so practice time actually closes gaps.",
    style: "blue",
  },
  {
    n: "04",
    title: "Exact NTA-style exam UI",
    body: "The test-taking screen mirrors the real NTA interface down to the layout, palette, and navigation, so a student's first encounter with it isn't on exam day itself.",
    style: "dark",
  },
  {
    n: "06",
    title: "Multi-tenant, role-based access",
    body: "Super admin, institute admin, faculty, and student each see a different slice. Every institute and branch gets an isolated bank and roster, alongside shared syllabus-mapped content.",
    style: "ghost",
  },
];

function CornerFrame() {
  const corner = "absolute w-3 h-3 border-[var(--q-content-subtle)]";
  return (
    <div className="relative w-14 h-14 mb-6" aria-hidden="true">
      <span className={`${corner} top-0 left-0 border-t border-l`} />
      <span className={`${corner} top-0 right-0 border-t border-r`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

export default function MoreThanPaper() {
  return (
    <section className="relative bg-[var(--q-bg-subtle)] px-4 py-28">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--q-content)] leading-tight"
        >
          More than paper moved online.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="mt-5 text-[var(--q-content-muted)] leading-relaxed"
        >
          Quero adds a layer of intelligence and exam-day realism that no institute, however
          large, currently offers at an accessible price.
        </motion.p>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {CARDS.map((c, i) => {
          const isGhost = c.style === "ghost";
          const isDark = c.style === "dark";
          const isBlue = c.style === "blue";

          return (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className={`rounded-2xl p-8 min-h-[280px] flex flex-col transition-shadow ${
                isGhost
                  ? "border border-dashed border-[var(--q-border)]"
                  : isDark
                  ? "bg-[#0b0f1a] text-white shadow-[0_20px_45px_rgba(15,20,35,0.18)] hover:shadow-[0_28px_60px_rgba(15,20,35,0.28)]"
                  : "q-gradient-bg text-white shadow-[0_20px_45px_rgba(47,107,255,0.25)] hover:shadow-[0_28px_60px_rgba(47,107,255,0.35)]"
              }`}
            >
              {isGhost ? (
                <>
                  <CornerFrame />
                  <span className="text-xs font-mono text-[var(--q-content-subtle)]">{c.n}</span>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--q-content)]">{c.title}</h3>
                  <p className="mt-3 text-sm text-[var(--q-content-muted)] leading-relaxed">
                    {c.body}
                  </p>
                </>
              ) : (
                <>
                  <span
                    className={`text-xs font-mono ${isBlue ? "text-white/70" : "text-white/50"}`}
                  >
                    {c.n}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${isBlue ? "text-white/85" : "text-white/65"}`}>
                    {c.body}
                  </p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
