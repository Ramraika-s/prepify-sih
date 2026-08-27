import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Quero",
  description: "Learn about Quero's mission to revolutionize exam preparation through AI-driven CBT and expert mentorship.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white py-24 px-6 md:px-12 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">About Quero</h1>
          <p className="text-xl text-zinc-400 font-light">Democratizing elite exam preparation.</p>
        </header>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-2xl">
          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
            <p>
              Quero was founded with a singular vision: to bring top-tier, NTA-grade Computer Based Testing (CBT) and world-class mentorship to every student, regardless of their geographical location.
            </p>
            <p>
              By bridging the gap between cutting-edge AI analytics and human expertise, we empower aspirants targeting JEE, NEET, GATE, and UPSC to uncover their true potential and optimize their preparation strategy dynamically.
            </p>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-2xl">
          <h2 className="text-2xl font-bold mb-6">Our Approach</h2>
          <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
            <p>
              We believe your digital environment profoundly affects your focus. That&apos;s why the Quero platform is built with a frictionless, minimalist design system. Deep zinc tones, tactile grain, and smooth motion ensure cognitive ease and zero distraction during high-stakes practice sessions.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
