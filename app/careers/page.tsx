import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | Prepify",
  description: "Join Prepify and help build the future of AI-driven exam preparation and mentorship.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black text-white py-24 px-6 md:px-12 overflow-hidden relative">
      <div className="absolute top-[20%] right-1/4 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Careers</h1>
          <p className="text-xl text-zinc-400 font-light">Build the future of education with us.</p>
        </header>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-2xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">No open roles currently</h2>
          <p className="text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            We are currently full on our core engineering and product teams. However, we are always on the lookout for exceptional talent. If you believe you belong here, send your portfolio to <strong>careers@prepify.ai</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
