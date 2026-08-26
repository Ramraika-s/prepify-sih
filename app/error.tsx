"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background spatial elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-red-500/10 rounded-full blur-[100px] mix-blend-screen" style={{ willChange: 'transform' }} />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-zinc-600/20 rounded-full blur-[100px] mix-blend-screen" style={{ willChange: 'transform' }} />
      </div>

      {/* Glassmorphism Panel */}
      <div className="z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl max-w-lg w-full shadow-2xl text-center transform-gpu">
        <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-white drop-shadow-lg">
          System Error
        </h1>
        <p className="text-zinc-400 mb-8 font-light leading-relaxed">
          An unexpected error occurred in our systems. Please try again or return to safety.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 text-white font-medium rounded-full border border-white/10 hover:bg-zinc-800 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
