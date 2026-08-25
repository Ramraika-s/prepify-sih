"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FinalCallToAction() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.33], [40, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[200vh] pointer-events-none"
    >
      <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-6 md:px-12">
        <motion.div
          style={{ opacity, y }}
          className="max-w-4xl w-full text-center mix-blend-difference z-10 pointer-events-auto"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
            Ready to Redefine <br/> Exam Success?
          </h2>
          <p className="mt-8 text-lg font-light leading-relaxed text-white/80 md:text-xl max-w-2xl mx-auto">
            Whether you are a student aiming for the top percentile or an institute committed to producing toppers, you now have the tools to make it happen.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Start Practicing Now
            </button>
            <button className="px-8 py-4 border border-white/40 text-white rounded-full font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-md">
              Request a Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
