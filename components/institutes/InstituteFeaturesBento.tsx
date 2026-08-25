"use client";

import Reveal from "@/components/ui/Reveal";

export default function InstituteFeaturesBento() {
  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Enterprise B2B Architecture
          </h2>
          <p className="text-zinc-400 text-sm font-normal max-w-xl">
            Designed for coaching chains requiring multi-branch security, custom branding, and automated parent communication.
          </p>
        </div>
      </Reveal>

      {/* Responsive Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Bento Card */}
        <div className="md:col-span-2 lg:col-span-2">
          <Reveal delay={150} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  BRAND CUSTOMIZATION
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Full White-Label Institute Branding
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xl">
                  Host tests on your own custom domain (e.g. <code className="text-zinc-200 bg-black/60 px-2 py-0.5 rounded font-mono">cbt.yourinstitute.com</code>), with your institute logo, custom color headers, and official PDF scorecards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800 text-xs font-mono">
                <div className="bg-black/50 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-white font-bold mb-1">Custom Domain</div>
                  <div className="text-zinc-400 text-[11px]">cbt.coaching.ac.in</div>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-white font-bold mb-1">Custom PDF Cards</div>
                  <div className="text-zinc-400 text-[11px]">Watermarked result sheets</div>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-white font-bold mb-1">Custom App Shell</div>
                  <div className="text-zinc-400 text-[11px]">Institute brand palette</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bento Card 2: Postgres RLS Security */}
        <div>
          <Reveal delay={250} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  DATA ISOLATION
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Multi-Center Postgres RLS Security
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Row Level Security guarantees that your question banks and student transcripts remain 100% private to your institute ID.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-black/60 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                <span>Database Guardrail</span>
                <span className="text-emerald-400 font-bold">ACTIVE (RLS)</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bento Card 3: Bulk Paper Upload */}
        <div>
          <Reveal delay={300} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  QUESTION BANK VAULT
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  LaTeX & Word Paper Import
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Bulk upload test papers formatted in LaTeX, PDF, or Word documents directly into your institute's question vault.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-black/60 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                <span>LaTeX Rendering</span>
                <span className="text-white font-bold">KaTeX Native</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Wide Horizontal Bento Card: Parent WhatsApp Scorecards */}
        <div className="md:col-span-2 lg:col-span-2">
          <Reveal delay={350}>
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  PARENT COMMUNICATION
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Automated WhatsApp & SMS Result Dispatch
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
                  Send instant scorecard summaries, batch percentile rank, and subject breakdown directly to parents upon test completion.
                </p>
              </div>
              <div className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-lg whitespace-nowrap">
                ✓ Auto WhatsApp Dispatch
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
