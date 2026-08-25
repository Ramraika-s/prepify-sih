"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

export default function FeatureMatrix() {
  const [activeSubTab, setActiveSubTab] = useState<"keys" | "timer" | "buffer">("keys");
  const [demoActive, setDemoActive] = useState(false);

  const subTabDetails = {
    keys: "Keyboard Shortcuts: Alt+S saves response, Alt+M marks question for review, Arrow keys navigate palette.",
    timer: "Exact Timer Specs: Countdown synced with test center NTP server with microsecond precision.",
    buffer: "Local State Buffer: Stores all question answers in browser IndexedDB in case of network drops.",
  };

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Core System Capabilities
          </h2>
          <p className="text-zinc-400 text-sm font-normal max-w-xl">
            Engineered to address documented failure points in competitive computer-based examinations.
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
                  CBT RENDERING ENGINE
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Sub-5ms Canvas Interface Replication
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xl">
                  Web forms introduce layout shifting and input lag. Our custom engine uses HTML5 Canvas rendering to guarantee exact NTA and GATE test layouts, even during 3-hour continuous test runs.
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                {/* Interactive Sub-tab Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {(["keys", "timer", "buffer"] as const).map((tabKey) => (
                    <button
                      key={tabKey}
                      onClick={() => setActiveSubTab(tabKey)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        activeSubTab === tabKey
                          ? "bg-zinc-800 border-zinc-600 text-white font-medium shadow-sm"
                          : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {tabKey === "keys" && "Keyboard Bindings"}
                      {tabKey === "timer" && "< 5ms Render Spec"}
                      {tabKey === "buffer" && "Auto State Buffer"}
                    </button>
                  ))}
                </div>

                {/* Dynamic Active Info Banner */}
                <div className="p-3.5 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono text-zinc-300">
                  {subTabDetails[activeSubTab]}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Medium Bento Card 1 */}
        <div>
          <Reveal delay={250} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  TIME ALLOCATION
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Hesitation & Time Sink Detection
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Identifies questions where candidates spend over 3 minutes before guessing, preventing time mismanagement during actual exams.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex items-center justify-between">
                <span>Hesitation Alert Level</span>
                <span className="text-emerald-400 font-bold">NORMAL</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Medium Bento Card 2 */}
        <div>
          <Reveal delay={300} className="h-full">
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                  DECISION QUALITY
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Option Elimination Record
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Tracks how effectively candidates strike out incorrect options before selecting their final response.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex items-center justify-between">
                <span>Elimination Ratio</span>
                <span className="text-white font-bold">3.2 / 4.0</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Wide Horizontal Bento Card */}
        <div className="md:col-span-2 lg:col-span-2">
          <Reveal delay={350}>
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  INSTITUTIONAL DEPLOYMENT
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  White-Label Coaching Exam Hosting
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
                  Coaching centers can upload proprietary question banks, schedule batch tests, and issue official CBT score cards.
                </p>
              </div>
              <button
                onClick={() => setDemoActive(!demoActive)}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-lg transition-all whitespace-nowrap active:scale-95"
              >
                {demoActive ? "✓ Enterprise Spec Active" : "Interactive Spec View"}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
