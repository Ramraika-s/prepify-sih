"use client";

import { motion } from "framer-motion";

export default function TrustStatement() {
  return (
    <section className="relative bg-[var(--q-bg)] px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 mx-auto mb-4" aria-hidden="true">
          <path
            d="M5 12.5l4.5 4.5L19 7"
            stroke="var(--q-grad-b)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[var(--q-content-muted)] leading-relaxed">
          <span className="font-semibold text-[var(--q-content)]">Sourced properly, not scraped. </span>
          Prepify&rsquo;s question bank draws from each exam&rsquo;s own official papers and answer
          keys, across NEET, JEE, CUET and more, with explanations written by our own faculty
          rather than bulk-imported from copyrighted PYQ compilations.
        </p>
      </motion.div>
    </section>
  );
}
