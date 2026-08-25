"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Reveal from "@/components/ui/Reveal";

export default function FeatureInspector() {
  const [activeTab, setActiveTab] = useState<"cbt" | "analytics" | "security">("cbt");
  const tabListRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      id: "cbt",
      label: "CBT Simulation Engine",
      title: "1:1 Test Center Interface Match",
      description: "Generic web forms fail during intense test sessions. Our engine reproduces NTA JEE, NEET, and GATE test screens with zero keystroke delay and exact palette layouts.",
      specs: [
        { key: "Keyboard Control", val: "Alt+S (Save), Alt+M (Mark for Review), Arrow Keys" },
        { key: "Palette Specs", val: "Official NTA Color Specs & Question Status Rules" },
        { key: "Offline Buffering", val: "Local Storage Backup during network interruptions" },
      ],
    },
    {
      id: "analytics",
      label: "Exam Hall",
      title: "Time-per-Question & Panic Diagnosis",
      description: "Tracks hesitation markers, such as spending over 3 minutes on a question before guessing, or switching selected options in the final 30 seconds of a section.",
      specs: [
        { key: "Time Sink Alerts", val: "Flags questions costing excessive time vs average score yield" },
        { key: "Option Switch Log", val: "Audits accuracy rate when changing answers before submission" },
        { key: "Speed vs Accuracy", val: "Detailed breakdown per subject and sub-topic" },
      ],
    },
    {
      id: "security",
      label: "Institutional Security",
      title: "Isolated Multi-Tenant Exam Servers",
      description: "Built on Postgres Row Level Security (RLS). Coaching institutes can upload proprietary question banks and test papers with complete tenant isolation.",
      specs: [
        { key: "Database Isolation", val: "Postgres RLS Policies per Institute ID" },
        { key: "Access Control", val: "Role-based views for Directors, Faculty, and Students" },
        { key: "Audit Logs", val: "Timestamped logs for paper creation and test submissions" },
      ],
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id as any);

    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="text-left mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Architecture Deep Dive
          </h2>
          <p className="text-zinc-400 text-sm font-normal max-w-xl">
            Select a category to review the specific technical implementations inside Prepify.
          </p>
        </div>

        {/* Segmented Tab Bar */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Platform Feature Demonstrations"
          className="inline-flex flex-wrap p-1.5 rounded-xl bg-[#0D0D11] border border-zinc-800 mb-8"
        >
          {tabs.map((tab, idx) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-white ${isSelected
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Accessible Tabpanel */}
        <div
          role="tabpanel"
          id={`panel-${currentTab.id}`}
          aria-labelledby={`tab-${currentTab.id}`}
          className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 sm:p-10 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {currentTab.title}
              </h3>
              <p className="text-zinc-400 font-normal leading-relaxed text-sm sm:text-base mb-6">
                {currentTab.description}
              </p>
            </div>

            <div className="lg:col-span-6 bg-black/60 border border-zinc-800 rounded-xl p-6 space-y-4 text-xs">
              <div className="text-zinc-400 font-mono uppercase tracking-wider text-[11px] pb-2 border-b border-zinc-800">
                Technical Specifications
              </div>
              {currentTab.specs.map((s) => (
                <div key={s.key} className="space-y-1">
                  <div className="text-white font-medium">{s.key}</div>
                  <div className="text-zinc-400 font-mono text-[11px]">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
