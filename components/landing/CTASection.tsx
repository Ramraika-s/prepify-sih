"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative bg-[var(--q-navy)] px-4 py-28 text-center overflow-hidden">
      <motion.div
        style={{ x: glowX }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(47,107,255,0.18),transparent_60%)] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
          Give your students a test bank that behaves like one.
        </h2>
        <p className="mt-5 text-white/70 leading-relaxed">
          Onboarding is manual and hands-on right now. Talk to us and we&rsquo;ll set your
          institute up directly.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/contact-us"
              className="inline-block rounded-full bg-white text-[var(--q-navy)] font-semibold text-sm px-7 py-3.5 hover:bg-white/90 transition-colors"
            >
              Onboard your institute
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/sign-up"
              className="inline-block rounded-full border border-white/30 text-white font-semibold text-sm px-7 py-3.5 hover:bg-white/10 transition-colors"
            >
              Join as a student
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
