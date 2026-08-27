"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "institutes", label: "Institutes" },
  { id: "students", label: "Students" },
  { id: "how-it-works", label: "How it works" },
  { id: "impact", label: "Impact" },
];

export default function SectionDots() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const targets = SECTIONS.map((s) =>
      s.id === "hero" ? document.body : document.getElementById(s.id)
    ).filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target === document.body ? "hero" : entry.target.id;
            setActive(id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    const heroEl = document.getElementById("hero-anchor");
    if (heroEl) observer.observe(heroEl);
    SECTIONS.slice(1).forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => scrollTo(s.id)}
          aria-label={`Jump to ${s.label}`}
          className="group relative flex items-center justify-center w-3 h-3"
        >
          <span
            className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              active === s.id
                ? "bg-[var(--q-grad-a)] scale-100"
                : "bg-[var(--q-content-subtle)]/50 scale-75 group-hover:scale-100 group-hover:bg-[var(--q-content-subtle)]"
            }`}
          />
          {active === s.id && (
            <motion.span
              layoutId="section-dot-ring"
              className="absolute w-3 h-3 rounded-full border border-[var(--q-grad-a)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-md bg-[var(--q-navy)] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            {s.label}
          </span>
        </button>
      ))}
    </div>
  );
}
