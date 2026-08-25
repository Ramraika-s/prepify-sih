"use client";

import { motion } from "framer-motion";

interface BackgroundVideoProps {
  opacity?: number;
  overlayGradient?: boolean;
}

export default function BackgroundVideo({
  opacity = 0.35,
  overlayGradient = true,
}: BackgroundVideoProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#08080A]">
      {/* Background HTML5 Video with Grayscale Filter */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 grayscale opacity-40 mix-blend-luminosity"
        style={{ opacity }}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Dynamic Animated Pulse Overlay on top of video */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-zinc-800/30 via-slate-900/20 to-transparent blur-[120px] transform-gpu will-change-transform"
      />

      {/* Subtle SVG Grid Overlay Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Gradient Vignette Overlay for Crisp High-Contrast Typography */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080A]/70 via-[#08080A]/40 to-[#08080A]/90" />
      )}
    </div>
  );
}
