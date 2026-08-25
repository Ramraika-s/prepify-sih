"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[200vh] pointer-events-none"
    >
      <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-6 md:px-12">
        <motion.div
          style={{ opacity }}
          className="max-w-5xl w-full text-center mix-blend-difference z-10 pointer-events-auto"
        >
          <h1 className="text-5xl font-light tracking-tight md:text-7xl lg:text-8xl text-white max-w-5xl mx-auto">
            Experience the Real Exam, <br />
            <span className="font-semibold text-white/90">Before the Actual Exam.</span>
          </h1>
          <p className="mt-8 text-lg font-light tracking-wide text-white/70 md:text-xl max-w-3xl mx-auto">
            The ultimate AI-powered Computer Based Test (CBT) platform. Master your revision, get 1-on-1 mentor guidance, and walk into exam day with absolute confidence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:bg-white/90 transition-colors">
              Start Your Free Trial
            </button>
            <button className="px-8 py-4 border border-white/30 text-white rounded-full font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
              For Institutes
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
