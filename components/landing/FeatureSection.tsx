"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export interface SubFeature {
  title: string;
  description: string;
}

interface FeatureSectionProps {
  headline: string;
  subHeadline: string;
  features: SubFeature[];
  alignment?: "left" | "right" | "center";
}

export default function FeatureSection({
  headline,
  subHeadline,
  features,
  alignment = "center",
}: FeatureSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll from when section top enters viewport bottom to when section bottom exits viewport top
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 0 -> 0.33 (100vh): Slide & fade in as previous section exits
  // 0.33 -> 0.66 (100vh): Solid 100% hold in exact viewport center
  // 0.66 -> 1.0 (100vh): Slide & fade out as next section enters
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.33, 0.66, 1], 
    [0, 1, 1, 0]
  );
  
  const y = useTransform(
    scrollYProgress,
    [0, 0.33],
    [40, 0]
  );

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[200vh] pointer-events-none"
    >
      {/* Sticky container locked to full viewport height (100dvh) */}
      <div className="sticky top-0 h-dvh w-full flex items-center justify-center px-6 md:px-12">
        <motion.div
          style={{ opacity, y }}
          className="max-w-5xl w-full text-center mix-blend-difference z-10 pointer-events-auto"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
            {headline}
          </h2>
          
          <p className="mt-6 text-lg font-light leading-relaxed text-white/80 md:text-xl max-w-3xl mx-auto">
            {subHeadline}
          </p>

          {/* Sub-features in a sleek, compact horizontal 3-column layout */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-start"
              >
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
