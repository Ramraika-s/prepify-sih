import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press & News | Prepify",
  description: "Latest news, press releases, and media resources for Prepify.",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-black text-white py-24 px-6 md:px-12 overflow-hidden relative">
      <div className="absolute top-[30%] left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Press & News</h1>
          <p className="text-xl text-zinc-400 font-light">The latest updates from the Prepify ecosystem.</p>
        </header>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-2xl">
          <div className="space-y-8">
            <article className="pb-8 border-b border-white/10">
              <time className="text-xs font-mono text-zinc-500 mb-2 block">August 2026</time>
              <h3 className="text-2xl font-bold mb-3">Prepify launches Enterprise Institute Portal</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Empowering coaching centers to assign faculty, track student cohorts, and manage high-scale CBT testing via our robust new RBAC architecture.
              </p>
            </article>
            
            <article>
              <time className="text-xs font-mono text-zinc-500 mb-2 block">May 2026</time>
              <h3 className="text-2xl font-bold mb-3">Next-Generation Mentorship Hub Released</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Top rankers and expert faculty can now schedule 1-on-1 sessions, upload targeted resources, and view AI-driven analytics of their mentees.
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
