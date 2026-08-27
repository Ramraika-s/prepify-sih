"use client";

import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import ConstellationField from "./ConstellationField";
import ExamCountdown from "./ExamCountdown";

const STUDENT_COUNT = 511_354;

function MagneticCTA() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: sx, y: sy }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
      <Link
        ref={ref}
        href="/contact-us"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="inline-block rounded-full q-gradient-bg text-white font-semibold text-sm px-7 py-3.5 shadow-[0_10px_30px_rgba(47,107,255,0.35)] hover:brightness-110 transition-[filter]"
      >
        Onboard your institute
      </Link>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  // subtle cursor-parallax tilt on the whole hero content
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 80, damping: 20 });

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--q-ink)] px-4 pt-36 pb-20"
      style={{ perspective: 1200 }}
    >
      <div id="hero-anchor" className="absolute top-0 left-0 w-px h-px" aria-hidden="true" />
      <motion.div style={{ opacity: fieldOpacity }} className="absolute inset-0">
        <ConstellationField />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_35%,rgba(47,107,255,0.08),transparent_65%)] pointer-events-none" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale, rotateX, rotateY }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono tracking-wide text-white/70 mb-6"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[var(--q-grad-a)]"
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-white font-semibold tabular-nums">
            {STUDENT_COUNT.toLocaleString("en-IN")}
          </span>
          students competing for these seats
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-center text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] text-white"
        >
          The digital infrastructure for the next generation of learning.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-center mt-6 text-base sm:text-lg text-white/70 leading-relaxed"
        >
          A real question bank, real sectioned tests, and real oversight for NEET, JEE, CUET
          and every major Indian entrance exam. Made in India, for every institute in it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <MagneticCTA />
          <motion.a
            href="#how-it-works"
            whileHover={{ y: -2 }}
            className="text-sm font-semibold text-white/85 hover:text-white transition-colors underline underline-offset-4 decoration-white/30"
          >
            See how tests are built
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ExamCountdown />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-white/40"
      >
        SCROLL
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-white/30"
        />
      </motion.div>
    </section>
  );
}
